"use client";

import { Upload } from "lucide-react";
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

import { type CompleteFormValues } from "../form-reference.data";

type NativeInputFieldsProps = {
  form: UseFormReturn<CompleteFormValues>;
};

function NativeInputFields({ form }: NativeInputFieldsProps) {
  return (
    <FieldSet>
      <FieldLegend>Native input fields</FieldLegend>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text input</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="shadow-shadow"
                  placeholder="Full name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email input</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="shadow-shadow"
                  placeholder="alex@example.com"
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password input</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="shadow-shadow"
                  placeholder="Minimum 8 characters"
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="teamSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number input</FormLabel>
              <FormControl>
                <Input
                  className="shadow-shadow"
                  min={1}
                  type="number"
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(event) =>
                    field.onChange(event.target.valueAsNumber)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency-like number</FormLabel>
              <FormControl>
                <Input
                  className="shadow-shadow"
                  min={0}
                  step={100}
                  type="number"
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(event) =>
                    field.onChange(event.target.valueAsNumber)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="attachment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File upload</FormLabel>
              <FormControl>
                <div className="relative">
                  <Upload className="pointer-events-none absolute left-3 top-3 size-4" />
                  <Input
                    className="pl-9 shadow-shadow"
                    type="file"
                    onBlur={field.onBlur}
                    onChange={(event) =>
                      field.onChange(event.target.files?.[0] ?? undefined)
                    }
                  />
                </div>
              </FormControl>
              <FormDescription>
                {field.value
                  ? `Selected: ${field.value.name}`
                  : "Maximum file size: 5MB"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nativeDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Native date input</FormLabel>
              <FormControl>
                <Input {...field} className="shadow-shadow" type="date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nativeTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Native time input</FormLabel>
              <FormControl>
                <Input {...field} className="shadow-shadow" type="time" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nativeDateTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Native datetime input</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="shadow-shadow"
                  type="datetime-local"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FieldSet>
  );
}

export { NativeInputFields };
