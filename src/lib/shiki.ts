import { type BundledLanguage } from 'shiki';

/**
 * VQL (Velociraptor Query Language) has no built-in Shiki grammar.
 * We fall back to SQL as the closest syntactic analogue — both use
 * SELECT/FROM/WHERE/GROUP BY/ORDER BY patterns. This approximation
 * covers ~90% of VQL keyword highlighting.
 */
export const LANGUAGE_MAP: Record<string, string> = {
  vql: 'sql',
  'c++': 'cpp',
  assembly: 'asm',
  shell: 'bash',
  sh: 'bash',
  ps1: 'powershell',
  ps: 'powershell',
};

export function normalizeLanguage(lang: string): string {
  const cleaned = (lang || '').toLowerCase().trim();
  return LANGUAGE_MAP[cleaned] || cleaned || 'text';
}
