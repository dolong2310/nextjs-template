import { type FieldPath } from "react-hook-form";
import { z } from "zod";

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const roleOptions = [
  { value: "owner", label: "Owner" },
  { value: "manager", label: "Manager" },
  { value: "contributor", label: "Contributor" },
  { value: "viewer", label: "Viewer" },
];

const departmentOptions = [
  { value: "product", label: "Product" },
  { value: "engineering", label: "Engineering" },
  { value: "design", label: "Design" },
  { value: "operations", label: "Operations" },
  { value: "support", label: "Support" },
];

const skillOptions = [
  { value: "planning", label: "Planning" },
  { value: "research", label: "Research" },
  { value: "delivery", label: "Delivery" },
  { value: "analytics", label: "Analytics" },
  { value: "automation", label: "Automation" },
  { value: "security", label: "Security" },
];

const channelOptions = [
  { value: "email", label: "Email updates" },
  { value: "slack", label: "Slack alerts" },
  { value: "push", label: "Push notifications" },
];

const contactMethods = ["email", "phone", "none"] as const;
const priorities = ["low", "medium", "high"] as const;
const plans = ["starter", "team", "enterprise"] as const;

function sleep(ms = 900) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function combineDateAndTime(date?: Date, time?: string) {
  if (!date || !time || !TIME_PATTERN.test(time)) {
    return undefined;
  }

  const [hours, minutes] = time.split(":").map(Number);
  const nextDate = new Date(date);
  nextDate.setHours(hours, minutes, 0, 0);

  return nextDate;
}

function addDateTimeRangeIssues(
  context: z.RefinementCtx,
  values: {
    startDate?: Date;
    startTime?: string;
    endDate?: Date;
    endTime?: string;
  },
) {
  const startTimeValid = Boolean(
    values.startTime && TIME_PATTERN.test(values.startTime),
  );
  const endTimeValid = Boolean(
    values.endTime && TIME_PATTERN.test(values.endTime),
  );

  if (!values.startDate) {
    context.addIssue({
      code: "custom",
      message: "Start date is required",
      path: ["startDate"],
    });
  }

  if (!values.startTime) {
    context.addIssue({
      code: "custom",
      message: "Start time is required",
      path: ["startTime"],
    });
  } else if (!startTimeValid) {
    context.addIssue({
      code: "custom",
      message: "Use a valid 24-hour time",
      path: ["startTime"],
    });
  }

  if (!values.endDate) {
    context.addIssue({
      code: "custom",
      message: "End date is required",
      path: ["endDate"],
    });
  }

  if (!values.endTime) {
    context.addIssue({
      code: "custom",
      message: "End time is required",
      path: ["endTime"],
    });
  } else if (!endTimeValid) {
    context.addIssue({
      code: "custom",
      message: "Use a valid 24-hour time",
      path: ["endTime"],
    });
  }

  const startAt = combineDateAndTime(values.startDate, values.startTime);
  const endAt = combineDateAndTime(values.endDate, values.endTime);

  if (!startAt || !endAt) {
    return;
  }

  if (startAt.getTime() === endAt.getTime()) {
    context.addIssue({
      code: "custom",
      message: "End date and time must be different from start date and time",
      path: ["endTime"],
    });
    return;
  }

  if (startAt > endAt) {
    context.addIssue({
      code: "custom",
      message: "End date and time must be after start date and time",
      path: ["endTime"],
    });
  }
}

const completeFormSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    teamSize: z.number().min(1, "Team size must be at least 1").max(500),
    budget: z.number().min(0, "Budget cannot be negative"),
    nativeDate: z.string().min(1, "Native date is required"),
    nativeTime: z.string().min(1, "Native time is required"),
    nativeDateTime: z.string().min(1, "Native date time is required"),
    dueDate: z.date().optional(),
    startDate: z.date().optional(),
    startTime: z.string(),
    endDate: z.date().optional(),
    endTime: z.string(),
    attachment: z
      .any()
      .optional()
      .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
        message: "File must be 5MB or smaller",
      }),
    summary: z.string().min(10, "Summary must be at least 10 characters"),
    priority: z.enum(priorities),
    role: z.string().min(1, "Select a role"),
    department: z.string().min(1, "Select a department"),
    skills: z.array(z.string()).min(1, "Select at least one skill"),
    channels: z.array(z.string()).min(1, "Select at least one channel"),
    contactMethod: z.enum(contactMethods),
    phoneNumber: z.string().optional(),
    enableReminder: z.boolean(),
    reminderNote: z.string().optional(),
    confidence: z.number().min(0).max(100),
    verificationCode: z.string().length(6, "Enter the 6-digit code"),
    acceptTerms: z
      .boolean()
      .refine((value) => value, "You must accept the terms"),
  })
  .superRefine((values, context) => {
    if (!values.dueDate) {
      context.addIssue({
        code: "custom",
        message: "Due date is required",
        path: ["dueDate"],
      });
    }

    addDateTimeRangeIssues(context, values);

    if (values.contactMethod === "phone" && !values.phoneNumber?.trim()) {
      context.addIssue({
        code: "custom",
        message: "Phone number is required when phone is selected",
        path: ["phoneNumber"],
      });
    }

    if (values.enableReminder && !values.reminderNote?.trim()) {
      context.addIssue({
        code: "custom",
        message: "Reminder note is required when reminders are enabled",
        path: ["reminderNote"],
      });
    }
  });

