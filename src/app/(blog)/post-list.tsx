'use client';

import * as React from 'react';
import { PostCard } from '@/components/post-card';
import { TagFilter } from '@/components/tag-filter';

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
}

interface PostListProps {
  initialPosts: any[];
  categories: Category[];
}

export function PostList({ initialPosts, categories }: PostListProps) {
  const [activeSlug, setActiveSlug] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredPosts = initialPosts.filter((post) => {
    const matchesCategory = activeSlug
      ? post.categories?.some((cat: Category) => cat.slug?.current === activeSlug)
      : true;
      
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery
      ? post.title?.toLowerCase().includes(searchLower) ||
        post.excerpt?.toLowerCase().includes(searchLower)
      : true;

    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-border pb-4">
        <TagFilter
          categories={categories}
          activeSlug={activeSlug}
          onCategoryChange={setActiveSlug}
        />
        
        <div className="relative md:max-w-xs w-full">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border px-3 py-1.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors mb-2 md:mb-8"
          />
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <p className="text-muted-foreground font-mono text-sm py-12 text-center">
          No posts found.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post: any) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
