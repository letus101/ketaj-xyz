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
      <PostList initialPosts={posts || []} categories={categories || []} />
    </div>
  );
}
