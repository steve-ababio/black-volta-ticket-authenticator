import { TicketData } from "@/common/types/types";

export interface OfflineCheckIn {
    id: string;
    payload: TicketData;
    scannedAt: number;
    status: "pending" | "synced" | "failed";
    attempts: number;
}
export interface ScanAuditLog {
    staffId: string;
    ticketRef: string;
    method: "qr" | "manual";
    result: "success" | "error";
    reason?: string;
    timestamp: number;
    location: string;
    offline: boolean;
}
  