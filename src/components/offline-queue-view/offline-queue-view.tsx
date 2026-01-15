import { useOfflineCheckInQueue } from "@/hooks/use-offline-check-in-queue"

export default function OfflineQueueView() {
    const { queue } = useOfflineCheckInQueue();
    return (
        
         <div className="mt-4 p-2 bg-muted rounded-md text-sm">
            <h4 className="font-semibold mb-2">Offline Queue Status:</h4>
            {queue.length === 0 && <p>No pending offline verifications.</p>}
            {queue.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                <span>{item.payload.qr_code_data ?? item.payload.ticket_number}</span>
                <span className={
                    item.status === "pending" ? "text-yellow-600" :
                    item.status === "synced" ? "text-green-600" :
                    "text-red-600"
                }>
                    {item.status.toUpperCase()}
                </span>
                </div>
            ))}
        </div>
    )
}