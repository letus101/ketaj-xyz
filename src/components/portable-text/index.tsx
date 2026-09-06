import { PortableText, type PortableTextReactComponents } from '@portabletext/react';
import { CodeBlock } from './code-block';
import { TerminalBlock } from './terminal-block';
import { ImageLightbox } from './image-lightbox';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const components: Partial<PortableTextReactComponents> = {
  types: {
    codeBlock: (props: any) => <CodeBlock value={props.value} />,
    terminalBlock: (props: any) => <TerminalBlock value={props.value} />,
    imageLightbox: (props: any) => <ImageLightbox value={props.value} />,
    image: ({ value }: { value: any }) => {
      if (!value?.asset) return null;
      const imageUrl = urlForImage(value).width(800).url();
      return (
        <figure className="my-8">
          <div className="relative aspect-video w-full overflow-hidden border border-border">
            <Image
              src={imageUrl}
              alt={value.alt || 'Post image'}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-xs text-muted-foreground">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children, value }: any) => {
      const text = value.children?.map((c: any) => c.text).join('') || '';
      const id = slugify(text);
      return (
        <h2 id={id} className="mt-12 mb-4 scroll-m-24 text-2xl font-bold tracking-tight border-b border-border pb-2">
          <a href={`#${id}`} className="hover:text-primary transition-colors">
            {children}
          </a>
        </h2>
      );
    },
    h3: ({ children, value }: any) => {
      const text = value.children?.map((c: any) => c.text).join('') || '';
      const id = slugify(text);
      return (
        <h3 id={id} className="mt-8 mb-3 scroll-m-24 text-xl font-semibold tracking-tight">
          <a href={`#${id}`} className="hover:text-primary transition-colors">
            {children}
          </a>
        </h3>
      );
    },
    h4: ({ children, value }: any) => {
      const text = value.children?.map((c: any) => c.text).join('') || '';
      const id = slugify(text);
      return (
        <h4 id={id} className="mt-6 mb-2 scroll-m-24 text-lg font-semibold">
          <a href={`#${id}`} className="hover:text-primary transition-colors">
            {children}
          </a>
        </h4>
      );
    },
    normal: ({ children }: any) => (
      <p className="leading-7 mb-4 text-foreground/90">{children}</p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="my-6 border-l-2 border-primary pl-4 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-bold">{children}</strong>,
    em: ({ children }: any) => <em>{children}</em>,
    code: ({ children }: any) => (
      <code className="bg-muted px-1.5 py-0.5 font-mono text-sm">{children}</code>
    ),
    link: ({ children, value }: any) => {
      const href = value?.href || '#';
      const isExternal = href.startsWith('http');
      return (
        <a
          href={href}
          className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      );
    },
    'strike-through': ({ children }: any) => <s>{children}</s>,
    underline: ({ children }: any) => <u>{children}</u>,
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-6 space-y-1 mb-4">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal pl-6 space-y-1 mb-4">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li className="text-foreground/90">{children}</li>,
    number: ({ children }: any) => <li className="text-foreground/90">{children}</li>,
  },
};

/**
 * Extracts heading data from Portable Text body for Table of Contents.
 */
export function extractHeadings(body: any[]): { id: string; text: string; level: number }[] {
  if (!body) return [];
  return body
    .filter((block) => block._type === 'block' && /^h[2-4]$/.test(block.style))
    .map((block) => {
      const text = block.children?.map((c: any) => c.text).join('') || '';
      const level = parseInt(block.style.replace('h', ''), 10);
      return { id: slugify(text), text, level };
    });
}

export function PortableTextRenderer({ content }: { content: any[] }) {
  return (
    <div className="prose-ketaj">
      <PortableText value={content} components={components} />
    </div>
  );
}
