import { CheckCircle2, XCircle, Clock } from "lucide-react";

interface ScanRecord {
  code: string;
  valid: boolean;
  timestamp: Date;
  eventName?: string;
}

interface RecentScansProps {
  scans: ScanRecord[];
}

export function RecentScans({ scans }: RecentScansProps) {
  if (scans.length === 0) return null;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-display font-semibold text-sm">Recent Scans</h3>
        <span className="ml-auto text-xs text-muted-foreground">
          {scans.length} {scans.length === 1 ? 'scan' : 'scans'}
        </span>
      </div>
      
      <div className="divide-y divide-border max-h-64 overflow-y-auto">
        {scans.slice(0, 10).map((scan, index) => (
          <div 
            key={`${scan.code}-${index}`}
            className="px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors"
          >
            {scan.valid ? (
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            )}
            
            <div className="flex-1 min-w-0">
              <p className="font-mono text-sm truncate">{scan.code}</p>
              {scan.eventName && (
                <p className="text-xs text-muted-foreground truncate">{scan.eventName}</p>
              )}
            </div>
            
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {formatTime(scan.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
