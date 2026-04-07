import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SessionNotFound() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Button variant="ghost" size="sm" render={<Link href="/" />} nativeButton={false} className="mb-6">
        <ArrowLeftIcon data-icon="inline-start" />
        Back
      </Button>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-mono text-muted-foreground">session not found</p>
        <p className="text-xs text-muted-foreground/60 max-w-sm">
          this session may have failed to commit on-chain due to a nonce error. the trade
          was recorded in the portfolio but the audit trail could not be saved.
        </p>
      </div>
    </div>
  );
}
