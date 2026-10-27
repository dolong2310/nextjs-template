"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CompleteFormTab } from "../_components/complete-form/complete-form-tab";
import { ConditionalFieldsTab } from "../_components/conditional-fields-tab";
import { FormReferenceHeader } from "../_components/form-reference-header";
import {
  completeFormSchema,
  conditionalFormSchema,
  defaultCompleteValues,
  defaultConditionalValues,
  defaultWizardValues,
  pickValues,
  serializeFormValues,
  sleep,
  wizardFormSchema,
  wizardSteps,
  type CompleteFormValues,
  type ConditionalFormValues,
  type SubmittedPayload,
  type WizardFormValues,
} from "../_components/form-reference.data";
import { PayloadPreview } from "../_components/payload-preview";
import { WizardFormTab } from "../_components/wizard-form-tab";

export default function TestFormClientPage() {
  const [submittedPayload, setSubmittedPayload] =
    useState<SubmittedPayload>(null);
  const [completePending, setCompletePending] = useState(false);
  const [conditionalPending, setConditionalPending] = useState(false);
  const [wizardPending, setWizardPending] = useState(false);
  const [currentWizardStep, setCurrentWizardStep] = useState(0);

  const completeForm = useForm<CompleteFormValues>({
    resolver: zodResolver(completeFormSchema),
    defaultValues: defaultCompleteValues,
    mode: "onChange",
  });

  const conditionalForm = useForm<ConditionalFormValues>({
    resolver: zodResolver(conditionalFormSchema),
    defaultValues: defaultConditionalValues,
    mode: "onChange",
  });

  const wizardForm = useForm<WizardFormValues>({
    resolver: zodResolver(wizardFormSchema),
    defaultValues: defaultWizardValues,
    mode: "onChange",
  });

  const preferredContact = useWatch({
    control: completeForm.control,
    name: "contactMethod",
  });
  const reminderEnabled = useWatch({
    control: completeForm.control,
    name: "enableReminder",
  });
  const companyName = useWatch({
    control: conditionalForm.control,
    name: "companyName",
  });
  const inviteEmail = useWatch({
    control: conditionalForm.control,
    name: "inviteEmail",
  });
  const sendInvoice = useWatch({
    control: conditionalForm.control,
    name: "sendInvoice",
  });
  const automationEnabled = useWatch({
    control: wizardForm.control,
    name: "automationEnabled",
  });

  const phoneEnabled = preferredContact === "phone";
  const companyDomainEnabled = Boolean(companyName?.trim());
  const inviteRoleEnabled = Boolean(inviteEmail?.trim());

  useEffect(() => {
    if (!phoneEnabled) {
      completeForm.setValue("phoneNumber", "");
    }
  }, [completeForm, phoneEnabled]);

  useEffect(() => {
    if (!reminderEnabled) {
      completeForm.setValue("reminderNote", "");
    }
  }, [completeForm, reminderEnabled]);

  useEffect(() => {
    if (!companyDomainEnabled) {
      conditionalForm.setValue("companyDomain", "");
    }
  }, [companyDomainEnabled, conditionalForm]);

  useEffect(() => {
    if (!inviteRoleEnabled) {
      conditionalForm.setValue("inviteRole", "");
    }
  }, [conditionalForm, inviteRoleEnabled]);

  useEffect(() => {
    if (!sendInvoice) {
      conditionalForm.setValue("invoiceEmail", "");
    }
  }, [conditionalForm, sendInvoice]);

  useEffect(() => {
    if (!automationEnabled) {
      wizardForm.setValue("automationGoal", "");
    }
  }, [automationEnabled, wizardForm]);

  function resetDemo() {
    completeForm.reset(defaultCompleteValues);
    conditionalForm.reset(defaultConditionalValues);
    wizardForm.reset(defaultWizardValues);
    setCurrentWizardStep(0);
    setSubmittedPayload(null);
    toast.success("Demo forms reset");
  }

  async function submitCompleteForm(values: CompleteFormValues) {
    setCompletePending(true);
    await sleep(1100);
    setCompletePending(false);
    setSubmittedPayload({
      source: "complete-form",
      submittedAt: new Date().toISOString(),
      values: serializeFormValues(values),
    });
    toast.success("Complete form submitted");
  }

  async function submitConditionalForm(values: ConditionalFormValues) {
    setConditionalPending(true);
    await sleep(900);
    setConditionalPending(false);
    setSubmittedPayload({
      source: "conditional-form",
      submittedAt: new Date().toISOString(),
      values: serializeFormValues(values),
    });
    toast.success("Conditional form submitted");
  }

  async function submitWizardStep() {
    const wizardStep = wizardSteps[currentWizardStep];
    const stepIsValid = await wizardForm.trigger(wizardStep.fields, {
      shouldFocus: true,
    });

    if (!stepIsValid) {
      return;
    }

    setWizardPending(true);
    await sleep(900);
    setWizardPending(false);

    const allValues = wizardForm.getValues();
    const stepValues = pickValues(allValues, wizardStep.fields);
    const isLastStep = currentWizardStep === wizardSteps.length - 1;

    setSubmittedPayload({
      source: isLastStep
        ? "wizard-final-submit"
        : `wizard-step-${currentWizardStep + 1}`,
      submittedAt: new Date().toISOString(),
      values: serializeFormValues(isLastStep ? allValues : stepValues),
    });

    toast.success(isLastStep ? "Wizard submitted" : `${wizardStep.title} saved`);

    if (!isLastStep) {
      setCurrentWizardStep((step) => step + 1);
    }
  }

  return (
    <main className="min-h-screen w-full bg-background px-4 py-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <FormReferenceHeader onReset={resetDemo} />

        <Tabs defaultValue="complete" className="space-y-4">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 md:w-fit md:grid-cols-4">
            <TabsTrigger value="complete">All fields</TabsTrigger>
            <TabsTrigger value="conditional">Nested fields</TabsTrigger>
            <TabsTrigger value="wizard">Wizard</TabsTrigger>
            <TabsTrigger value="payload">Payload</TabsTrigger>
          </TabsList>

          <TabsContent value="complete">
            <CompleteFormTab
              form={completeForm}
              pending={completePending}
              phoneEnabled={phoneEnabled}
              reminderEnabled={reminderEnabled}
              onSubmit={submitCompleteForm}
            />
          </TabsContent>

          <TabsContent value="conditional">
            <ConditionalFieldsTab
              companyDomainEnabled={companyDomainEnabled}
              form={conditionalForm}
              inviteRoleEnabled={inviteRoleEnabled}
              pending={conditionalPending}
              sendInvoice={sendInvoice}
              onSubmit={submitConditionalForm}
            />
          </TabsContent>

          <TabsContent value="wizard">
            <WizardFormTab
              automationEnabled={automationEnabled}
              currentStep={currentWizardStep}
              form={wizardForm}
              pending={wizardPending}
              setCurrentStep={setCurrentWizardStep}
              onSubmitStep={submitWizardStep}
            />
          </TabsContent>

          <TabsContent value="payload">
            <PayloadPreview payload={submittedPayload} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
