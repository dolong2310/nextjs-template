import { RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type FormReferenceHeaderProps = {
  onReset: () => void;
};

function FormReferenceHeader({ onReset }: FormReferenceHeaderProps) {
  return (
    <header className="flex flex-col gap-4 rounded-base border-2 border-border bg-secondary-background p-5 shadow-shadow lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <Badge>React Hook Form</Badge>
          <Badge variant="neutral">Zod validation</Badge>
          <Badge variant="neutral">Fake API submit</Badge>
        </div>
        <div>
          <h1 className="text-3xl font-heading lg:text-4xl">
            Form Components Reference
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            A focused playground for every local form input pattern, conditional
            field, date range validation, and wizard submit flow.
          </p>
        </div>
      </div>
      <Button type="button" variant="neutral" onClick={onReset}>
        <RotateCcw />
        Reset demo
      </Button>
    </header>
  );
}

export { FormReferenceHeader };
