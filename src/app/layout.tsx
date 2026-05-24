import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { CurrencyProvider } from '../context/CurrencyContext';
import { RoadmapProvider } from '../context/RoadmapContext';

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
            <CurrencyProvider>
              <RoadmapProvider>
                {children}
              </RoadmapProvider>
            </CurrencyProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

