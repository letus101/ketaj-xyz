'use client';

import { useEffect, useState } from 'react';

const SECRET_CODE = ['h', 'a', 'c', 'k'];

export function TerminalEasterEgg() {
  const [inputBuffer, setInputBuffer] = useState<string[]>([]);
  const [isTerminalMode, setIsTerminalMode] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key.toLowerCase();
      
      setInputBuffer((prev) => {
        const newBuffer = [...prev, key].slice(-SECRET_CODE.length);
        
        if (newBuffer.join('') === SECRET_CODE.join('')) {
          // Trigger easter egg
          setIsTerminalMode((prevMode) => {
            const nextMode = !prevMode;
            if (nextMode) {
              document.documentElement.classList.add('theme-terminal');
            } else {
              document.documentElement.classList.remove('theme-terminal');
            }
            return nextMode;
          });
          return []; // reset
        }
        
        return newBuffer;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isTerminalMode) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
      <div className="bg-black/80 text-green-500 font-mono text-xs px-3 py-1.5 border border-green-500/50 flex items-center gap-2 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
        <span className="animate-pulse">_</span>
        TERMINAL_MODE_ENGAGED
      </div>
    </div>
  );
}