const conditionalFormSchema = z
  .object({
    companyName: z.string().optional(),
    companyDomain: z.string().optional(),
    inviteEmail: z.string().optional(),
    inviteRole: z.string().optional(),
    sendInvoice: z.boolean(),
    invoiceEmail: z.string().optional(),
  })
  .superRefine((values, context) => {
    if (values.companyName?.trim() && !values.companyDomain?.trim()) {
      context.addIssue({
        code: "custom",
        message: "Company domain is required when company name has a value",
        path: ["companyDomain"],
      });
    }

    if (values.inviteEmail?.trim()) {
      const emailResult = z.string().email().safeParse(values.inviteEmail);

      if (!emailResult.success) {
        context.addIssue({
          code: "custom",
          message: "Enter a valid teammate email",
          path: ["inviteEmail"],
        });
      }

      if (!values.inviteRole) {
        context.addIssue({
          code: "custom",
          message: "Invite role is required when teammate email has a value",
          path: ["inviteRole"],
        });
      }
    }

    if (values.sendInvoice) {
      const emailResult = z.string().email().safeParse(values.invoiceEmail);

      if (!values.invoiceEmail?.trim()) {
        context.addIssue({
          code: "custom",
          message: "Invoice email is required",
          path: ["invoiceEmail"],
        });
      } else if (!emailResult.success) {
        context.addIssue({
          code: "custom",
          message: "Enter a valid invoice email",
          path: ["invoiceEmail"],
        });
      }
    }
  });

const wizardFormSchema = z
  .object({
    workspaceName: z
      .string()
      .min(3, "Workspace name must be at least 3 characters"),
    ownerEmail: z.string().email("Enter a valid owner email"),
    plan: z.enum(plans),
    users: z.number().min(1).max(200),
    automationEnabled: z.boolean(),
    automationGoal: z.string().optional(),
    startDate: z.date().optional(),
    startTime: z.string(),
    endDate: z.date().optional(),
    endTime: z.string(),
    pilotAccepted: z
      .boolean()
      .refine((value) => value, "Confirm that this pilot can be scheduled"),
  })
  .superRefine((values, context) => {
    if (values.automationEnabled && !values.automationGoal?.trim()) {
      context.addIssue({
        code: "custom",
        message: "Automation goal is required when automation is enabled",
        path: ["automationGoal"],
      });
    }

    addDateTimeRangeIssues(context, values);
  });

type CompleteFormValues = z.infer<typeof completeFormSchema>;
type ConditionalFormValues = z.infer<typeof conditionalFormSchema>;
type WizardFormValues = z.infer<typeof wizardFormSchema>;

type SubmittedPayload = {
  source: string;
  submittedAt: string;
  values: unknown;
} | null;

const defaultCompleteValues: CompleteFormValues = {
  fullName: "Alex Morgan",
  email: "alex@example.com",
  password: "password123",
  teamSize: 8,
  budget: 12000,
  nativeDate: "2026-07-20",
  nativeTime: "09:30",
  nativeDateTime: "2026-07-20T09:30",
  dueDate: new Date(2026, 6, 24),
  startDate: new Date(2026, 6, 20),
  startTime: "09:00",
  endDate: new Date(2026, 6, 20),
  endTime: "10:30",
  attachment: undefined,
  summary: "Prepare a focused rollout plan for the next product milestone.",
  priority: "medium",
  role: "manager",
  department: "product",
  skills: ["planning", "analytics"],
  channels: ["email"],
  contactMethod: "email",
  phoneNumber: "",
  enableReminder: true,
  reminderNote: "Send a reminder one business day before the review.",
  confidence: 72,
  verificationCode: "123456",
  acceptTerms: true,
};

const defaultConditionalValues: ConditionalFormValues = {
  companyName: "",
  companyDomain: "",
  inviteEmail: "",
  inviteRole: "",
  sendInvoice: false,
  invoiceEmail: "",
};

const defaultWizardValues: WizardFormValues = {
  workspaceName: "Launch Room",
  ownerEmail: "owner@example.com",
  plan: "team",
  users: 12,
  automationEnabled: false,
  automationGoal: "",
  startDate: new Date(2026, 6, 27),
  startTime: "13:00",
  endDate: new Date(2026, 6, 27),
  endTime: "14:00",
  pilotAccepted: false,
};

const wizardSteps: Array<{
  title: string;
  description: string;
  fields: Array<FieldPath<WizardFormValues>>;
}> = [
  {
    title: "Workspace",
    description: "Basic workspace ownership and plan fields.",
    fields: ["workspaceName", "ownerEmail", "plan"],
  },
  {
    title: "Configuration",
    description: "Numeric, switch, and conditional textarea fields.",
    fields: ["users", "automationEnabled", "automationGoal"],
  },
  {
    title: "Schedule",
    description: "Start and end calendar fields submitted as the final step.",
    fields: ["startDate", "startTime", "endDate", "endTime", "pilotAccepted"],
  },
];

function serializeFormValues(values: unknown) {
  return JSON.parse(
    JSON.stringify(values, (_key, value) => {
      if (typeof File !== "undefined" && value instanceof File) {
        return {
          name: value.name,
          size: value.size,
          type: value.type,
        };
      }

      return value;
    }),
  );
}

function pickValues<TValues extends Record<string, unknown>>(
  values: TValues,
  fields: Array<FieldPath<TValues>>,
) {
  return fields.reduce<Record<string, unknown>>((accumulator, fieldName) => {
    accumulator[fieldName] = values[fieldName as keyof TValues];
    return accumulator;
  }, {});
}

export {
  channelOptions,
  completeFormSchema,
  conditionalFormSchema,
  contactMethods,
  defaultCompleteValues,
  defaultConditionalValues,
  defaultWizardValues,
  departmentOptions,
  pickValues,
  roleOptions,
  serializeFormValues,
  skillOptions,
  sleep,
  wizardFormSchema,
  wizardSteps,
};
export type {
  CompleteFormValues,
  ConditionalFormValues,
  SubmittedPayload,
  WizardFormValues,
};
