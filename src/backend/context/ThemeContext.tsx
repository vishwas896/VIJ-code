import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface UserThemePreferences {
  selectedTheme: string;
  darkMode: boolean;
  primaryColor: string;
  accentColor: string;
  backgroundImage: string;
  layoutMode: 'comfortable' | 'compact' | 'minimal';
  animationEnabled: boolean;
  blurIntensity: number;
  sidebarStyle: 'glass' | 'solid' | 'gradient';
  fontPreference: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  darkMode: boolean;
  primaryColor: string;
  accentColor: string;
  bgGradient: string;
  textMain: string;
  textMuted: string;
  glassWhite: string;
  glassBorder: string;
  bgImagePresetUrl?: string;
  description: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'vij-classic',
    name: 'VIJ Classic',
    darkMode: false,
    primaryColor: '#dd3a22', // Brand red
    accentColor: '#2563eb', // Blue
    bgGradient: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
    textMain: '#18181b',
    textMuted: '#52525b',
    glassWhite: 'rgba(255, 255, 255, 0.7)',
    glassBorder: 'rgba(255, 255, 255, 0.6)',
    description: 'The standard Virtual Intelligent Junction corporate branding experience.',
  },
  {
    id: 'midnight-ai',
    name: 'Midnight AI',
    darkMode: true,
    primaryColor: '#3b82f6', // Bright blue
    accentColor: '#a855f7', // Purple
    bgGradient: 'linear-gradient(135deg, #0f172a, #020617)',
    textMain: '#f8fafc',
    textMuted: '#94a3b8',
    glassWhite: 'rgba(15, 23, 42, 0.55)',
    glassBorder: 'rgba(255, 255, 255, 0.08)',
    description: 'An advanced dark IDE workspace designed for focus and AI operations.',
  },
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    darkMode: false,
    primaryColor: '#1e40af', // Deep blue
    accentColor: '#0f172a', // Dark slate
    bgGradient: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
    textMain: '#0f172a',
    textMuted: '#475569',
    glassWhite: 'rgba(255, 255, 255, 0.8)',
    glassBorder: 'rgba(15, 23, 42, 0.08)',
    description: 'A formal corporate environment tailored for recruiters and analysts.',
  },
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    darkMode: true,
    primaryColor: '#00f5ff', // Neon cyan
    accentColor: '#ff007f', // Pink
    bgGradient: 'linear-gradient(135deg, #090514, #02010a)',
    textMain: '#00ffcc',
    textMuted: '#9d9da6',
    glassWhite: 'rgba(13, 10, 24, 0.65)',
    glassBorder: 'rgba(0, 245, 255, 0.15)',
    description: 'Vibrant neon outlines and dark contrast settings inspired by cyberpunk HUDs.',
  },
  {
    id: 'minimal-white',
    name: 'Minimal White',
    darkMode: false,
    primaryColor: '#18181b', // Ink black
    accentColor: '#71717a', // Cool gray
    bgGradient: 'linear-gradient(135deg, #ffffff, #fafafa)',
    textMain: '#18181b',
    textMuted: '#71717a',
    glassWhite: 'rgba(255, 255, 255, 0.9)',
    glassBorder: 'rgba(24, 24, 27, 0.05)',
    description: 'Clean aesthetics, solid lines, and flat borders with zero distractions.',
  },
  {
    id: 'glassmorphism-pro',
    name: 'Glassmorphism Pro',
    darkMode: false,
    primaryColor: '#ec4899', // Pink
    accentColor: '#8b5cf6', // Violet
    bgGradient: 'linear-gradient(135deg, #e0e7ff, #fae8ff)',
    textMain: '#1e1b4b',
    textMuted: '#4f46e5',
    glassWhite: 'rgba(255, 255, 255, 0.25)',
    glassBorder: 'rgba(255, 255, 255, 0.4)',
    description: 'Frosted overlays, deep backdrop blurs, and floating mesh shapes.',
  },
  {
    id: 'space-black',
    name: 'Space Black',
    darkMode: true,
    primaryColor: '#f43f5e', // Rose red
    accentColor: '#fbbf24', // Amber
    bgGradient: 'linear-gradient(135deg, #030712, #000000)',
    textMain: '#f3f4f6',
    textMuted: '#9ca3af',
    glassWhite: 'rgba(3, 7, 18, 0.65)',
    glassBorder: 'rgba(255, 255, 255, 0.05)',
    description: 'An ultra-dark pitch black canvas designed for OLED and contrast screens.',
  },
  {
    id: 'oceanic',
    name: 'Oceanic Deep',
    darkMode: true,
    primaryColor: '#0ea5e9', // Sky blue
    accentColor: '#10b981', // Emerald green
    bgGradient: 'linear-gradient(135deg, #0c4a6e, #082f49)',
    textMain: '#f0f9ff',
    textMuted: '#7dd3fc',
    glassWhite: 'rgba(12, 74, 110, 0.55)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
    description: 'Relaxing maritime colors, deep blues, and aquatic green highlights.',
  },
  {
    id: 'sunset-gradient',
    name: 'Sunset Glow',
    darkMode: false,
    primaryColor: '#ea580c', // Dark orange
    accentColor: '#db2777', // Deep pink
    bgGradient: 'linear-gradient(135deg, #fff7ed, #fdf2f8)',
    textMain: '#4c0519',
    textMuted: '#9d174d',
    glassWhite: 'rgba(255, 255, 255, 0.45)',
    glassBorder: 'rgba(255, 255, 255, 0.5)',
    description: 'Warm colors, orange hues, and gradients inspired by dusk skies.',
  },
  {
    id: 'hacker-terminal',
    name: 'Hacker Terminal',
    darkMode: true,
    primaryColor: '#22c55e', // Matrix green
    accentColor: '#16a34a', // Darker green
    bgGradient: 'linear-gradient(135deg, #022c22, #010604)',
    textMain: '#39ff14', // Neon lime
    textMuted: '#10b981',
    glassWhite: 'rgba(2, 44, 34, 0.7)',
    glassBorder: 'rgba(34, 197, 94, 0.15)',
    description: 'Monochrome console green styling with a retro terminal monospace interface.',
  }
];

