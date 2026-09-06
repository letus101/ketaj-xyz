import { CopyButton } from './copy-button';

interface TerminalBlockProps {
  value: {
    command?: string;
    output: string;
  };
}

/**
 * Terminal / console output block.
 * Always rendered with a dark terminal aesthetic regardless of theme.
 * No syntax highlighting — raw output preserved.
 */
export function TerminalBlock({ value }: TerminalBlockProps) {
  const { command, output } = value;
  const fullContent = command ? `$ ${command}\n${output}` : output;

  return (
    <div className="group relative my-6 border border-border overflow-hidden">
      {/* Terminal title bar */}
      <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 bg-crimson/60" />
          <span className="h-2.5 w-2.5 bg-amber/60" />
          <span className="h-2.5 w-2.5 bg-green-500/60" />
        </div>
        <span className="text-xs font-mono text-muted-foreground">terminal</span>
      </div>

      {/* Terminal content */}
      <div className="relative bg-[#0A0C14] text-[#E7EAF0]">
        <CopyButton code={fullContent} />
        <pre className="overflow-x-auto p-4 text-sm font-mono leading-relaxed whitespace-pre-wrap">
          {command && (
            <div className="mb-1">
              <span className="text-[#F2A93B]">$</span>{' '}
              <span className="text-[#E7EAF0]">{command}</span>
            </div>
          )}
          <div className="text-[#E7EAF0]/80">{output}</div>
        </pre>
      </div>
    </div>
  );
}
