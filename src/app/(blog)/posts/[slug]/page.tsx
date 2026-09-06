import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { sanityFetch } from '@/sanity/client';
import { postBySlugQuery, postSlugsQuery } from '@/sanity/queries';
import { urlForImage } from '@/sanity/lib/image';
import { PortableTextRenderer, extractHeadings } from '@/components/portable-text';
import { TableOfContents } from '@/components/table-of-contents';
import { Badge } from '@/components/ui/badge';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { estimateReadingTime } from '@/lib/reading-time';

export const revalidate = false;

interface PostPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({
    query: postSlugsQuery,
    tags: ['post'],
  });
  return (slugs || []).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await sanityFetch<any>({
    query: postBySlugQuery,
    params: { slug: params.slug },
    tags: ['post', `post:${params.slug}`],
  });

  if (!post) return { title: 'Post Not Found' };

  const ogImage = post.mainImage?.asset
    ? urlForImage(post.mainImage).width(1200).height(630).url()
    : `/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(
        post.categories?.[0]?.title || 'Blog'
      )}`;

  return {
    title: post.title,
    description: post.excerpt || '',
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      type: 'article',
      publishedTime: post.publishedAt,
      url: `https://ketaj.xyz/posts/${post.slug.current}`,
      images: ogImage ? [{ url: ogImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || '',
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await sanityFetch<any>({
    query: postBySlugQuery,
    params: { slug: params.slug },
    tags: ['post', `post:${params.slug}`],
  });

  if (!post) notFound();

  // Extract headings from either Portable Text or Markdown
  let headings = [];
  if (post.markdownBody) {
    const lines = post.markdownBody.split('\n');
    headings = lines
      .filter((line: string) => line.startsWith('## ') || line.startsWith('### '))
      .map((line: string) => {
        const level = line.startsWith('###') ? 3 : 2;
        const text = line.replace(/^#+\s/, '');
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return { id, text, level };
      });
  } else {
    headings = extractHeadings(post.body || []);
  }

  const heroUrl = post.mainImage?.asset
    ? urlForImage(post.mainImage).width(1200).url()
    : null;

  return (
    <article className="container py-12">
      {/* Post header */}
      <header className="mb-10 max-w-3xl">
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map((cat: any) => (
              <Badge
                key={cat._id}
                variant={cat.slug?.current === 'red-team-operations' ? 'destructive' : 'default'}
              >
                {cat.title}
              </Badge>
            ))}
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 text-sm text-muted-foreground font-mono">
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {post.author && (
            <>
              <span className="text-border">|</span>
              <span>{post.author.name}</span>
            </>
          )}
          <span className="text-border">|</span>
          <span>{estimateReadingTime(post)} min read</span>
        </div>
      </header>

      {/* Hero image */}
      {heroUrl && (
        <div className="relative aspect-video w-full max-w-3xl overflow-hidden border border-border mb-10">
          <Image
            src={heroUrl}
            alt={post.mainImage?.alt || post.title}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
            priority
          />
        </div>
      )}


      {/* Content with desktop TOC sidebar */}
      <div className="flex gap-12">
        <div className="min-w-0 max-w-3xl flex-1">
          {post.markdownBody ? (
            <MarkdownRenderer content={post.markdownBody} />
          ) : (
            <PortableTextRenderer content={post.body || []} />
          )}
        </div>

        {headings.length > 0 && (
          <aside className="hidden lg:block w-64 shrink-0">
            <TableOfContents headings={headings} />
          </aside>
        )}
      </div>
    </article>
  );
}
