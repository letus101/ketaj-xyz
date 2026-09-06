import { FoxMark } from './fox-mark';
import { cn } from '@/lib/utils';

interface LogoLockupProps {
  className?: string;
  compact?: boolean;
}

/**
 * Full ketaj.xyz logo lockup: fox mark + monospace wordmark + blinking cursor.
 * Fox mark sized to align with the wordmark's cap-height.
 * When compact=true, only the fox mark is rendered (mobile / scroll-condensed).
 */
export function LogoLockup({ className, compact = false }: LogoLockupProps) {
  if (compact) {
    return <FoxMark size={28} className={className} />;
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <FoxMark size={28} />
      <span className="font-mono font-bold leading-none select-none">
        <span className="text-xl text-foreground">ketaj</span>
        <span className="text-sm text-primary">.xyz</span>
      </span>
      {/* Blinking cursor */}
      <span
        className="inline-block w-[3px] h-5 bg-primary animate-blink-cursor -ml-1"
        aria-hidden="true"
      />
    </div>
  );
}
