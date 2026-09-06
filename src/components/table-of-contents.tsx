'use client';

import * as React from 'react';
import { useActiveHeading } from '@/hooks/useActiveHeading';
import { cn } from '@/lib/utils';
import { List } from 'lucide-react';

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ headings }: { headings: HeadingItem[] }) {
  const activeId = useActiveHeading(headings.map((h) => h.id));
  const [expanded, setExpanded] = React.useState(false);

  if (!headings.length) return null;

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <nav className="hidden lg:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
        <p className="font-mono font-semibold text-foreground uppercase tracking-wider text-xs mb-3">
          On this page
        </p>
        <ul className="space-y-1 border-l border-border pl-3">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            return (
              <li key={heading.id} style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}>
                <a
                  href={`#${heading.id}`}
                  className={cn(
                    'block py-1 text-xs transition-colors hover:text-foreground',
                    isActive
                      ? 'font-medium text-primary border-l-2 border-primary -ml-[13px] pl-[13px]'
                      : 'text-muted-foreground',
                  )}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile: collapsible */}
      <div className="lg:hidden mb-8 border border-border">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 w-full px-4 py-3 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <List className="h-4 w-4" />
          Table of Contents
          <span className="ml-auto text-xs">{expanded ? '▲' : '▼'}</span>
        </button>
        {expanded && (
          <ul className="px-4 pb-4 space-y-1 border-t border-border pt-3">
            {headings.map((heading) => (
              <li key={heading.id} style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}>
                <a
                  href={`#${heading.id}`}
                  onClick={() => setExpanded(false)}
                  className="block py-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
