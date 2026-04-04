"use client";

import { useInterwovenKit, InterwovenKit } from "@initia/interwovenkit-react";
import { Button } from "@/components/ui/button";

export function WalletButton() {
  const { isConnected, hexAddress, openConnect, openWallet } = useInterwovenKit();

  return (
    <>
      {isConnected ? (
        <button
          onClick={openWallet}
          className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {hexAddress.slice(0, 6)}…{hexAddress.slice(-4)}
        </button>
      ) : (
        <Button size="sm" variant="outline" onClick={openConnect} className="text-xs h-7 px-3">
          connect wallet
        </Button>
      )}
      <div className="hidden">
        <InterwovenKit />
      </div>
    </>
  );
}
