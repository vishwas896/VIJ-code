import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { RecruiterProvider } from '../context/RecruiterContext';
import { CurrencyProvider } from '../context/CurrencyContext';
import { RoadmapProvider } from '../context/RoadmapContext';
import { LanguageProvider } from '../context/LanguageContext';

export const metadata: Metadata = {
  title: 'Project VIJ – Virtual Intelligent Junction',
  description: 'Your career, mapped by experience. Discover jobs, roadmaps, networking, and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <RecruiterProvider>
              <CurrencyProvider>
                <LanguageProvider>
                  <RoadmapProvider>
                    {children}
                  </RoadmapProvider>
                </LanguageProvider>
              </CurrencyProvider>
            </RecruiterProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
