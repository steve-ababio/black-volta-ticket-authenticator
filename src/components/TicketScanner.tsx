import { useState } from "react";
import { QrCode, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TicketScannerProps {
  onVerify: (code: string) => void;
  isLoading: boolean;
}

export function TicketScanner({ onVerify, isLoading }: TicketScannerProps) {
  const [ticketCode, setTicketCode] = useState("");
  const [scanMode, setScanMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticketCode.trim()) {
      onVerify(ticketCode.trim().toUpperCase());
    }
  };

  const handleScanSimulation = () => {
    setScanMode(true);
    // Simulate QR scan with random ticket code
    setTimeout(() => {
      const mockCodes = ["BV2024-AFRO-1234", "BV2024-DETTY-5678", "BV2024-LIVE-9012", "INVALID-CODE"];
      const randomCode = mockCodes[Math.floor(Math.random() * mockCodes.length)];
      setTicketCode(randomCode);
      setScanMode(false);
      onVerify(randomCode);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* QR Scanner Area */}
      <div 
        className="relative aspect-square max-w-xs mx-auto rounded-2xl border-2 border-dashed border-primary/30 bg-muted/50 overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
        onClick={handleScanSimulation}
      >
        {scanMode ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="w-full h-1 bg-primary/80 animate-scan" />
            <Scan className="w-16 h-16 text-primary animate-pulse" />
            <p className="text-sm text-muted-foreground">Scanning...</p>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <QrCode className="w-20 h-20 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground text-center px-4">
              Tap to scan QR code
            </p>
          </div>
        )}
        
        {/* Corner markers */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-sm text-muted-foreground">or enter manually</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Manual Entry Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Enter ticket code (e.g., BV2024-XXXX-0000)"
          value={ticketCode}
          onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
          className="text-center font-mono tracking-wider text-lg"
          disabled={isLoading || scanMode}
        />
        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={!ticketCode.trim() || isLoading || scanMode}
          variant="glow"
        >
          {isLoading ? "Verifying..." : "Verify Ticket"}
        </Button>
      </form>
    </div>
  );
}
