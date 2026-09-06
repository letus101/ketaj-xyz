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

  const filteredPosts = activeSlug
    ? initialPosts.filter((post) =>
        post.categories?.some((cat: Category) => cat.slug?.current === activeSlug),
      )
    : initialPosts;

  return (
    <>
      <TagFilter
        categories={categories}
        activeSlug={activeSlug}
        onCategoryChange={setActiveSlug}
      />

      {filteredPosts.length === 0 ? (
        <p className="text-muted-foreground font-mono text-sm py-12 text-center">
          No posts found{activeSlug ? ` in this category` : ''}.
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
