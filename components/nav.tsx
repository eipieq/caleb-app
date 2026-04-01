"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletButton } from "./wallet-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Feed" },
  { href: "/strategy", label: "Strategy" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-sm tracking-tight">
            caleb
          </Link>
          <nav className="flex items-center gap-1">
            {links.map((l) => (
              <Button
                key={l.href}
                variant={pathname === l.href ? "secondary" : "ghost"}
                size="sm"
                render={<Link href={l.href} />}
                nativeButton={false}
                className={cn(pathname === l.href && "font-medium")}
              >
                {l.label}
              </Button>
            ))}
          </nav>
        </div>
        <WalletButton />
      </div>
      <Separator />
    </header>
  );
}
