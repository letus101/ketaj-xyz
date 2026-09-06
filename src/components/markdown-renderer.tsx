import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const prettyCodeOptions = {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    defaultLang: 'text',
    keepBackground: false,
  };

  const components = {
    h2: (props: any) => {
      const id = String(props.children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return <h2 id={id} {...props} />;
    },
    h3: (props: any) => {
      const id = String(props.children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return <h3 id={id} {...props} />;
    },
  };

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none 
      prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border prose-pre:rounded-none
      prose-a:text-primary prose-a:underline-offset-4 hover:prose-a:text-primary/80"
    >
      <MDXRemote
        source={content}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [[rehypePrettyCode as any, prettyCodeOptions]],
          },
        }}
      />
    </div>
  );
}
