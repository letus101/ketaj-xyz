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
  return (
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
  );
}
