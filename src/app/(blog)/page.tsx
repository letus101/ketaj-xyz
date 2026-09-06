import { sanityFetch } from '@/sanity/client';
import { postsQuery, categoriesQuery } from '@/sanity/queries';
import { PostList } from './post-list';

export const revalidate = false; // Use tag-based revalidation

export default async function HomePage() {
  const [posts, categories] = await Promise.all([
    sanityFetch<any[]>({ query: postsQuery, tags: ['post'] }),
    sanityFetch<any[]>({ query: categoriesQuery, tags: ['category'] }),
  ]);

  return (
    <div className="container py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Research &amp; Writeups
        </h1>
        <p className="text-muted-foreground font-mono text-sm">
          Red team operations, DFIR, custom tooling, and CTF writeups.
        </p>
      </div>

      <PostList initialPosts={posts || []} categories={categories || []} />
    </div>
  );
}
