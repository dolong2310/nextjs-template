"use client";

import { type UseFormReturn } from "react-hook-form";

import { FieldLegend, FieldSet } from "@/components/ui/field";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { DatePickerField } from "../date-picker-field";
import { type CompleteFormValues } from "../form-reference.data";

type CalendarFieldsProps = {
  form: UseFormReturn<CompleteFormValues>;
};

function CalendarFields({ form }: CalendarFieldsProps) {
  return (
    <FieldSet>
      <FieldLegend>Calendar fields</FieldLegend>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Single calendar</FormLabel>
              <DatePickerField
                label="Due date"
                placeholder="Pick a due date"
                value={field.value}
                onSelect={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start calendar</FormLabel>
              <DatePickerField
                label="Start date"
                placeholder="Pick a start date"
                value={field.value}
                onSelect={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start time</FormLabel>
              <FormControl>
                <Input {...field} className="shadow-shadow" type="time" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End calendar</FormLabel>
              <DatePickerField
                label="End date"
                placeholder="Pick an end date"
                value={field.value}
                onSelect={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End time</FormLabel>
              <FormControl>
                <Input {...field} className="shadow-shadow" type="time" />
              </FormControl>
              <FormDescription>
                Must be strictly after the start date and time.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FieldSet>
  );
}

export { CalendarFields };
