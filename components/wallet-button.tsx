"use client";

import { useInterwovenKit, InterwovenKit } from "@initia/interwovenkit-react";
import { Button } from "@/components/ui/button";
import { WalletIcon } from "lucide-react";

export function WalletButton() {
  const { isConnected, hexAddress, openConnect, openWallet } = useInterwovenKit();

  return (
    <>
      {isConnected ? (
        <Button variant="outline" size="sm" onClick={openWallet}>
          <WalletIcon data-icon="inline-start" />
          {hexAddress.slice(0, 6)}...{hexAddress.slice(-4)}
        </Button>
      ) : (
        <Button size="sm" onClick={openConnect}>
          <WalletIcon data-icon="inline-start" />
          Connect
        </Button>
      )}
      <div className="hidden">
        <InterwovenKit />
      </div>
    </>
  );
}
