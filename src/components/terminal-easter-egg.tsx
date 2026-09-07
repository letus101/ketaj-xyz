'use client';

import { useEffect, useState, useRef, ReactNode } from 'react';

const SECRET_CODE = ['h', 'a', 'c', 'k'];

// ── CTF CHALLENGE PIPELINE ──────────────────────────────────────────────────
// Flag: KET{c0ns0l3_1s_th3_w4y}
//
// How the player solves it:
//   1. `cat system.conf`  →  reveals XOR key (0x5A) and that a BEACON exists
//   2. Open browser DevTools → Console tab
//   3. See the styled BEACON log with a Base64 string
//   4. In console: const h = atob("<base64>")
//   5. In console: String.fromCharCode(...h.match(/.{2}/g).map(b => parseInt(b,16) ^ 0x5A))
//   6. Gets the flag → decrypt payload.enc KET{c0ns0l3_1s_th3_w4y}
const FLAG = 'KET{c0ns0l3_1s_th3_w4y}';

function xorHex(str: string, key: number): string {
  return Array.from(str)
    .map(c => (c.charCodeAt(0) ^ key).toString(16).padStart(2, '0'))
    .join('');
}

const XOR_KEY = 0x5A;
// These are evaluated lazily at runtime on the client only
let HEX_CIPHER = '';
let B64_BEACON = '';
if (typeof window !== 'undefined') {
  HEX_CIPHER = xorHex(FLAG, XOR_KEY);
  B64_BEACON = btoa(HEX_CIPHER);
}

const BOOT_LINES = [
  '> Initializing ketajOS v2.4.1...',
  '> Loading kernel modules...            [  OK  ]',
  '> Mounting encrypted filesystem...     [  OK  ]',
  '> Starting network stack...            [  OK  ]',
  '> Bypassing perimeter firewall...      [ WARN ]',
  '> Establishing covert channel...       [  OK  ]',
  '> Injecting payload into session...    [  OK  ]',
  '> WARNING: Unauthorized shell access detected.',
  '> Logging session. You have been identified.',
  '',
  'ketajOS v2.4.1 (tty1)',
  '[!] Type \'help\' for available commands.',
];

export function TerminalEasterEgg() {
  const [inputBuffer, setInputBuffer] = useState<string[]>([]);
  const [phase, setPhase] = useState<'idle' | 'glitching' | 'black' | 'booting' | 'terminal'>('idle');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'idle') return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toLowerCase();
      setInputBuffer((prev) => {
        const newBuffer = [...prev, key].slice(-SECRET_CODE.length);
        if (newBuffer.join('') === SECRET_CODE.join('')) {
          startSequence();
          return [];
        }
        return newBuffer;
      });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase]);

  const startSequence = () => {
    // Phase 1: Violent glitch — 1.8s
    setPhase('glitching');
    document.body.classList.add('glitch-active');

    // Phase 2: Cut to pure black — after 1.8s
    setTimeout(() => {
      document.body.classList.remove('glitch-active');
      document.body.style.overflow = 'hidden';
      setPhase('black');
    }, 1800);

    // Phase 3: Boot + fire covert console BEACON — after 2.3s
    setTimeout(() => {
      // Fire the styled BEACON into the browser console
      // This is what the player must find to start the CTF
      console.log(
        '%c[ketajOS BEACON] %cCovert channel established.\n%c[HANDSHAKE] Encrypted payload intercepted:\n%c' + B64_BEACON + '\n%c\nDecode this. You know how.',
        'color:#00ff00;font-family:monospace;font-weight:bold;',
        'color:#00cc00;font-family:monospace;',
        'color:#888;font-family:monospace;font-size:11px;',
        'color:#f2a93b;font-family:monospace;font-size:12px;word-break:break-all;',
        'color:#555;font-family:monospace;font-style:italic;font-size:11px;'
      );
      setPhase('booting');
    }, 2300);
  };

  const onBootComplete = () => setPhase('terminal');

  const closeTerminal = () => {
    setPhase('idle');
    document.body.style.overflow = 'auto';
  };

  if (phase === 'idle') return null;

  if (phase === 'glitching') return <GlitchScreen />;

  if (phase === 'black') return (
    <div className="fixed inset-0 z-[9999] bg-black" />
  );

  if (phase === 'booting') return (
    <BootSequence lines={BOOT_LINES} onComplete={onBootComplete} />
  );

  return <InteractiveCLI onClose={closeTerminal} />;
}

