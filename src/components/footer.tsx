export function Footer() {
  return (
    <footer className="border-t border-border">
      {/* Easter egg hint — hidden in plain sight for those who look */}
      {/* You know what to do. Type it. */}
      <div className="container py-8 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
        <p className="text-sm font-mono text-muted-foreground">
          <span className="text-foreground">ketaj</span>
          <span className="text-primary">.xyz</span>
        </p>

        {/* Blinking terminal prompt — the hint */}
        <p className="text-xs font-mono text-muted-foreground/40 select-none tracking-tight hidden sm:flex items-center gap-2">
          <span className="italic opacity-60">knock knock.</span>
          <span>root@ketaj.xyz:~$</span>
          <span
            className="inline-block w-[7px] h-[11px] bg-muted-foreground/40"
            style={{ animation: 'crt-cursor-blink 1.1s step-end infinite' }}
          />
        </p>

        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
