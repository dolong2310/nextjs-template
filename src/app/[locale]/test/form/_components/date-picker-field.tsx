"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerFieldProps = {
  disabled?: boolean;
  label: string;
  onSelect: (date?: Date) => void;
  placeholder: string;
  value?: Date;
};

function DatePickerField({
  disabled,
  label,
  onSelect,
  placeholder,
  value,
}: DatePickerFieldProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            type="button"
            variant="neutral"
            disabled={disabled}
            className="w-full justify-start shadow-shadow"
          >
            <CalendarIcon />
            <span className="truncate">
              {value ? format(value, "PPP") : placeholder}
            </span>
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onSelect}
          initialFocus
          aria-label={label}
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePickerField };
