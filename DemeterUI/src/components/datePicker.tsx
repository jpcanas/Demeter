import { useState } from "react";
import { Popover } from "./ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "./ui/button";
import { CalendarIcon } from "lucide-react";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface DatePickerProps {
  startYear?: number;
  endYear?: number;
}
export default function DatePicker({
  startYear = getYear(new Date()) - 100,
  endYear = getYear(new Date()) + 100,
}: DatePickerProps) {
  const [date, setDate] = useState<Date>(new Date());
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const handleMonthChange = (month: string) => {
    const newDate = setMonth(date, months.indexOf(month));
    setDate(newDate);
  };
  const handleYearChange = (year: string) => {
    const newDate = setYear(date, parseInt(year));
    setDate(newDate);
  };

  const handleSelectDate = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-white border rounded-md mt-1 mb-1 drop-shadow-md"
        align="start"
      >
        <div className="flex justify-between pt-2 pe-2 ps-2">
          <Select
            onValueChange={handleMonthChange}
            value={months[getMonth(date)]}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={handleYearChange}
            value={getYear(date).toString()}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          className=""
          mode="single"
          selected={date}
          onSelect={handleSelectDate}
          initialFocus
          month={date}
          onMonthChange={setDate}
        />
      </PopoverContent>
    </Popover>
  );
}
