import { Cloud, CloudOff, RefreshCw, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOfflineCheckInQueue } from "@/hooks/use-offline-check-in-queue";

interface OfflineQueueStatsProps {
  stats?: {
    pending: number;
    synced: number;
    failed: number;
    syncing: boolean;
    lastSyncAt?: number;
  };
}

export function OfflineQueueStats({ stats: propStats }: OfflineQueueStatsProps) {
  const { stats: hookStats, sync } = useOfflineCheckInQueue();
  const stats = propStats || hookStats;
  const isOnline = navigator.onLine;
  const hasItems = stats.pending > 0 || stats.failed > 0 || stats.synced > 0;

  if (!hasItems && isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-card border border-border rounded-lg shadow-lg p-4 min-w-[240px]">
        {/* Connection Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Cloud className="h-4 w-4 text-green-500" />
            ) : (
              <CloudOff className="h-4 w-4 text-destructive" />
            )}
            <span className="text-sm font-medium">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
          {isOnline && stats.pending > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => sync()}
              disabled={stats.syncing}
              className="h-7 px-2"
            >
              <RefreshCw className={cn("h-3 w-3", stats.syncing && "animate-spin")} />
            </Button>
          )}
        </div>

        {/* Queue Stats */}
        <div className="space-y-2">
          {stats.pending > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>Pending</span>
              </div>
              <Badge variant="secondary">{stats.pending}</Badge>
            </div>
          )}

          {stats.synced > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                <span>Synced</span>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-300">
                {stats.synced}
              </Badge>
            </div>
          )}

          {stats.failed > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                <span>Failed</span>
              </div>
              <Badge variant="destructive">{stats.failed}</Badge>
            </div>
          )}
        </div>

        {/* Last Sync Time */}
        {stats.lastSyncAt && (
          <p className="text-xs text-muted-foreground mt-3 pt-2 border-t border-border">
            Last sync: {new Date(stats.lastSyncAt).toLocaleTimeString()}
          </p>
        )}

        {/* Syncing Indicator */}
        {stats.syncing && (
          <p className="text-xs text-primary mt-2 flex items-center gap-1">
            <RefreshCw className="h-3 w-3 animate-spin" />
            Syncing...
          </p>
        )}
      </div>
    </div>
  );
}
