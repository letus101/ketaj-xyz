'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
}

interface TagFilterProps {
  categories: Category[];
  activeSlug: string;
  onCategoryChange: (slug: string) => void;
}

export function TagFilter({ categories, activeSlug, onCategoryChange }: TagFilterProps) {
  return (
    <div className="flex overflow-x-auto gap-2 mb-8 pb-2">
      {/* "All" button */}
      <button
        onClick={() => onCategoryChange('')}
        className={cn(
          'shrink-0 whitespace-nowrap px-3 py-1.5 text-xs font-mono border transition-colors',
          activeSlug === ''
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground',
        )}
      >
        All
      </button>

      {/* Dynamic category buttons */}
      {categories.map((cat) => (
        <button
          key={cat._id}
          onClick={() => onCategoryChange(cat.slug.current)}
          className={cn(
            'shrink-0 whitespace-nowrap px-3 py-1.5 text-xs font-mono border transition-colors',
            activeSlug === cat.slug.current
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground',
          )}
        >
          {cat.title}
        </button>
      ))}
    </div>
  );
}
