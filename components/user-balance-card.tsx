"use client";

import { useInterwovenKit } from "@initia/interwovenkit-react";
import { useBalance } from "wagmi";
import { EVM_CHAIN_ID } from "@/lib/config";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { WalletIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function UserBalanceCard() {
  const { isConnected, hexAddress } = useInterwovenKit();

  const { data: initBalance, isLoading } = useBalance({
    address: hexAddress as `0x${string}`,
    chainId: EVM_CHAIN_ID,
    query: { enabled: isConnected && !!hexAddress, refetchInterval: 10_000 },
  });

  if (!isConnected) return null;

  const balance = initBalance
    ? parseFloat(initBalance.formatted).toFixed(4)
    : null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              Your Wallet
              <Badge variant="secondary" className="font-mono text-xs">
                {hexAddress.slice(0, 6)}…{hexAddress.slice(-4)}
              </Badge>
            </CardTitle>
            <CardDescription>Live balance on caleb-chain</CardDescription>
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
            ) : balance !== null ? (
              <span className="font-mono font-semibold text-lg tabular-nums">
                {balance} <span className="text-sm text-muted-foreground font-normal">INIT</span>
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">—</span>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Network</span>
            <span className="text-sm font-medium">caleb-chain</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
