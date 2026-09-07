import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { TerminalEasterEgg } from '@/components/terminal-easter-egg';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ketaj.xyz',
    template: '%s | ketaj.xyz',
  },
  description:
    'Cybersecurity research — red team operations, DFIR, custom tooling, and CTF writeups.',
  metadataBase: new URL('https://ketaj.xyz'),
  openGraph: {
    title: 'ketaj.xyz',
    description:
      'Cybersecurity research — red team operations, DFIR, custom tooling, and CTF writeups.',
    siteName: 'ketaj.xyz',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ketaj.xyz',
    description: 'Cybersecurity research — red team operations, DFIR, custom tooling, and CTF writeups.',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  const siteJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://ketaj.xyz/#website',
        url: 'https://ketaj.xyz',
        name: 'ketaj.xyz',
        description: 'Cybersecurity research — red team operations, DFIR, custom tooling, and CTF writeups.',
        inLanguage: 'en-US',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://ketaj.xyz/?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Person',
        '@id': 'https://ketaj.xyz/#author',
        name: 'Ketaj',
        url: 'https://ketaj.xyz/about',
        sameAs: ['https://ketaj.xyz'],
        jobTitle: 'Cybersecurity Researcher',
        knowsAbout: [
          'Red Team Operations',
          'Digital Forensics and Incident Response',
          'Malware Analysis',
          'Exploit Development',
          'Cyber Threat Intelligence',
        ],
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        {/* 
          ██╗  ██╗███████╗████████╗ █████╗      ██╗  ██╗██╗   ██╗███████╗
          ██║ ██╔╝██╔════╝╚══██╔══╝██╔══██╗     ╚██╗██╔╝╚██╗ ██╔╝╚══███╔╝
          █████╔╝ █████╗     ██║   ███████║      ╚███╔╝  ╚████╔╝   ███╔╝ 
          ██╔═██╗ ██╔══╝     ██║   ██╔══██║      ██╔██╗   ╚██╔╝   ███╔╝  
          ██║  ██╗███████╗   ██║   ██║  ██║     ██╔╝ ██╗   ██║   ███████╗
          ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝     ╚═╝  ╚═╝   ╚═╝   ╚══════╝

          You found me. Good.
          You know what to do — you've seen the hint already.
          Type it. Anywhere on the page. Don't overthink it.

          knock knock.
        */}
        <Providers
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange
          storageKey="ketaj-theme"
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <TerminalEasterEgg />
        </Providers>
      </body>
    </html>
  );
}