/* ── GLITCH SCREEN ── */
function GlitchScreen() {
  return (
    <div className="fixed inset-0 z-[9999] bg-black pointer-events-none overflow-hidden">
      {/* Red channel shifted right */}
      <div className="absolute inset-0 mix-blend-screen opacity-70"
        style={{ background: 'rgba(255,0,0,0.15)', transform: 'translateX(6px)' }} />
      {/* Blue channel shifted left */}
      <div className="absolute inset-0 mix-blend-screen opacity-70"
        style={{ background: 'rgba(0,0,255,0.15)', transform: 'translateX(-6px)' }} />
      {/* Aggressive horizontal noise bars */}
      <div className="absolute inset-0" style={{
        backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 3px,
          rgba(255,255,255,0.03) 3px,
          rgba(255,255,255,0.03) 4px
        )`,
        animation: 'glitch-bars 0.08s step-end infinite',
      }} />
      {/* White flash stripes */}
      <div className="absolute inset-0" style={{
        background: 'repeating-linear-gradient(0deg, transparent 0%, transparent 92%, rgba(255,255,255,0.08) 92%, rgba(255,255,255,0.08) 100%)',
        backgroundSize: '100% 60px',
        animation: 'glitch-shift 0.1s step-end infinite',
      }} />
      <div className="absolute inset-0 bg-white/5 animate-pulse" />
    </div>
  );
}

/* ── BOOT SEQUENCE ── */
function BootSequence({ lines, onComplete }: { lines: string[]; onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [currentLineText, setCurrentLineText] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [visibleLines, currentLineText]);

  useEffect(() => {
    if (lineIndex >= lines.length) {
      setTimeout(onComplete, 600);
      return;
    }

    const line = lines[lineIndex];

    // Empty line — skip typing, just add blank line
    if (line === '') {
      const delay = setTimeout(() => {
        setVisibleLines(prev => [...prev, '']);
        setLineIndex(i => i + 1);
        setCharIndex(0);
        setCurrentLineText('');
      }, 200);
      return () => clearTimeout(delay);
    }

    if (charIndex <= line.length) {
      const speed = line.startsWith('>') ? 18 : 12;
      const t = setTimeout(() => {
        setCurrentLineText(line.slice(0, charIndex));
        setCharIndex(c => c + 1);
      }, speed);
      return () => clearTimeout(t);
    } else {
      // Line complete — add pause then move to next
      const pause = line.includes('WARN') ? 400 : line.includes('WARNING') ? 600 : 80;
      const t = setTimeout(() => {
        setVisibleLines(prev => [...prev, line]);
        setCurrentLineText('');
        setLineIndex(i => i + 1);
        setCharIndex(0);
      }, pause);
      return () => clearTimeout(t);
    }
  }, [lineIndex, charIndex, lines]);

  const isWarning = (l: string) => l.includes('WARN') || l.includes('WARNING');
  const isOk = (l: string) => l.includes('OK');

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050505] text-[#00ff00] font-mono text-sm p-8 overflow-hidden">
      {/* CRT scanlines */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2) 1px, transparent 1px, transparent 3px)',
        backgroundSize: '100% 3px',
      }} />
      <div className="relative z-10 max-w-3xl">
        {visibleLines.map((line, i) => (
          <div key={i} className={`mb-0.5 ${
            isWarning(line) ? 'text-yellow-400' :
            isOk(line) ? 'text-[#00ff00]' :
            line === '' ? 'h-4' : 'text-[#00cc00]'
          }`}>
            {line}
          </div>
        ))}
        {currentLineText && (
          <div className={`mb-0.5 ${isWarning(currentLineText) ? 'text-yellow-400' : 'text-[#00ff00]'}`}>
            {currentLineText}
            <span className="animate-pulse">█</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
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
        setHistory((prev) => [...prev, {
          text: (
            <span>
              <span className="text-[#00ff00]">README.md</span>
              {'   '}
              <span className="text-[#f2a93b]">payload.enc</span>
              {'   '}
              <span className="text-[#888]">system.conf</span>
            </span>
          )
        }]);
        break;
      case 'cat':
        if (args[1] === 'README.md') {
          setHistory((prev) => [...prev,
            { text: '─────────────────────────────────' },
            { text: 'Project: PAYLOAD_VAULT v1.0' },
            { text: '' },
            { text: 'payload.enc is locked behind a 24-byte symmetric key.' },
            { text: 'The key was transmitted over a covert channel during boot.' },
            { text: '' },
            { text: 'NOTE: This is not the terminal you should be looking at.' },
            { text: '      The other one. The one the browser uses.' },
            { text: '' },
            { text: 'See system.conf for decryption instructions.' },
            { text: '─────────────────────────────────' },
          ]);
        } else if (args[1] === 'system.conf') {
          setHistory((prev) => [...prev,
            { text: '─────────────────────────────────' },
            { text: '# ketajOS :: system.conf' },
            { text: '# ENCRYPTION SPEC :: payload.enc' },
            { text: '' },
            { text: 'ALGORITHM  : XOR stream cipher' },
            { text: 'KEY        : 0x5A (single-byte, repeating)' },
            { text: 'ENCODING   : hex → base64' },
            { text: '' },
            { text: '# RETRIEVAL' },
            { text: 'The base64-encoded ciphertext was broadcast via BEACON' },
            { text: 'during the boot sequence. Check the covert channel.' },
            { text: '' },
            { text: '# DECRYPTION (run in your other terminal)' },
            { text: '  const h = atob("<paste BEACON here>")' },
            { text: '  const flag = String.fromCharCode(' },
            { text: '    ...h.match(/.{2}/g).map(b => parseInt(b,16) ^ 0x5A)' },
            { text: '  )' },
            { text: '' },
            { text: 'Good luck.' },
            { text: '─────────────────────────────────' },
          ]);
        } else if (args[1] === 'payload.enc') {
          setHistory((prev) => [...prev, { text: '[ERROR] File is encrypted. Use: decrypt payload.enc <key>' }]);
        } else {
          setHistory((prev) => [...prev, { text: `cat: ${args[1] || ''}: No such file or directory` }]);
        }
        break;
      case 'decrypt':
        if (args[1] !== 'payload.enc') {
          setHistory((prev) => [...prev, { text: 'Usage: decrypt payload.enc <key>' }]);
        } else if (args.slice(2).join(' ') === FLAG) {
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
    <div className="fixed inset-0 z-[9999] bg-[#050505] text-[#00ff00] font-mono text-sm sm:text-base p-6 overflow-y-auto selection:bg-[#00ff00] selection:text-black"
      style={{ filter: 'contrast(1.1) brightness(0.95)' }}>

      {/* ── CRT Layer 1: Static fine scanlines ── */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.25), rgba(0,0,0,0.25) 1px, transparent 1px, transparent 3px)',
        backgroundSize: '100% 3px',
        zIndex: 1,
      }} />

      {/* ── CRT Layer 2: Moving phosphor sweep line ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 255, 0, 0.035) 40%, rgba(0, 255, 0, 0.06) 50%, rgba(0, 255, 0, 0.035) 60%, transparent 100%)',
          animation: 'crt-sweep 6s linear infinite',
        }} />
      </div>

      {/* ── CRT Layer 3: Phosphor glow flicker ── */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, rgba(0,255,0,0.04) 0%, transparent 70%)',
        animation: 'crt-flicker 0.15s step-end infinite',
        zIndex: 3,
      }} />

      {/* ── CRT Layer 4: Screen curvature vignette ── */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.7) 100%)',
        zIndex: 4,
      }} />

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
                  } else if (e.key === 'Tab') {
                    e.preventDefault(); // Prevent losing focus
                    
                    const args = input.split(' ');
                    const currentWord = args[args.length - 1];
                    let candidates: string[] = [];
                    
                    if (args.length === 1) {
                      candidates = ['help', 'whoami', 'clear', 'exit', 'ls', 'cat', 'decrypt'];
                    } else if (args.length === 2 && ['cat', 'decrypt'].includes(args[0].toLowerCase())) {
                      candidates = ['README.md', 'payload.enc', 'system.conf'];
                    }
                    
                    const matches = candidates.filter(c => c.startsWith(currentWord));
                    
                    if (matches.length === 1) {
                      args[args.length - 1] = matches[0];
                      setInput(args.join(' ') + ' ');
                    }
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
