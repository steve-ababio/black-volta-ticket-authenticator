import { useState } from "react";
import { Header } from "@/components/Header";
import { TicketScanner } from "@/components/TicketScanner";
import { VerificationResult } from "@/components/VerificationResult";
import { RecentScans } from "@/components/RecentScans";
import { toast } from "sonner";

interface TicketData {
  code: string;
  valid: boolean;
  eventName?: string;
  eventDate?: string;
  venue?: string;
  ticketHolder?: string;
  ticketType?: string;
  alreadyUsed?: boolean;
}

interface ScanRecord {
  code: string;
  valid: boolean;
  timestamp: Date;
  eventName?: string;
}

// Mock database of valid tickets
const MOCK_TICKETS: Record<string, Omit<TicketData, 'code'>> = {
  "BV2024-AFRO-1234": {
    valid: true,
    eventName: "Afrochella 2024",
    eventDate: "December 28-29, 2024",
    venue: "El Wak Sports Stadium, Accra",
    ticketHolder: "Kwame Asante",
    ticketType: "VIP Pass",
  },
  "BV2024-DETTY-5678": {
    valid: true,
    eventName: "Detty December Concert",
    eventDate: "December 25, 2024",
    venue: "Independence Square, Accra",
    ticketHolder: "Ama Serwaa",
    ticketType: "General Admission",
  },
  "BV2024-LIVE-9012": {
    valid: true,
    eventName: "BlacVolta Live Sessions",
    eventDate: "December 31, 2024",
    venue: "Alliance Française, Accra",
    ticketHolder: "Kofi Mensah",
    ticketType: "Premium",
    alreadyUsed: true,
  },
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<TicketData | null>(null);
  const [recentScans, setRecentScans] = useState<ScanRecord[]>([]);

  const handleVerify = async (code: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const ticketData = MOCK_TICKETS[code];
    
    const result: TicketData = ticketData 
      ? { code, ...ticketData }
      : { code, valid: false };
    
    setVerificationResult(result);
    
    // Add to recent scans
    setRecentScans(prev => [{
      code,
      valid: result.valid && !result.alreadyUsed,
      timestamp: new Date(),
      eventName: result.eventName,
    }, ...prev].slice(0, 20));
    
    // Show toast notification
    if (result.valid && !result.alreadyUsed) {
      toast.success("Valid ticket!", {
        description: result.eventName,
      });
    } else if (result.alreadyUsed) {
      toast.error("Ticket already used!", {
        description: "This ticket has been scanned before.",
      });
    } else {
      toast.error("Invalid ticket!", {
        description: "This ticket code was not found.",
      });
    }
    
    setIsLoading(false);
  };

  const handleReset = () => {
    setVerificationResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
      <div 
        className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{ background: 'var(--gradient-glow)' }}
      />
      
      <main className="relative container mx-auto px-4 py-8 max-w-md">
        <div className="space-y-8">
          {/* Main Scanner Card */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border p-6 shadow-2xl">
            {verificationResult ? (
              <VerificationResult 
                result={verificationResult} 
                onReset={handleReset} 
              />
            ) : (
              <>
                <div className="text-center mb-6">
                  <h2 className="font-display font-bold text-xl">Verify Ticket</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Scan QR code or enter ticket code
                  </p>
                </div>
                <TicketScanner 
                  onVerify={handleVerify} 
                  isLoading={isLoading} 
                />
              </>
            )}
          </div>
          
          {/* Recent Scans */}
          <RecentScans scans={recentScans} />
          
          {/* Demo Hint */}
          <div className="text-center text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
            <p className="font-medium mb-1">Demo Mode</p>
            <p>Try codes: BV2024-AFRO-1234, BV2024-DETTY-5678</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
