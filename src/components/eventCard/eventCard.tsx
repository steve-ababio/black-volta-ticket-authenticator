import { useState } from "react";
import { Clock, MapPin, Ticket } from "lucide-react";
import { format, parseISO } from "date-fns";
import QRScanner from "../qrScanner/qrScanner";
import { months } from "@/common/constants/constant";


export interface EventCardProps {
  id:number,
  title: string;
  image: string;
  date: string;
  time: string;
  venue: string;
  category: string;
}


const EventCard = ({
  id,
  title,
  image,
  date,
  time,
  venue,
  category,
}: EventCardProps) => {
  const [scannerOpen, setScannerOpen] = useState(false);
  const formattedDate = format(parseISO(date), "MMM d, yyyy");

  return (
    <>
      <article className="shadow-[0px_2px_10px_8px_#0064A71A] py-2 px-2 event-card group border-0">
        <div className="relative overflow-hidden p-2 rounded-xl">
          <img
            src={image}
            alt={title}
            className="w-full rounded-xl h-[360px] object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Category Badge */}
          <span className="absolute top-7 right-5 px-2.5 py-1 text-sm font-semibold rounded-[4px] bg-card/90 text-foreground backdrop-blur-sm border border-border">
            {category}
          </span>
          <div className="shadow-lg leading-[1.1] bg-white py-1 flex flex-col items-center px-3 rounded-[6px] absolute top-5 left-5">
            <div className="font-[300] text-sm">{months[new Date(date).getMonth()]}</div>
            <div className="text-[21px] font-semibold">{new Date(date).getDate()}</div>
          </div>
        </div>

        <div className="px-4 py-2 space-y-2">
          <h3 className="font-display font-semibold text-foreground text-base leading-snug line-clamp-2">
            {title}
          </h3>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Clock className="w-4 h-4" />
              <span>{time} • {formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{venue}</span>
            </div>
          </div>

          <button 
            onClick={() => setScannerOpen(true)}
            className="w-full btn-primary py-2.5 rounded-sm text-sm flex items-center justify-center gap-2 mt-3"
          >
            <Ticket className="w-4 h-4 text-[#1c1d1d]" />
            Verify Tickets
          </button>
        </div>
      </article>

      <QRScanner
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        eventTitle={title}
        eventLocation={venue}
        eventId={id}
      />
    </>
  );
};

export default EventCard;
