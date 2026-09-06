import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="portable-text">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node, ...props }) => (
            <a {...props} className="text-primary underline underline-offset-4" />
          ),
          h2: ({ node, children, ...props }) => {
            const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            return <h2 id={id} {...props} className="text-2xl font-bold mt-10 mb-4">{children}</h2>;
          },
          h3: ({ node, children, ...props }) => {
            const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            return <h3 id={id} {...props} className="text-xl font-bold mt-8 mb-4">{children}</h3>;
          },
          code: ({ node, inline, className, children, ...props }: any) => {
            if (inline) {
              return (
                <code
                  className="bg-muted px-1.5 py-0.5 rounded-sm text-sm font-mono text-primary before:content-[''] after:content-['']"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <pre className="bg-muted p-4 rounded-none overflow-x-auto text-sm font-mono border border-border">
                <code {...props} className={className}>
                  {children}
                </code>
              </pre>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