export const PRESET_WALLPAPERS = [
  { id: 'space-stars', name: 'Cosmic Nebula', url: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=1200&q=80' },
  { id: 'office', name: 'Cozy Workspace', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80' },
  { id: 'minimal-dunes', name: 'Sahara Dunes', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5edd0cd9?auto=format&fit=crop&w=1200&q=80' },
  { id: 'cyberpunk', name: 'Neo Tokyo', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80' },
  { id: 'sunset', name: 'Summer Dusk', url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=1200&q=80' }
];

const defaultPreferences: UserThemePreferences = {
  selectedTheme: 'vij-classic',
  darkMode: false,
  primaryColor: '#dd3a22',
  accentColor: '#2563eb',
  backgroundImage: '',
  layoutMode: 'comfortable',
  animationEnabled: true,
  blurIntensity: 12,
  sidebarStyle: 'glass',
  fontPreference: 'Outfit',
};

const hexToRgba = (hex: string, alpha: number) => {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const loadGoogleFont = (fontName: string) => {
  if (fontName === 'Outfit') return;
  const fontId = `google-font-${fontName.toLowerCase().replace(/\s+/g, '-')}`;
  if (document.getElementById(fontId)) return;
  const link = document.createElement('link');
  link.id = fontId;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800;900&display=swap`;
  document.head.appendChild(link);
};

interface ThemeContextType {
  preferences: UserThemePreferences;
  updatePreferences: (partial: Partial<UserThemePreferences>) => void;
  applyPresetTheme: (themeId: string) => void;
  resetPreferences: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string>('guest');
  const [preferences, setPreferences] = useState<UserThemePreferences>(defaultPreferences);

  // 1. Detect current User ID to load corresponding settings
  useEffect(() => {
    const checkUser = () => {
      const savedUser = localStorage.getItem('vij_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed.id && parsed.id !== userId) {
            setUserId(parsed.id);
          }
        } catch (e) {
          console.error("ThemeContext: Error parsing user", e);
        }
      } else if (userId !== 'guest') {
        setUserId('guest');
      }
    };

    checkUser();
    // Set up a listener for storage or context changes
    const interval = setInterval(checkUser, 1000);
    return () => clearInterval(interval);
  }, [userId]);

  // 2. Load theme preferences when User ID resolves
  useEffect(() => {
    const storageKey = `vij_theme_prefs_${userId}`;
    const savedPrefs = localStorage.getItem(storageKey);
    if (savedPrefs) {
      try {
        setPreferences(JSON.parse(savedPrefs));
      } catch (e) {
        setPreferences(defaultPreferences);
      }
    } else {
      setPreferences(defaultPreferences);
    }
  }, [userId]);

  // 3. Inject styles into root when preferences update
  useEffect(() => {
    const root = document.documentElement;
    
    // Toggle dark mode class
    if (preferences.darkMode) {
      root.classList.add('dark');
      root.style.setProperty('--vij-bg', preferences.backgroundImage ? 'transparent' : '#09090b');
      root.style.setProperty('--vij-text-main', '#f8fafc');
      root.style.setProperty('--vij-text-muted', '#94a3b8');
      root.style.setProperty('--glass-white', 'rgba(15, 23, 42, 0.45)');
      root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.08)');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--vij-bg', preferences.backgroundImage ? 'transparent' : '#FAFAFC');
      root.style.setProperty('--vij-text-main', '#18181b');
      root.style.setProperty('--vij-text-muted', '#52525b');
      root.style.setProperty('--glass-white', 'rgba(255, 255, 255, 0.65)');
      root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.5)');
    }

    // Set colors
    root.style.setProperty('--accent-azure', preferences.primaryColor);
    root.style.setProperty('--accent-azure-glow', hexToRgba(preferences.primaryColor, 0.15));
    root.style.setProperty('--accent-emerald', preferences.accentColor);
    root.style.setProperty('--accent-emerald-glow', hexToRgba(preferences.accentColor, 0.15));

    // Set Font Family
    loadGoogleFont(preferences.fontPreference);
    root.style.setProperty('--font-family', `'${preferences.fontPreference}', 'Outfit', sans-serif`);

    // Set Layout Classes
    root.classList.remove('layout-comfortable', 'layout-compact', 'layout-minimal');
    root.classList.add(`layout-${preferences.layoutMode}`);

    // Set Animation Classes
    if (preferences.animationEnabled) {
      root.classList.remove('animations-disabled');
    } else {
      root.classList.add('animations-disabled');
    }

  }, [preferences]);

  const updatePreferences = (partial: Partial<UserThemePreferences>) => {
    setPreferences(prev => {
      const merged = { ...prev, ...partial };
      // Save to localStorage immediately
      localStorage.setItem(`vij_theme_prefs_${userId}`, JSON.stringify(merged));
      // Save to guest as fallback too
      localStorage.setItem(`vij_theme_prefs_guest`, JSON.stringify(merged));
      return merged;
    });
  };

  const applyPresetTheme = (themeId: string) => {
    const preset = THEME_PRESETS.find(p => p.id === themeId);
    if (!preset) return;

    updatePreferences({
      selectedTheme: themeId,
      darkMode: preset.darkMode,
      primaryColor: preset.primaryColor,
      accentColor: preset.accentColor,
      backgroundImage: preset.bgImagePresetUrl || '',
    });
  };

  const resetPreferences = () => {
    updatePreferences(defaultPreferences);
  };

  return (
    <ThemeContext.Provider value={{ preferences, updatePreferences, applyPresetTheme, resetPreferences }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
