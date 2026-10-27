"use client";

import { type UseFormReturn } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import {
  channelOptions,
  contactMethods,
  type CompleteFormValues,
} from "../form-reference.data";

type ControlFieldsProps = {
  form: UseFormReturn<CompleteFormValues>;
  phoneEnabled: boolean;
  reminderEnabled: boolean;
};

function ControlFields({
  form,
  phoneEnabled,
  reminderEnabled,
}: ControlFieldsProps) {
  return (
    <FieldSet>
      <FieldLegend>Checkbox, radio, switch, slider, OTP</FieldLegend>
      <div className="grid gap-6 lg:grid-cols-2">
        <FormField
          control={form.control}
          name="channels"
          render={({ field }) => (
            <FormItem>
              <FieldSet>
                <FieldLegend variant="label">Checkbox group</FieldLegend>
                <FieldGroup data-slot="checkbox-group">
                  {channelOptions.map((option) => (
                    <Field key={option.value} orientation="horizontal">
                      <Checkbox
                        id={`channel-${option.value}`}
                        checked={field.value.includes(option.value)}
                        onCheckedChange={(checked) => {
                          const nextValue =
                            checked === true
                              ? [...field.value, option.value]
                              : field.value.filter(
                                  (value) => value !== option.value,
                                );

                          field.onChange(nextValue);
                        }}
                      />
                      <FieldLabel htmlFor={`channel-${option.value}`}>
                        {option.label}
                      </FieldLabel>
                    </Field>
                  ))}
                </FieldGroup>
                <FieldError>{form.formState.errors.channels?.message}</FieldError>
              </FieldSet>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactMethod"
          render={({ field }) => (
            <FormItem>
              <FieldSet>
                <FieldLegend variant="label">Radio group</FieldLegend>
                <RadioGroup
                  className="gap-3"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {contactMethods.map((method) => (
                    <Field key={method} orientation="horizontal">
                      <RadioGroupItem
                        id={`contact-${method}`}
                        value={method}
                      />
                      <FieldContent>
                        <FieldLabel
                          htmlFor={`contact-${method}`}
                          className="capitalize"
                        >
                          {method}
                        </FieldLabel>
                        <FieldDescription>
                          Preferred contact method
                        </FieldDescription>
                      </FieldContent>
                    </Field>
                  ))}
                </RadioGroup>
              </FieldSet>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nested phone input</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="shadow-shadow"
                  disabled={!phoneEnabled}
                  placeholder="Enabled when phone is selected"
                  type="tel"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="enableReminder"
          render={({ field }) => (
            <FormItem>
              <Field orientation="horizontal">
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldTitle>Switch</FieldTitle>
                  <FieldDescription>Enable reminder note</FieldDescription>
                </FieldContent>
              </Field>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reminderNote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nested textarea</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="shadow-shadow"
                  disabled={!reminderEnabled}
                  placeholder="Enabled when reminder switch is on"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confidence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slider: {field.value}%</FormLabel>
              <FormControl>
                <Slider
                  max={100}
                  step={1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="verificationCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OTP input</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                >
                  <InputOTPGroup>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem>
              <Field orientation="horizontal">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldContent>
                  <FieldTitle>Single checkbox</FieldTitle>
                  <FieldDescription>
                    Accept the demo submission terms
                  </FieldDescription>
                </FieldContent>
              </Field>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FieldSet>
  );
}

export { ControlFields };
