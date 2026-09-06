'use client';

import * as React from 'react';
import Link from 'next/link';
import { LogoLockup } from './logo/logo-lockup';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';

export function Header() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-all duration-200',
        'bg-background/80 backdrop-blur-md',
        scrolled ? 'border-border py-2' : 'border-transparent py-4',
      )}
    >
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center">
          {/* Full lockup on desktop / not scrolled; compact (fox only) when condensed or mobile */}
          <span className={cn(scrolled ? 'hidden sm:hidden' : 'hidden sm:flex')}>
            <LogoLockup />
          </span>
          <span className={cn(scrolled ? 'flex' : 'flex sm:hidden')}>
            <LogoLockup compact />
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
          >
            Posts
          </Link>
          <Link
            href="/about"
            className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
          >
            About
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
