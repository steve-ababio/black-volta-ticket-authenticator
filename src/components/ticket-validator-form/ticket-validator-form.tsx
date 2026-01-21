import { Button } from "../ui/button";
import { Input } from "../ui/input"
import { FormEvent, useEffect, useRef, useState } from "react";
export interface TicketValidatorFormProps {
    isScanning: boolean;
    scanStatus:  "scanning" | "success" | "error";
    verifyTicket:(data:string)=>Promise<void>
}
export default function TicketValidatorForm({verifyTicket}:TicketValidatorFormProps) {
    const [ticketCode, setTicketCode] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    async function submit(e: FormEvent) {
        e.preventDefault();
        setIsVerifying(true);
        try{
            await verifyTicket(ticketCode);
        }finally{
            setIsVerifying(false);
        }
    }
    useEffect(() => {
        const id = requestAnimationFrame(() => {
          inputRef.current?.blur();
        });
      
        return () => cancelAnimationFrame(id);
    }, []);
    return(
        <div className="flex flex-col items-center gap-4">
            <div className="flex w-full items-center justify-start gap-4">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-sm text-muted-foreground">or enter manually</span>
                <div className="flex-1 h-px bg-slate-200" ></div>
            </div>
            {/* MANUAL ENTRY */}
            <form onSubmit={submit} className="space-y-4 w-full">
                <Input
                    autoFocus={false}
                    placeholder="Enter ticket code"
                    value={ticketCode}
                    onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
                    disabled={isVerifying}
                    ref={inputRef}
                    className="text-center bg-white rounded-md w-full tracking-wide text-lg"
                />
                <Button
                    type="submit"
                    className="w-full rounded-md bg-[#1c1d1d]"
                    size="lg"
                    // onClick={submit}
                >
                {isVerifying ? "Verifying..." : "Verify Ticket"}
                </Button>
            </form>
        </div>
)

}