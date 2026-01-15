import { TicketData } from "@/common/types/types";
import axios from "../lib/axios";
export const TicketVerificationService = {
    verifyTicket: async (payload: TicketData) => {
        const res = await axios.post('/api/tickets/check-in', payload);
        return res.data;
    }
}