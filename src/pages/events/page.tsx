import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, isToday, addDays } from "date-fns";
import { LogOut, User } from "lucide-react";
import DateSelector from "@/components/dateSelector/dateSelector";
import EventCard, { EventCardProps } from "@/components/eventCard/eventCard";
import { useAuth } from "@/context/authContext";
import { EventService } from "@/services/event.service";
import { BvEvent } from "@/common/types/types";
import { formatDate, formatTime } from "@/utils/utils";
import { OfflineQueueStats } from "@/components/offiline-queue-stats/offline-queue-stats";
import { useOfflineCheckInQueue } from "@/hooks/use-offline-check-in-queue";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { EventsSkeleton } from "@/components/event-skeleton-loader/event-skeleton-loader";

const Event = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filteredEvents, setFilteredEvents] = useState<EventCardProps[]>([]);
  const { stats } = useOfflineCheckInQueue();
  const { staffName, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(function () {
     fetchEvents();
  },[selectedDate])

  async function fetchEvents() {
    try {
      setLoading(true)
      const startDate = formatDate(selectedDate);
      const endDate = formatDate(addDays(selectedDate, 1));
      const response = await EventService.getEvents(startDate, endDate);
      const events = response.data.events as BvEvent[];

      const result = events.map(event => ({
        id: event.id,
        title: event.title,
        image: event.cover_image.value,
        date: event.start_date,
        time: formatTime(event.start_date),
        venue: event.location ? event.location.name : "",
        category: event.category,
      }));
      setFilteredEvents(result);
    }catch (error) {
      const isNetworkFailure = error instanceof AxiosError && error.code === "ERR_NETWORK";
      const isOffline = !navigator.onLine || isNetworkFailure;
      if (isOffline) {
        toast.warning("Offline: check your internet connection.");
        return;
      }
    } finally {
      setLoading(false);
    }
  }
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="font-display text-xl font-bold text-foreground">
          <img alt="Blacvolta logo" className="aspect-[4/3] object-contain xl:h-auto xl:w-auto invert" width={60} height={60}  src="/assets/images/logo.png"  />
          </a>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{staffName}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="btn-secondary text-sm py-2 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              Verify Tickets
            </h1>
            <p className="text-muted-foreground">
              Select a date to view events and verify tickets
            </p>
          </div>

          {/* Date Selector */}
          <div className="mb-10">
            <DateSelector
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>
          
          {/* Events Grid */}
          {loading ? <EventsSkeleton /> :
              <>
              <div className="mb-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-1">
                  {isToday(selectedDate) ? "Today's Events" : `Events on ${format(selectedDate, "MMMM d, yyyy")}`}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"} scheduled
                </p>
              </div>

              { filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event, index) => (
                    <div
                      key={event.id}
                      className="animate-fade-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <EventCard {...event} />
                    </div>
                  ))
                  }
                  </div>):
                  (
                  <div className="text-center py-20 bg-card rounded-xl border border-border">
                    <div className="text-muted-foreground">
                      <p className="text-lg font-medium mb-1">No events scheduled</p>
                      <p className="text-sm">Select a different date to view events</p>
                    </div>
                  </div>
                  )
                
              } </>
            }
        </div>
        </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Blacvolta. All rights reserved.
          </p>
        </div>
      </footer>
      <OfflineQueueStats stats={stats} />
    </div>
  );
};

export default Event;
