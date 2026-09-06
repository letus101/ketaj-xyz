'use client';

import * as React from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CopyButton({ code, className }: { code: string; className?: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy to clipboard"
      className={cn(
        'absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center',
        'border border-border/50 bg-background/80 backdrop-blur-sm',
        'text-muted-foreground hover:text-foreground transition-colors',
        'opacity-0 group-hover:opacity-100',
        className,
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}
