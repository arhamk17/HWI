import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { GlobalBackground } from '@/components/GlobalBackground/GlobalBackground';
import { Navigation } from '@/components/Navigation/Navigation';
import { RulerScrollbar } from '@/components/RulerScrollbar/RulerScrollbar';
import { SmoothScrollProvider } from '@/components/SmoothScrollProvider';
import { CustomCursor } from '@/components/Cursor/CustomCursor';
import { InteractiveEffects } from '@/components/InteractiveEffects/InteractiveEffects';
import { EasterEgg } from '@/components/EasterEgg/EasterEgg';
import { PageTransitionProvider } from '@/components/Transitions/PageTransition';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
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
    <html lang="en" className={`${poppins.variable} ${poppins.className}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                if ('scrollRestoration' in history) {
                  history.scrollRestoration = 'manual';
                }
                window.scrollTo(0, 0);
              }
            `,
          }}
        />
      </head>
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
