import type { Metadata } from 'next';
import { Outfit, Inter, JetBrains_Mono } from 'next/font/google';
import { GlobalBackground } from '@/components/GlobalBackground/GlobalBackground';
import { Navigation } from '@/components/Navigation/Navigation';
import { RulerScrollbar } from '@/components/RulerScrollbar/RulerScrollbar';
import { SmoothScrollProvider } from '@/components/SmoothScrollProvider';
import { CustomCursor } from '@/components/Cursor/CustomCursor';
import { InteractiveEffects } from '@/components/InteractiveEffects/InteractiveEffects';
import { EasterEgg } from '@/components/EasterEgg/EasterEgg';
import { PageTransitionProvider } from '@/components/Transitions/PageTransition';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-satoshi',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-general-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HackWithIndia BVUDET-NM Chapter',
  description: 'Innovate. Create. Elevate. The student developer community at Bharati Vidyapeeth, Navi Mumbai.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <SmoothScrollProvider>
          <GlobalBackground />
          <CustomCursor />
          <InteractiveEffects />
          <EasterEgg />
          <RulerScrollbar />
          <Navigation />
          <PageTransitionProvider>
            {children}
          </PageTransitionProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
