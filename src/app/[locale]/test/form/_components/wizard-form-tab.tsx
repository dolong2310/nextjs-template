"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { type UseFormReturn } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { DatePickerField } from "./date-picker-field";
import { wizardSteps, type WizardFormValues } from "./form-reference.data";

type WizardFormTabProps = {
  automationEnabled: boolean;
  currentStep: number;
  form: UseFormReturn<WizardFormValues>;
  pending: boolean;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  onSubmitStep: () => void;
};

function WizardFormTab({
  automationEnabled,
  currentStep,
  form,
  pending,
  setCurrentStep,
  onSubmitStep,
}: WizardFormTabProps) {
  const wizardStep = wizardSteps[currentStep];
  const wizardProgress = ((currentStep + 1) / wizardSteps.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wizard form</CardTitle>
        <CardDescription>
          Each step validates and submits its own slice with a fake API delay
          before moving forward.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-8"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="space-y-3">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-heading">
                    Step {currentStep + 1} of {wizardSteps.length}
                  </p>
                  <h2 className="text-2xl font-heading">{wizardStep.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {wizardStep.description}
                  </p>
                </div>
                <Badge variant="neutral">
                  {Math.round(wizardProgress)}% complete
                </Badge>
              </div>
              <Progress value={wizardProgress} />
            </div>

            {currentStep === 0 && <WorkspaceStep form={form} />}
            {currentStep === 1 && (
              <ConfigurationStep
                form={form}
                automationEnabled={automationEnabled}
              />
            )}
            {currentStep === 2 && <ScheduleStep form={form} />}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="neutral"
                disabled={currentStep === 0 || pending}
                onClick={() => setCurrentStep((step) => Math.max(0, step - 1))}
              >
                <ArrowLeft />
                Back
              </Button>

              <Button type="button" disabled={pending} onClick={onSubmitStep}>
                {pending ? (
                  <LoaderCircle className="animate-spin" />
                ) : currentStep === wizardSteps.length - 1 ? (
                  <CheckCircle2 />
                ) : (
                  <ArrowRight />
                )}
                {currentStep === wizardSteps.length - 1
                  ? "Submit wizard"
                  : "Save step"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function WorkspaceStep({ form }: { form: UseFormReturn<WizardFormValues> }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <FormField
        control={form.control}
        name="workspaceName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Workspace name</FormLabel>
            <FormControl>
              <Input {...field} className="shadow-shadow" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ownerEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Owner email</FormLabel>
            <FormControl>
              <Input {...field} className="shadow-shadow" type="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="plan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Plan</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="shadow-shadow">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function ConfigurationStep({
  automationEnabled,
  form,
}: {
  automationEnabled: boolean;
  form: UseFormReturn<WizardFormValues>;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <FormField
        control={form.control}
        name="users"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Users</FormLabel>
            <FormControl>
              <Input
                className="shadow-shadow"
                min={1}
                type="number"
                value={field.value}
                onBlur={field.onBlur}
                onChange={(event) => field.onChange(event.target.valueAsNumber)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="automationEnabled"
        render={({ field }) => (
          <FormItem>
            <Field orientation="horizontal">
              <Switch checked={field.value} onCheckedChange={field.onChange} />
              <FieldContent>
                <FieldTitle>Enable automation</FieldTitle>
                <FieldDescription>
                  Enables the automation goal textarea.
                </FieldDescription>
              </FieldContent>
            </Field>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="automationGoal"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Automation goal</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                className="shadow-shadow"
                disabled={!automationEnabled}
                placeholder="Describe the workflow to automate"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function ScheduleStep({ form }: { form: UseFormReturn<WizardFormValues> }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <FormField
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Start calendar</FormLabel>
            <DatePickerField
              label="Wizard start date"
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
              label="Wizard end date"
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
              End must be after start; equal timestamps fail.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="pilotAccepted"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <FieldContent>
                <FieldTitle>Confirm pilot schedule</FieldTitle>
                <FieldDescription>
                  Required before the final wizard submit.
                </FieldDescription>
              </FieldContent>
            </Field>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export { WizardFormTab };
