import { format, addDays, isSameDay, isToday } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarWidget } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DateSelector = ({ selectedDate, onDateChange }: DateSelectorProps) => {
  const [startDate, setStartDate] = useState(new Date());
  const dates = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  const handlePrevWeek = () => {
    setStartDate(addDays(startDate, -7));
  };

  const handleNextWeek = () => {
    setStartDate(addDays(startDate, 7));
  };

  return (
    <div className="flex items-center gap-3">
      {/* Calendar Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 h-12 w-12 border-border"
          >
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarWidget
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateChange(date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Week Navigation */}
      <button
        onClick={handlePrevWeek}
        className="shrink-0 h-12 w-12 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-muted transition-colors"
      >
        <ChevronLeft className="h-5 w-5 text-muted-foreground" />
      </button>

      {/* Date Chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
        {dates.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const today = isToday(date);
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateChange(date)}
              className={`date-chip flex flex-col items-center min-w-[72px] py-3 ${
                isSelected ? "active" : ""
              }`}
            >
              <span className="text-xs font-medium opacity-70">
                {today ? "Today" : format(date, "EEE")}
              </span>
              <span className="text-lg font-semibold">
                {format(date, "d")}
              </span>
              <span className="text-xs opacity-70">
                {format(date, "MMM")}
              </span>
            </button>
          );
        })}
      </div>

      {/* Next Week */}
      <button
        onClick={handleNextWeek}
        className="shrink-0 h-12 w-12 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-muted transition-colors"
      >
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </button>
    </div>
  );
};

export default DateSelector;
