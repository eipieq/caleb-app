"use client";

import { useInterwovenKit } from "@initia/interwovenkit-react";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export function ConnectCta() {
  const { isConnected } = useInterwovenKit();
  if (isConnected) return null;

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border bg-muted/40 px-4 py-3 text-sm">
      <p className="text-muted-foreground">
        Connect your wallet to configure a strategy and let the agent trade on your behalf.
      </p>
      <Button size="sm" variant="outline" render={<Link href="/strategy" />} nativeButton={false}>
        Get started <ArrowRightIcon className="size-3.5 ml-1" />
      </Button>
    </div>
  );
}
