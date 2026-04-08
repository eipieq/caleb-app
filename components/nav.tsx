"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletButton } from "./wallet-button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "feed" },
  { href: "/strategy", label: "strategy" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
      <div className="max-w-4xl mx-auto px-6 h-12 py-3 flex items-center justify-between">

        {/* left: logo + links */}
        <div className="flex items-center gap-5">
          <Link href="/" className="flex flex-col leading-[1.1]">
            <span style={{ fontFamily: "var(--font-instrument-sans)", fontWeight: 700, fontSize: 17, letterSpacing: "-0.03em" }}>caleb</span>
            <span style={{ fontFamily: "var(--font-instrument-sans)", fontWeight: 400, fontSize: 17, letterSpacing: "-0.03em" }} className="text-muted-foreground">trust the math</span>
          </Link>
          <span className="text-border/60 select-none">|</span>
          <nav className="flex items-center gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "text-sm transition-colors",
                  pathname === l.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* right: live indicator + wallet */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">agent live</span>
          </div>
          <WalletButton />
        </div>

      </div>
    </header>
  );
}
