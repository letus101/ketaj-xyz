import { Metadata } from 'next';
import Image from 'next/image';
import { sanityFetch } from '@/sanity/client';
import { aboutQuery } from '@/sanity/queries';
import { urlForImage } from '@/sanity/lib/image';
import { PortableTextRenderer } from '@/components/portable-text';

export const metadata: Metadata = {
  title: 'About',
  description: 'About the researcher behind ketaj.xyz.',
};

export const revalidate = false;

export default async function AboutPage() {
  const about = await sanityFetch<any>({
    query: aboutQuery,
    tags: ['about'],
  });

  if (!about) {
    return (
      <div className="container py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-4">About Me</h1>
        <p className="text-muted-foreground font-mono text-sm">
          No about content yet. Create an &quot;About&quot; document in the{' '}
          <a href="/studio" className="text-primary underline underline-offset-4">
            Studio
          </a>
          .
        </p>
      </div>
    );
  }

  const profileUrl = about.profileImage?.asset
    ? urlForImage(about.profileImage).width(400).height(400).url()
    : null;

  return (
    <div className="container py-12">
      <div className="max-w-3xl">
        {/* Profile section */}
        <div className="flex flex-col sm:flex-row gap-8 mb-10">
          {profileUrl && (
            <div className="relative h-32 w-32 shrink-0 overflow-hidden border border-border">
              <Image
                src={profileUrl}
                alt="Profile"
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-3">
              {about.heading || 'About Me'}
            </h1>
            {about.bio && (
              <p className="text-muted-foreground leading-relaxed">{about.bio}</p>
            )}
          </div>
        </div>

        {/* Social links */}
        {about.socials && about.socials.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-10">
            {about.socials.map((social: any, i: number) => (
              <a
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
              >
                {social.platform}
                <span className="text-primary">↗</span>
              </a>
            ))}
          </div>
        )}

        {/* Full body content */}
        {about.body && <PortableTextRenderer content={about.body} />}
      </div>
    </div>
  );
}
