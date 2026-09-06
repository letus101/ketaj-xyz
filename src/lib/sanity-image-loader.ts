'use client';

interface SanityLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function sanityImageLoader({ src, width, quality = 75 }: SanityLoaderProps): string {
  // The src is already a Sanity CDN URL built by urlForImage().
  // We append width and quality params so Sanity CDN handles resizing.
  // This completely bypasses Vercel's Image Optimization API.
  try {
    const url = new URL(src);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('q', quality.toString());
    url.searchParams.set('auto', 'format');
    url.searchParams.set('fit', 'max');
    return url.href;
  } catch {
    return src;
  }
}
