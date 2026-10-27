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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldTitle,
} from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import {
  defaultConditionalValues,
  roleOptions,
  type ConditionalFormValues,
} from "./form-reference.data";

type ConditionalFieldsTabProps = {
  companyDomainEnabled: boolean;
  form: UseFormReturn<ConditionalFormValues>;
  inviteRoleEnabled: boolean;
  pending: boolean;
  sendInvoice: boolean;
  onSubmit: (values: ConditionalFormValues) => void;
};

function ConditionalFieldsTab({
  companyDomainEnabled,
  form,
  inviteRoleEnabled,
  pending,
  sendInvoice,
  onSubmit,
}: ConditionalFieldsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nested and conditional fields</CardTitle>
        <CardDescription>
          These fields are enabled by another input value, then validated only
          when the dependency exists.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="shadow-shadow"
                        placeholder="Type a company name"
                      />
                    </FormControl>
                    <FormDescription>
                      Company domain is enabled after this has a value.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyDomain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company domain</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="shadow-shadow"
                        disabled={!companyDomainEnabled}
                        placeholder="company.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="inviteEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invite teammate email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="shadow-shadow"
                        placeholder="teammate@example.com"
                        type="email"
                      />
                    </FormControl>
                    <FormDescription>
                      Invite role is enabled after this has a value.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="inviteRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invite role</FormLabel>
                    <Select
                      disabled={!inviteRoleEnabled}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="shadow-shadow">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sendInvoice"
                render={({ field }) => (
                  <FormItem>
                    <Field orientation="horizontal">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FieldContent>
                        <FieldTitle>Send invoice copy</FieldTitle>
                        <FieldDescription>
                          Enables the invoice email field.
                        </FieldDescription>
                      </FieldContent>
                    </Field>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="invoiceEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="shadow-shadow"
                        disabled={!sendInvoice}
                        placeholder="finance@example.com"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="neutral"
                onClick={() => form.reset(defaultConditionalValues)}
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
                Submit nested fields
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export { ConditionalFieldsTab };
