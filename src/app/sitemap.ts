import { sanityFetch } from '@/sanity/client';
import { groq } from 'next-sanity';
import type { MetadataRoute } from 'next';

const sitemapPostsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    "slug": slug.current,
    publishedAt,
    _updatedAt
  }
`;

const sitemapCategoriesQuery = groq`
  *[_type == "category" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ketaj.xyz';

  const [posts, categories] = await Promise.all([
    sanityFetch<{ slug: string; publishedAt: string; _updatedAt: string }[]>({
      query: sitemapPostsQuery,
      tags: ['post'],
    }),
    sanityFetch<{ slug: string; _updatedAt: string }[]>({
      query: sitemapCategoriesQuery,
      tags: ['category'],
    }),
  ]);

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Dynamic post routes
  const postRoutes: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(post._updatedAt || post.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Dynamic category routes
  const categoryRoutes: MetadataRoute.Sitemap = (categories || []).map((cat) => ({
    url: `${baseUrl}/categories/${cat.slug}`,
    lastModified: new Date(cat._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes, ...categoryRoutes];
}
