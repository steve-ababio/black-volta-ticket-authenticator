import axios from "@/lib/axios";

export const EventService = {
    getEvents: async (date: Date,page=1,limit=50) => {
        const url = `/api/events?date_from=${date}&${page}&${limit}&status=published`;
        const res = await axios.get(url);
        return res.data
    }
}