export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container py-8 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
        <p className="text-sm font-mono text-muted-foreground">
          <span className="text-foreground">ketaj</span>
          <span className="text-primary">.xyz</span>
        </p>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
