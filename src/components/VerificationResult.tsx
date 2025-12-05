import { CheckCircle2, XCircle, Ticket, Calendar, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface VerificationResultProps {
  result: TicketData | null;
  onReset: () => void;
}

export function VerificationResult({ result, onReset }: VerificationResultProps) {
  if (!result) return null;

  const isValid = result.valid && !result.alreadyUsed;

  return (
    <div className="animate-scale-in space-y-6">
      {/* Status Badge */}
      <div 
        className={`
          relative p-8 rounded-2xl text-center
          ${isValid 
            ? 'bg-success/10 border border-success/30 glow-success' 
            : 'bg-destructive/10 border border-destructive/30 glow-destructive'
          }
        `}
      >
        <div className="flex flex-col items-center gap-4">
          {isValid ? (
            <CheckCircle2 className="w-20 h-20 text-success animate-fade-in" />
          ) : (
            <XCircle className="w-20 h-20 text-destructive animate-fade-in" />
          )}
          
          <div>
            <h2 className={`text-2xl font-display font-bold ${isValid ? 'text-success' : 'text-destructive'}`}>
              {isValid ? 'VALID TICKET' : result.alreadyUsed ? 'ALREADY USED' : 'INVALID TICKET'}
            </h2>
            <p className="text-muted-foreground mt-1 font-mono">
              {result.code}
            </p>
          </div>
        </div>
      </div>

      {/* Ticket Details */}
      {isValid && result.eventName && (
        <div className="bg-card rounded-xl p-6 space-y-4 border border-border animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Ticket className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Event</p>
              <p className="font-semibold">{result.eventName}</p>
            </div>
          </div>
          
          {result.eventDate && (
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Calendar className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Date</p>
                <p className="font-semibold">{result.eventDate}</p>
              </div>
            </div>
          )}
          
          {result.venue && (
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Venue</p>
                <p className="font-semibold">{result.venue}</p>
              </div>
            </div>
          )}
          
          {result.ticketHolder && (
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <User className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Ticket Holder</p>
                <p className="font-semibold">{result.ticketHolder}</p>
              </div>
            </div>
          )}

          {result.ticketType && (
            <div className="mt-4 pt-4 border-t border-border">
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                {result.ticketType}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      <Button 
        onClick={onReset} 
        variant="outline" 
        size="lg" 
        className="w-full"
      >
        Scan Another Ticket
      </Button>
    </div>
  );
}
