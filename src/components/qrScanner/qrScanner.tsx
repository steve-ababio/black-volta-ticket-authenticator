import { useEffect, useMemo, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import TicketValidatorForm from "../ticket-validator-form/ticket-validator-form";
import { TicketVerificationService } from "@/services/verification.service";
import { toast } from "sonner";
import { TicketData, TicketResponse, TicketVerificationResult } from "@/common/types/types";
import { AxiosError } from "axios";
import { useQrScannerLock } from "@/hooks/use-qr-scanner-lock";
import { useOfflineCheckInQueue } from "@/hooks/use-offline-check-in-queue";
import { logScanAudit } from "@/utils/utils";
import OfflineQueueView from "../offline-queue-view/offline-queue-view";

interface QRScannerProps {
  open: boolean;
  onClose: () => void;
  eventTitle: string;
  eventLocation:string;
  eventId:number;
}
type ScanStatus = "scanning" | "success" | "error";

const QRScanner = ({ open, onClose, eventTitle,eventLocation,eventId }: QRScannerProps) => {
	const [status, setStatus] = useState<ScanStatus>("scanning");
	const [scannedData, setScannedData] = useState<string>("");
	const {enqueue, sync } = useOfflineCheckInQueue();
	const [verified,setVerified] = useState<TicketVerificationResult>();
	const [isStarting, setIsStarting] = useState(false);
	const scannerRef = useRef<Html5Qrcode | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const qrLock = useQrScannerLock({
		cooldownMs: 2000, // ⏱️ retry cooldown (2s)
	});
  const successbeepRef = useMemo(
    () =>
		typeof Audio !== "undefined"
		? new Audio("/assets/audio/success-sound.mp3")
		: null,
    []
  );
	const failureBeepRef = useMemo(
		() =>
			typeof Audio !== "undefined"
			? new Audio("/assets/audio/failure-sound.mp3")
			: null,
	[]);

	useEffect(() => {
		if (open && status === "scanning") {
			startScanner();
		}
		return () => {
			stopScanner();
		};
	}, [open]);
	useEffect(() => {
		const handleVisibility = () => {
		  if (document.hidden) stopScanner();
		  else if (open && status === "scanning") startScanner();
		};
	  
		document.addEventListener("visibilitychange", handleVisibility);
		return () =>
		  document.removeEventListener("visibilitychange", handleVisibility);
	}, [open, status]);

	const startScanner = async () => {
		if (!containerRef.current || scannerRef.current) return;
		setIsStarting(true);
		
		try {
		const scanner = new Html5Qrcode("qr-reader");
		scannerRef.current = scanner;

		await scanner.start(
			{ facingMode: "environment" },
			{
				fps: 10,
				qrbox: { width: 230, height: 330 },
  				disableFlip: true,
			},
			(decodedText) => {
				if (!qrLock.canProcess(decodedText)) return;
				verifyQrCode(decodedText);
			},
			() => {
			// Ignore scan errors (no QR found yet)
			}
		);
		} catch (err) {
			toast.error("Failed to start scanner");
		console.error("Failed to start scanner:", err);
		} finally {
			setIsStarting(false);
		}
	};
	useEffect(() => {
		if (open && status === "scanning") {
			const timeout = setTimeout(() => startScanner(), 50);
			return () => clearTimeout(timeout);
		}
	}, [open, status]);
	  
	const stopScanner = async () => {
		if (scannerRef.current) {
			try {
				await scannerRef.current.stop();
				scannerRef.current.clear();
			} catch (err) {
				console.error("Failed to stop scanner:", err);
			}
			scannerRef.current = null;
		}
	};

	const fail = (reason: string) => {
		playFailureSound();
		setStatus("error");
		return { valid: false, reason };
	};
	
	const checkIn = async (data: TicketData) => {
		const response = await TicketVerificationService.verifyTicket(data);
		if (!response?.success || !response?.data) {
			return fail(response?.message ?? "Verification failed");
		}
		const ticket = response.data as TicketResponse;
		const now = new Date();
	
		if (ticket.status !== "active") {
			return fail("Ticket is not active");
		}
	
		if (ticket.is_used) {
			return fail("Ticket already used");
		}
	
		if (!ticket.qr_code?.is_active) {
			return fail("QR code is inactive");
		}
	
		const eventStart = new Date(ticket.event.start_date);
		const eventEnd = new Date(ticket.event.end_date);
	
		if (now < eventStart || now > eventEnd) {
			return fail("Event is not active");
		}
	
		if (!ticket.ticket_type?.is_active) {
			return fail("Ticket type inactive");
		}
	
		setStatus("success");
		playSuccessSound();
		return { valid: true, ticket };
	};
  
	function playSuccessSound(){
		successbeepRef?.play().catch(() => {});
		navigator.vibrate?.(400);   
	}
	function playFailureSound() {
		failureBeepRef?.play().catch(() => {});
		navigator.vibrate?.(400);   
	}
	async function verifyQrCode(data: string) {
		const unserializedData = JSON.parse(data);
		const payload:TicketData = {
			qr_code_data:data,
			check_in_location:eventLocation,
			notes: "",
			event_id:eventId
		}
		const staffId = JSON.parse(localStorage.getItem("ticketverify_auth") as string);
		
		try {
			const result = await checkIn(payload);
			setVerified(result);
			// logScanAudit({
			// 	staffId: staffId,
			// 	ticketRef: data,
			// 	method: "qr",
			// 	result: verified.valid ? "success" : "error",
			// 	reason: verified.reason,
			// 	timestamp: Date.now(),
			// 	location: eventLocation,
			// 	offline: !navigator.onLine,
			// });
			console.log("data:",unserializedData);
			setScannedData(unserializedData.ticket_number);
			stopScanner();
		} catch (error: unknown) {
			playFailureSound();
			
			const isNetworkFailure = error instanceof AxiosError && error.code === "ERR_NETWORK";
			const isOffline = !navigator.onLine || isNetworkFailure;
			
			// Queue ONLY when offline / network failure
			if (isOffline) {
				// enqueue(payload);
				toast.warning("Offline: check your internet connection.");
				return;
			}
		  
			// ---- Axios errors (online, server responded) ----
			if (error instanceof AxiosError) {
				qrLock.reset();
			  	const data = error.response?.data;
		  
			  	const primaryMessage =
				data?.message ?? "Ticket verification failed";
		  
			  	const secondaryMessage =
				data?.errors?.ticket_number?.[0]?.message ??
				data?.errors?.ticket_number ??
				data?.error;
		  
				toast.error(
					secondaryMessage
					? `${primaryMessage}: ${secondaryMessage}`
					: primaryMessage
				);
		  
			  	return;
			}
		  
			if (error instanceof Error) {
				const message = error.message;
				toast.error(message);
				return;
			}
			toast.error("Unexpected error occurred");
		  }
		  
  	}
	async function verifyTicketCode(data: string) {
		const payload:TicketData = {
			ticket_number:data,
			check_in_location:eventLocation,
			notes: "",
			event_id:eventId
		}
		try {
			const result = await checkIn(payload);
			setVerified(result);
			setScannedData(data);
			stopScanner();
		} catch (error) {
			playFailureSound();
			if (error instanceof AxiosError) {
				const message = error.response.data.message;
				const secondaryMessage = error.response.data.errors.ticket_number[0].message;
				toast.error(`${message}: ${secondaryMessage}`);
			}
		}
  	}
	const handleClose = () => {
		qrLock.reset();
		stopScanner();
		setStatus("scanning");
		setScannedData("");
		onClose();
	};
	const handleScanAgain = () => {
		qrLock.reset();
		setStatus("scanning");
		setScannedData("");
		setTimeout(() => startScanner(), 100);
	};

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className=" h-full md:h-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <Camera className="w-5 h-5 text-[@1c1d1d]" />
            Verify Ticket
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground mb-4">
          Scanning ticket for: <span className="font-semibold text-foreground">{eventTitle}</span>
        </p>

        {status === "scanning" && (
          <div className="space-y-4">
            <div 
              ref={containerRef}
              className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted"
            >
              <div id="qr-reader" className="absolute inset-0 w-full h-full" />
              
              {isStarting && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <div className="text-center space-y-2">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                    <p className="text-sm text-muted-foreground">Starting camera...</p>
                  </div>
                </div>
              )}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Position the QR code within the frame
            </p>
          </div>
        )}

        {(status === "success" && verified.valid) &&  (
          <div className="text-center space-y-4 py-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground font-display">Ticket Verified!</h3>
              <p className="text-sm text-muted-foreground mt-1">This ticket is valid for entry</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Ticket ID</p>
              <p className="font-mono text-sm text-foreground truncate">{verified.ticket.ticket_number}</p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={handleScanAgain} className="flex-1">
                Scan Another
              </Button>
              <Button onClick={handleClose} className="flex-1">
                Done
              </Button>
            </div>
          </div>
        )}

        {(status === "error" && !verified.valid) && (
          <div className="text-center space-y-4 py-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-destructive" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground font-display">Invalid Ticket</h3>
              <p className="text-sm text-muted-foreground mt-1">{verified.reason}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-base text-muted-foreground">Ticket Code:  <span className="font-mono font-medium text-sm text-foreground truncate">{scannedData}</span></p>
             
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={handleScanAgain} className="flex-1">
                Try Again
              </Button>
              <Button variant="destructive" onClick={handleClose} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        )}
        <TicketValidatorForm verifyTicket={verifyTicketCode} isScanning={status === "scanning"} scanStatus={status} />
      </DialogContent>
    </Dialog>
  );
};

export default QRScanner;
