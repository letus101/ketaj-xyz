import ReactMarkdown from 'react-markdown';
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

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none 
      prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border prose-pre:rounded-none
      prose-a:text-primary prose-a:underline-offset-4 hover:prose-a:text-primary/80"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypePrettyCode as any, prettyCodeOptions]]}
        components={{
          h2: ({ node, children, ...props }) => {
            const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            return <h2 id={id} {...props}>{children}</h2>;
          },
          h3: ({ node, children, ...props }) => {
            const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            return <h3 id={id} {...props}>{children}</h3>;
          },
          code: ({ node, inline, className, children, ...props }: any) => {
            // Rehype-pretty-code handles block code.
            // If it's inline code, we style it custom:
            if (inline) {
              return (
                <code
                  className="bg-muted/60 px-1.5 py-0.5 rounded-sm text-sm font-mono text-primary before:content-[''] after:content-['']"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            // For block code, rehype-pretty-code overrides this, but just in case:
            return <code className={className} {...props}>{children}</code>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
