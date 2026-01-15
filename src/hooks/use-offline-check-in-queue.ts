import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TicketVerificationService } from "@/services/verification.service";
export type OfflineQueueItem = {
  payload: any;
  status: "pending" | "synced" | "failed";
  attempts: number;
};

const QUEUE_KEY = "offline_checkin_queue";

function readQueue(): OfflineQueueItem[] {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeQueue(queue: OfflineQueueItem[]) {

  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function useOfflineCheckInQueue() {
    const [syncing, setSyncing] = useState(false);
    const [lastSyncAt, setLastSyncAt] = useState<number | undefined>();
    const [queueVersion, setQueueVersion] = useState(0); // 🔁 trigger re-read
    const [queue, setQueue] = useState<OfflineQueueItem[]>([]);
    const syncingRef = useRef(false);

    useEffect(() => {
      const stored = localStorage.getItem(QUEUE_KEY);
      if (stored) setQueue(JSON.parse(stored));
    }, []);

    const stats = useMemo(() => {
        const queue = readQueue();
        return {
          pending: queue.filter(i => i.status === "pending").length,
          synced: queue.filter(i => i.status === "synced").length,
          failed: queue.filter(i => i.status === "failed").length,
          syncing,
          lastSyncAt,
        };
    }, [queueVersion, syncing, lastSyncAt]);
 
    const enqueue = useCallback((payload: any) => {
        const existingQueue = readQueue();
        const item:OfflineQueueItem = {
          payload,
          status: "pending",
          attempts: 0,
        }
        existingQueue.push(item);
        const newQueue = [...queue, item];
        setQueue(newQueue);
        writeQueue(existingQueue);
        setQueueVersion(v => v + 1);
      }, []);

  const sync = useCallback(async () => {
    if (!navigator.onLine || syncingRef.current) return;

    syncingRef.current = true;
    setSyncing(true);

    try {
      const queue = readQueue();
      let changed = false;

      for (const item of queue) {
        if (item.status !== "pending") continue;

        try {
          await TicketVerificationService.verifyTicket(item.payload);
          item.status = "synced";
          changed = true;
        } catch {
          item.attempts++;
          changed = true;

          if (item.attempts >= 3) {
            item.status = "failed";
          }
        }
      }

      if (changed) {
        writeQueue(queue);
        setQueueVersion(v => v + 1);
      }

      setLastSyncAt(Date.now());
    } finally {
      syncingRef.current = false;
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    const trySync = () => {
      if (navigator.onLine) sync();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        trySync();
      }
    };

    trySync(); // 🔥 reload recovery

    window.addEventListener("online", trySync);
    window.addEventListener("focus", trySync);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("online", trySync);
      window.removeEventListener("focus", trySync);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [sync]);
  return { enqueue, sync,stats,queue };
}
