export function Footer() {
  return (
    <footer className="border-t mt-16 py-6 px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 text-xs text-muted-foreground font-mono flex-wrap">
        <div className="flex items-center gap-3">
          <span>caleb-chain</span>
          <span className="text-muted-foreground/40">·</span>
          <span>minievm rollup</span>
          <span className="text-muted-foreground/40">·</span>
          <a
            href="https://scan.testnet.initia.xyz/initiation-2"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            settles to initiation-2 ↗
          </a>
        </div>
        <span className="text-muted-foreground/40">INITIATE hackathon 2026</span>
      </div>
    </footer>
  );
}
