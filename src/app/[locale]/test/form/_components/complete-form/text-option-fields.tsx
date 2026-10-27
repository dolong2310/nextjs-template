"use client";

import { type UseFormReturn } from "react-hook-form";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import { FieldLegend, FieldSet } from "@/components/ui/field";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
  departmentOptions,
  skillOptions,
  type CompleteFormValues,
} from "../form-reference.data";

type TextOptionFieldsProps = {
  form: UseFormReturn<CompleteFormValues>;
};

function TextOptionFields({ form }: TextOptionFieldsProps) {
  return (
    <FieldSet>
      <FieldLegend>Text area and option fields</FieldLegend>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Textarea</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="min-h-32 shadow-shadow"
                  placeholder="Describe the task or workflow"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-5">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="shadow-shadow">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Combobox</FormLabel>
                <Combobox
                  items={departmentOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <ComboboxTrigger
                    className="max-w-none shadow-shadow"
                    placeholder="Select department"
                  />
                  <ComboboxContent>
                    <ComboboxInput placeholder="Search department..." />
                    <ComboboxEmpty>No department found.</ComboboxEmpty>
                    <ComboboxList>
                      {departmentOptions.map((option) => (
                        <ComboboxItem key={option.value} value={option.value}>
                          {option.label}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Multiple combobox</FormLabel>
                <Combobox
                  multiple={{
                    maxCount: 2,
                    maxSelectCount: 4,
                    showSelectAll: true,
                    selectAllLabel: "Select all visible skills",
                  }}
                  items={skillOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <ComboboxTrigger
                    className="max-w-none shadow-shadow"
                    placeholder="Select skills"
                  />
                  <ComboboxContent>
                    <ComboboxInput placeholder="Search skills..." />
                    <ComboboxEmpty>No skill found.</ComboboxEmpty>
                    <ComboboxList>
                      {skillOptions.map((option) => (
                        <ComboboxItem key={option.value} value={option.value}>
                          {option.label}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </FieldSet>
  );
}

export { TextOptionFields };
