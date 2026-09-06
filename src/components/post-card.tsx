import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { urlForImage } from '@/sanity/lib/image';
import { estimateReadingTime } from '@/lib/reading-time';

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
}

interface PostCardProps {
  post: {
    title: string;
    slug: { current: string };
    excerpt?: string;
    publishedAt: string;
    categories?: Category[];
    mainImage?: any;
    author?: { name: string };
    body?: any;
    markdownBody?: string;
  };
}

export function PostCard({ post }: PostCardProps) {
  const imageUrl = post.mainImage?.asset ? urlForImage(post.mainImage).width(600).url() : null;

  return (
    <Link href={`/posts/${post.slug.current}`} className="group block">
      <article className="border border-border hover:border-primary/50 transition-colors overflow-hidden">
        {imageUrl && (
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={imageUrl}
              alt={post.mainImage?.alt || post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
        )}
        <div className="p-5">
          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.categories.map((cat) => (
                <Badge
                  key={cat._id}
                  variant={
                    cat.slug?.current === 'red-team-operations' ? 'destructive' : 'default'
                  }
                >
                  {cat.title}
                </Badge>
              ))}
            </div>
          )}

          <h2 className="text-lg font-bold leading-snug mb-2 group-hover:text-primary transition-colors">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
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
        </div>
      </article>
    </Link>
  );
}
