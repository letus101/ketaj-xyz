import { codeToHtml } from 'shiki';
import { CopyButton } from './copy-button';
import { normalizeLanguage } from '@/lib/shiki';

interface CodeBlockProps {
  value: {
    code: string;
    language?: string;
    filename?: string;
    highlightLines?: string;
  };
}

/**
 * Server Component — Shiki highlighting happens at render time.
 * Zero client-side JS for syntax highlighting.
 */
export async function CodeBlock({ value }: CodeBlockProps) {
  const { code, language, filename, highlightLines } = value;
  const lang = normalizeLanguage(language || 'text');

  // Build Shiki options
  const html = await codeToHtml(code, {
    lang: lang as any,
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    defaultColor: false,
  });

  // Determine if this is a VQL block so we can show a note
  const isVqlFallback = (language || '').toLowerCase() === 'vql';

  return (
    <div className="group relative my-6 border border-border overflow-hidden">
      {/* Header bar with filename and language */}
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
        <span className="text-xs font-mono text-muted-foreground">
          {filename || lang}
          {isVqlFallback && (
            <span className="ml-2 text-[10px] opacity-60">(highlighted as SQL)</span>
          )}
        </span>
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60">
          {language || lang}
        </span>
      </div>

      {/* Code content */}
      <div className="relative">
        <CopyButton code={code} />
        <div
          className="overflow-x-auto p-4 text-sm font-mono leading-relaxed [&>pre]:!bg-transparent [&_code]:!bg-transparent [&_.line]:before:content-[counter(line)] [&_.line]:before:counter-increment-[line] [&_.line]:before:inline-block [&_.line]:before:w-8 [&_.line]:before:mr-4 [&_.line]:before:text-right [&_.line]:before:text-muted-foreground/40 [&_.line]:before:text-xs [&_code]:counter-reset-[line]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
