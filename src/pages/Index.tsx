import { useState } from "react";
import { Header } from "@/components/Header";
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

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<TicketData | null>(null);
  const [recentScans, setRecentScans] = useState<ScanRecord[]>([]);


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
      </main>
    </div>
  );
};

export default Index;
