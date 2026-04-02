"use client";

import { useInterwovenKit } from "@initia/interwovenkit-react";
import { useQuery } from "@tanstack/react-query";
import { bech32 } from "@scure/base";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const INITIA_REST = "https://rest.testnet.initia.xyz";

function hexToBech32(hex: string, prefix = "init"): string {
  const bytes = Uint8Array.from(Buffer.from(hex.replace("0x", ""), "hex"));
  return bech32.encode(prefix, bech32.toWords(bytes));
}

async function fetchInitBalance(hexAddress: string): Promise<number> {
  const cosmosAddress = hexToBech32(hexAddress);
  const res = await fetch(
    `${INITIA_REST}/cosmos/bank/v1beta1/balances/${cosmosAddress}`,
    { cache: "no-store" }
  );
  if (!res.ok) return 0;
  const data = await res.json();
  const uinit = (data.balances ?? []).find((b: { denom: string }) => b.denom === "uinit");
  return uinit ? parseInt(uinit.amount) / 1_000_000 : 0;
}

export function UserBalanceCard() {
  const { isConnected, hexAddress } = useInterwovenKit();

  const { data: balance, isLoading } = useQuery({
    queryKey: ["initBalance", hexAddress],
    queryFn: () => fetchInitBalance(hexAddress),
    enabled: isConnected && !!hexAddress,
    refetchInterval: 15_000,
  });

  if (!isConnected) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              Your Wallet
              <Badge variant="secondary" className="font-mono text-xs">
                {hexAddress?.slice(0, 6)}…{hexAddress?.slice(-4)}
              </Badge>
            </CardTitle>
            <CardDescription>Live balance on Initia testnet</CardDescription>
          </div>
          <Button size="sm" variant="outline" render={<Link href="/strategy" />} nativeButton={false}>
            Strategy <ArrowRightIcon className="size-3.5 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">INIT balance</span>
            {isLoading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <span className="font-mono font-semibold text-lg tabular-nums">
                {balance?.toFixed(4) ?? "0.0000"}{" "}
                <span className="text-sm text-muted-foreground font-normal">INIT</span>
              </span>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Network</span>
            <span className="text-sm font-medium">initiation-2</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
