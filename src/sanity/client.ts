import { createClient, type QueryParams } from 'next-sanity';
import { projectId, dataset, apiVersion } from './config';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
});

// Client for revalidation webhook — always bypasses CDN
export const revalidationClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
});

interface SanityFetchProps {
  query: string;
  params?: QueryParams;
  tags?: string[];
}

export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
}: SanityFetchProps): Promise<T> {
  return client.fetch<T>(query, params, {
    next: {
      revalidate: tags.length ? false : 3600,
      tags,
    },
  });
}
