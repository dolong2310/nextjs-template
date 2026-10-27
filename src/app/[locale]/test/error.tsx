"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function ErrorPage({ error, unstable_retry }: ErrorPageProps) {
  useEffect(() => {
    // Ở production, nên gửi lên Sentry/Datadog/Log service
    console.error("[app/error]", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>

      <p className="mt-3 text-sm">
        An unexpected error occurred. Please try again.
      </p>

      {error.digest ? (
        <p className="mt-2 text-xs">Error ID: {error.digest}</p>
      ) : null}

      <Button className="mt-6" onClick={unstable_retry}>
        Try again
      </Button>
    </main>
  );
}
