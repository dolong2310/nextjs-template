"use client";

import { LoaderCircle, RotateCcw, Send } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";

import {
  defaultCompleteValues,
  type CompleteFormValues,
} from "../form-reference.data";
import { CalendarFields } from "./calendar-fields";
import { ControlFields } from "./control-fields";
import { NativeInputFields } from "./native-input-fields";
import { TextOptionFields } from "./text-option-fields";

type CompleteFormTabProps = {
  form: UseFormReturn<CompleteFormValues>;
  pending: boolean;
  phoneEnabled: boolean;
  reminderEnabled: boolean;
  onSubmit: (values: CompleteFormValues) => void;
};

function CompleteFormTab({
  form,
  pending,
  phoneEnabled,
  reminderEnabled,
  onSubmit,
}: CompleteFormTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All form components</CardTitle>
        <CardDescription>
          Native inputs, local UI primitives, custom popover calendars, upload,
          OTP, slider, and checkbox/radio groups.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <NativeInputFields form={form} />
            <TextOptionFields form={form} />
            <ControlFields
              form={form}
              phoneEnabled={phoneEnabled}
              reminderEnabled={reminderEnabled}
            />
            <CalendarFields form={form} />

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="neutral"
                onClick={() => form.reset(defaultCompleteValues)}
              >
                <RotateCcw />
                Reset form
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Send />
                )}
                Submit all fields
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export { CompleteFormTab };
