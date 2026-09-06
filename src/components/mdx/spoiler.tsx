'use client';

import { useState } from 'react';

interface SpoilerProps {
  title?: string;
  password?: string;
  children: React.ReactNode;
}

export function Spoiler({ title = 'Spoiler', password, children }: SpoilerProps) {
  const [isUnlocked, setIsUnlocked] = useState(!password);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleUnlock = () => {
    if (input.toLowerCase().trim() === password?.toLowerCase().trim()) {
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setInput('');
    }
  };

  if (isUnlocked) {
    return (
      <div className="my-6 border border-primary/50 bg-primary/5 rounded-md p-4">
        <div className="text-primary font-mono text-xs mb-4 uppercase tracking-widest border-b border-primary/20 pb-2 flex items-center justify-between">
          <span>[UNLOCKED: {title}]</span>
          <span className="text-green-500">ACCESS GRANTED</span>
        </div>
        <div className="prose-sm dark:prose-invert">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="my-6 border border-border bg-muted/30 rounded-md p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
      {/* Hacker background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}></div>
      
      <div className="relative z-10 w-full max-w-sm">
        <div className="text-destructive font-mono text-lg mb-2 flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          ENCRYPTED BLOCK
        </div>
        <div className="text-muted-foreground text-sm mb-6">{title}</div>
        
        <div className="flex flex-col gap-3">
          <input 
            type="text" 
            placeholder="Enter flag to unlock..." 
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(false);
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            className={`w-full bg-background border ${error ? 'border-destructive' : 'border-border'} px-4 py-2 font-mono text-sm focus:outline-none focus:border-primary transition-colors text-center`}
          />
          {error && <span className="text-destructive text-xs font-mono">ACCESS DENIED</span>}
          <button 
            onClick={handleUnlock}
            className="w-full bg-primary text-primary-foreground font-mono font-bold text-sm py-2 hover:bg-primary/90 transition-colors uppercase tracking-widest"
          >
            Decrypt
          </button>
        </div>
      </div>
    </div>
  );
}
