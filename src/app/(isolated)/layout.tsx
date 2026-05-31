'use client';
import { LiquidBackground } from '../../components/common/LiquidBackground';
import { useTheme } from '../../context/ThemeContext';

// Isolated layout – no header, no footer (used for /login, /register, /interview)
export default function IsolatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { preferences } = useTheme();

  return (
    <LiquidBackground>
      {preferences.backgroundImage && (
        <div 
          className="personalization-bg-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${preferences.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.8,
            filter: 'none',
            pointerEvents: 'none',
            zIndex: -1,
            transition: 'background-image 0.5s ease, filter 0.5s ease, opacity 0.5s ease',
          }}
        />
      )}
      {children}
    </LiquidBackground>
  );
}
