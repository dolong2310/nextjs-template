import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { type SubmittedPayload } from "./form-reference.data";

function PayloadPreview({ payload }: { payload: SubmittedPayload }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Submitted payload</CardTitle>
        <CardDescription>
          The latest fake API response is shown here after any form submit.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <pre className="max-h-[560px] overflow-auto rounded-base border-2 border-border bg-secondary-background p-4 text-xs leading-relaxed">
          {payload
            ? JSON.stringify(payload, null, 2)
            : "Submit any form to preview the payload."}
        </pre>
      </CardContent>
    </Card>
  );
}

export { PayloadPreview };
