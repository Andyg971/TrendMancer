"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import { Calendar } from "./calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

type DateRangePickerProps = {
  value: DateRange | null;
  onChange: (date: DateRange | null) => void;
  className?: string;
  align?: "center" | "start" | "end";
  placeholderText?: string;
}

export function DateRangePicker({
  value,
  onChange,
  className,
  align = "start",
  placeholderText = "Sélectionner une date",
}: DateRangePickerProps) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "PPP", { locale: fr })} -{" "}
                  {format(value.to, "PPP", { locale: fr })}
                </>
              ) : (
                format(value.from, "PPP", { locale: fr })
              )
            ) : (
              <span>{placeholderText}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value || undefined}
            onSelect={(date) => {
              onChange(date || null)
              if (date?.from && date?.to) {
                setIsPopoverOpen(false)
              }
            }}
            numberOfMonths={2}
            locale={fr}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
} 