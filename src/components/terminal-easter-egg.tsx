'use client';

import { useEffect, useState, useRef, ReactNode } from 'react';

const SECRET_CODE = ['h', 'a', 'c', 'k'];
const FLAG = 'HTB{th3_m4tr1x_1s_r34l}';

export function TerminalEasterEgg() {
  const [inputBuffer, setInputBuffer] = useState<string[]>([]);
  const [phase, setPhase] = useState<'idle' | 'glitching' | 'terminal'>('idle');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'idle') return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key.toLowerCase();
      setInputBuffer((prev) => {
        const newBuffer = [...prev, key].slice(-SECRET_CODE.length);
        if (newBuffer.join('') === SECRET_CODE.join('')) {
          startGlitch();
          return [];
        }
        return newBuffer;
      });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase]);

  const startGlitch = () => {
    setPhase('glitching');
    document.body.classList.add('glitch-active');
    
    // Inject the CTF flag into the DOM silently
    const meta = document.createElement('meta');
    meta.name = 'x-encryption-key';
    meta.content = FLAG;
    meta.id = 'ctf-meta-key';
    document.head.appendChild(meta);

    setTimeout(() => {
      document.body.classList.remove('glitch-active');
      document.body.style.overflow = 'hidden'; // lock scroll
      setPhase('terminal');
    }, 2000); // 2 seconds of glitch
  };

  const closeTerminal = () => {
    setPhase('idle');
    document.body.style.overflow = 'auto';
    const meta = document.getElementById('ctf-meta-key');
    if (meta) meta.remove();
  };

  if (phase === 'idle') return null;
  if (phase === 'glitching') return <div className="fixed inset-0 z-[9999] pointer-events-none mix-blend-difference bg-red-500/10 animate-pulse" />;

  return <InteractiveCLI onClose={closeTerminal} />;
}

function InteractiveCLI({ onClose }: { onClose: () => void }) {
  const [history, setHistory] = useState<{ text: string | ReactNode; isInput?: boolean }[]>([
    { text: 'ketajOS v2.4.1 (tty1)' },
    { text: '[!] WARNING: Unauthorized access detected. Session logged.' },
    { text: "Type 'help' for available commands." },
  ]);
  const [input, setInput] = useState('');
  const [matrixMode, setMatrixMode] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [history, matrixMode]);

  useEffect(() => {
    // Keep focus on input
    const interval = setInterval(() => {
      if (inputRef.current && document.activeElement !== inputRef.current && !matrixMode) {
        inputRef.current.focus();
      }
    }, 100);
    return () => clearInterval(interval);
  }, [matrixMode]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) {
      setHistory((prev) => [...prev, { text: `visitor@ketaj.xyz:~$ `, isInput: true }]);
      return;
    }

    setHistory((prev) => [...prev, { text: `visitor@ketaj.xyz:~$ ${trimmed}`, isInput: true }]);

    const args = trimmed.split(' ');
    const command = args[0].toLowerCase();

    switch (command) {
      case 'help':
        setHistory((prev) => [...prev, { text: 'Available commands: ls, cat, clear, decrypt, whoami, exit' }]);
        break;
      case 'whoami':
        setHistory((prev) => [...prev, { text: 'visitor (unprivileged)' }]);
        break;
      case 'clear':
        setHistory([]);
        break;
      case 'exit':
        onClose();
        break;
      case 'ls':
        setHistory((prev) => [...prev, { text: 'README.md   payload.enc' }]);
        break;
      case 'cat':
        if (args[1] === 'README.md') {
          setHistory((prev) => [...prev, { text: 'The payload is encrypted. You know where to look. (Hint: Inspect the page HEADers)' }]);
        } else if (args[1] === 'payload.enc') {
          setHistory((prev) => [...prev, { text: '[ERROR] File is encrypted. Use: decrypt payload.enc <key>' }]);
        } else {
          setHistory((prev) => [...prev, { text: `cat: ${args[1] || ''}: No such file or directory` }]);
        }
        break;
      case 'decrypt':
        if (args[1] !== 'payload.enc') {
          setHistory((prev) => [...prev, { text: 'Usage: decrypt payload.enc <key>' }]);
        } else if (args[2] === FLAG) {
          triggerMatrix();
        } else {
          setHistory((prev) => [...prev, { text: '[ERROR] Invalid decryption key. Access Denied.' }]);
        }
        break;
      default:
        setHistory((prev) => [...prev, { text: `bash: ${command}: command not found` }]);
    }
  };

  const triggerMatrix = () => {
    setMatrixMode(true);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050505] text-[#00ff00] font-mono text-sm sm:text-base p-6 overflow-y-auto selection:bg-[#00ff00] selection:text-black shadow-[inset_0_0_100px_rgba(0,255,0,0.05)]">
      {/* CRT Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #00ff00 2px, #00ff00 4px)', backgroundSize: '100% 4px' }} />
      
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col min-h-full">
        {!matrixMode ? (
          <>
            {history.map((line, i) => (
              <div key={i} className={`mb-1 ${line.isInput ? 'opacity-70' : 'opacity-100'}`}>
                {line.text}
              </div>
            ))}
            <div className="flex items-center mt-1">
              <span className="opacity-70 mr-2">visitor@ketaj.xyz:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCommand(input);
                    setInput('');
                  }
                }}
                autoComplete="off"
                spellCheck="false"
                className="flex-1 bg-transparent border-none outline-none text-[#00ff00]"
                autoFocus
              />
            </div>
          </>
        ) : (
          <MatrixSequence onClose={onClose} />
        )}
        <div ref={bottomRef} className="h-16" />
      </div>
    </div>
  );
}

function MatrixSequence({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  
  const messages = [
    "Decrypting payload...",
    "Access granted.",
    "",
    "Wake up, hacker.",
    "The matrix has you.",
    "Follow the white rabbit.",
    "Knock, knock."
  ];

  useEffect(() => {
    if (step >= messages.length) {
      const t = setTimeout(onClose, 3000);
      return () => clearTimeout(t);
    }

    const currentMessage = messages[step];
    
    if (currentMessage === "") {
      setStep(s => s + 1);
      setDisplayedText('');
      return;
    }

    let charIndex = 0;
    setDisplayedText('');
    
    const typeInterval = setInterval(() => {
      if (charIndex <= currentMessage.length) {
        setDisplayedText(currentMessage.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setStep(s => s + 1);
        }, 1500);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [step]);

  return (
    <div className="flex-1 flex items-center justify-center text-xl sm:text-3xl font-bold tracking-widest text-[#00ff00] drop-shadow-[0_0_10px_rgba(0,255,0,0.8)]">
      {displayedText}
      <span className="animate-pulse ml-1 inline-block w-3 sm:w-5 h-5 sm:h-8 bg-[#00ff00] relative top-1" />
    </div>
  );
}
