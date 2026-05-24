(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/context/ThemeContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PRESET_WALLPAPERS",
    ()=>PRESET_WALLPAPERS,
    "THEME_PRESETS",
    ()=>THEME_PRESETS,
    "ThemeProvider",
    ()=>ThemeProvider,
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const THEME_PRESETS = [
    {
        id: 'vij-classic',
        name: 'VIJ Classic',
        darkMode: false,
        primaryColor: '#dd3a22',
        accentColor: '#2563eb',
        bgGradient: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
        textMain: '#18181b',
        textMuted: '#52525b',
        glassWhite: 'rgba(255, 255, 255, 0.7)',
        glassBorder: 'rgba(255, 255, 255, 0.6)',
        description: 'The standard Virtual Intelligent Junction corporate branding experience.'
    },
    {
        id: 'midnight-ai',
        name: 'Midnight AI',
        darkMode: true,
        primaryColor: '#3b82f6',
        accentColor: '#a855f7',
        bgGradient: 'linear-gradient(135deg, #0f172a, #020617)',
        textMain: '#f8fafc',
        textMuted: '#94a3b8',
        glassWhite: 'rgba(15, 23, 42, 0.55)',
        glassBorder: 'rgba(255, 255, 255, 0.08)',
        description: 'An advanced dark IDE workspace designed for focus and AI operations.'
    },
    {
        id: 'corporate-blue',
        name: 'Corporate Blue',
        darkMode: false,
        primaryColor: '#1e40af',
        accentColor: '#0f172a',
        bgGradient: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
        textMain: '#0f172a',
        textMuted: '#475569',
        glassWhite: 'rgba(255, 255, 255, 0.8)',
        glassBorder: 'rgba(15, 23, 42, 0.08)',
        description: 'A formal corporate environment tailored for recruiters and analysts.'
    },
    {
        id: 'cyber-neon',
        name: 'Cyber Neon',
        darkMode: true,
        primaryColor: '#00f5ff',
        accentColor: '#ff007f',
        bgGradient: 'linear-gradient(135deg, #090514, #02010a)',
        textMain: '#00ffcc',
        textMuted: '#9d9da6',
        glassWhite: 'rgba(13, 10, 24, 0.65)',
        glassBorder: 'rgba(0, 245, 255, 0.15)',
        description: 'Vibrant neon outlines and dark contrast settings inspired by cyberpunk HUDs.'
    },
    {
        id: 'minimal-white',
        name: 'Minimal White',
        darkMode: false,
        primaryColor: '#18181b',
        accentColor: '#71717a',
        bgGradient: 'linear-gradient(135deg, #ffffff, #fafafa)',
        textMain: '#18181b',
        textMuted: '#71717a',
        glassWhite: 'rgba(255, 255, 255, 0.9)',
        glassBorder: 'rgba(24, 24, 27, 0.05)',
        description: 'Clean aesthetics, solid lines, and flat borders with zero distractions.'
    },
    {
        id: 'glassmorphism-pro',
        name: 'Glassmorphism Pro',
        darkMode: false,
        primaryColor: '#ec4899',
        accentColor: '#8b5cf6',
        bgGradient: 'linear-gradient(135deg, #e0e7ff, #fae8ff)',
        textMain: '#1e1b4b',
        textMuted: '#4f46e5',
        glassWhite: 'rgba(255, 255, 255, 0.25)',
        glassBorder: 'rgba(255, 255, 255, 0.4)',
        description: 'Frosted overlays, deep backdrop blurs, and floating mesh shapes.'
    },
    {
        id: 'space-black',
        name: 'Space Black',
        darkMode: true,
        primaryColor: '#f43f5e',
        accentColor: '#fbbf24',
        bgGradient: 'linear-gradient(135deg, #030712, #000000)',
        textMain: '#f3f4f6',
        textMuted: '#9ca3af',
        glassWhite: 'rgba(3, 7, 18, 0.65)',
        glassBorder: 'rgba(255, 255, 255, 0.05)',
        description: 'An ultra-dark pitch black canvas designed for OLED and contrast screens.'
    },
    {
        id: 'oceanic',
        name: 'Oceanic Deep',
        darkMode: true,
        primaryColor: '#0ea5e9',
        accentColor: '#10b981',
        bgGradient: 'linear-gradient(135deg, #0c4a6e, #082f49)',
        textMain: '#f0f9ff',
        textMuted: '#7dd3fc',
        glassWhite: 'rgba(12, 74, 110, 0.55)',
        glassBorder: 'rgba(255, 255, 255, 0.1)',
        description: 'Relaxing maritime colors, deep blues, and aquatic green highlights.'
    },
    {
        id: 'sunset-gradient',
        name: 'Sunset Glow',
        darkMode: false,
        primaryColor: '#ea580c',
        accentColor: '#db2777',
        bgGradient: 'linear-gradient(135deg, #fff7ed, #fdf2f8)',
        textMain: '#4c0519',
        textMuted: '#9d174d',
        glassWhite: 'rgba(255, 255, 255, 0.45)',
        glassBorder: 'rgba(255, 255, 255, 0.5)',
        description: 'Warm colors, orange hues, and gradients inspired by dusk skies.'
    },
    {
        id: 'hacker-terminal',
        name: 'Hacker Terminal',
        darkMode: true,
        primaryColor: '#22c55e',
        accentColor: '#16a34a',
        bgGradient: 'linear-gradient(135deg, #022c22, #010604)',
        textMain: '#39ff14',
        textMuted: '#10b981',
        glassWhite: 'rgba(2, 44, 34, 0.7)',
        glassBorder: 'rgba(34, 197, 94, 0.15)',
        description: 'Monochrome console green styling with a retro terminal monospace interface.'
    }
];
const PRESET_WALLPAPERS = [
    {
        id: 'space-stars',
        name: 'Cosmic Nebula',
        url: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=1200&q=80'
    },
    {
        id: 'office',
        name: 'Cozy Workspace',
        url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'
    },
    {
        id: 'minimal-dunes',
        name: 'Sahara Dunes',
        url: 'https://images.unsplash.com/photo-1509316975850-ff9c5edd0cd9?auto=format&fit=crop&w=1200&q=80'
    },
    {
        id: 'cyberpunk',
        name: 'Neo Tokyo',
        url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80'
    },
    {
        id: 'sunset',
        name: 'Summer Dusk',
        url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=1200&q=80'
    }
];
const defaultPreferences = {
    selectedTheme: 'vij-classic',
    darkMode: false,
    primaryColor: '#dd3a22',
    accentColor: '#2563eb',
    backgroundImage: '',
    layoutMode: 'comfortable',
    animationEnabled: true,
    blurIntensity: 12,
    sidebarStyle: 'glass',
    fontPreference: 'Outfit'
};
const hexToRgba = (hex, alpha)=>{
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    return "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(alpha, ")");
};
const loadGoogleFont = (fontName)=>{
    if (fontName === 'Outfit') return;
    const fontId = "google-font-".concat(fontName.toLowerCase().replace(/\s+/g, '-'));
    if (document.getElementById(fontId)) return;
    const link = document.createElement('link');
    link.id = fontId;
    link.rel = 'stylesheet';
    link.href = "https://fonts.googleapis.com/css2?family=".concat(fontName.replace(/\s+/g, '+'), ":wght@300;400;500;600;700;800;900&display=swap");
    document.head.appendChild(link);
};
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const ThemeProvider = (param)=>{
    let { children } = param;
    _s();
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('guest');
    const [preferences, setPreferences] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultPreferences);
    // 1. Detect current User ID to load corresponding settings
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            const checkUser = {
                "ThemeProvider.useEffect.checkUser": ()=>{
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
                }
            }["ThemeProvider.useEffect.checkUser"];
            checkUser();
            // Set up a listener for storage or context changes
            const interval = setInterval(checkUser, 1000);
            return ({
                "ThemeProvider.useEffect": ()=>clearInterval(interval)
            })["ThemeProvider.useEffect"];
        }
    }["ThemeProvider.useEffect"], [
        userId
    ]);
    // 2. Load theme preferences when User ID resolves
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            const storageKey = "vij_theme_prefs_".concat(userId);
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
        }
    }["ThemeProvider.useEffect"], [
        userId
    ]);
    // 3. Inject styles into root when preferences update
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
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
            root.style.setProperty('--font-family', "'".concat(preferences.fontPreference, "', 'Outfit', sans-serif"));
            // Set Layout Classes
            root.classList.remove('layout-comfortable', 'layout-compact', 'layout-minimal');
            root.classList.add("layout-".concat(preferences.layoutMode));
            // Set Animation Classes
            if (preferences.animationEnabled) {
                root.classList.remove('animations-disabled');
            } else {
                root.classList.add('animations-disabled');
            }
        }
    }["ThemeProvider.useEffect"], [
        preferences
    ]);
    const updatePreferences = (partial)=>{
        setPreferences((prev)=>{
            const merged = {
                ...prev,
                ...partial
            };
            // Save to localStorage immediately
            localStorage.setItem("vij_theme_prefs_".concat(userId), JSON.stringify(merged));
            // Save to guest as fallback too
            localStorage.setItem("vij_theme_prefs_guest", JSON.stringify(merged));
            return merged;
        });
    };
    const applyPresetTheme = (themeId)=>{
        const preset = THEME_PRESETS.find((p)=>p.id === themeId);
        if (!preset) return;
        updatePreferences({
            selectedTheme: themeId,
            darkMode: preset.darkMode,
            primaryColor: preset.primaryColor,
            accentColor: preset.accentColor,
            backgroundImage: preset.bgImagePresetUrl || ''
        });
    };
    const resetPreferences = ()=>{
        updatePreferences(defaultPreferences);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: {
            preferences,
            updatePreferences,
            applyPresetTheme,
            resetPreferences
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/ThemeContext.tsx",
        lineNumber: 330,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ThemeProvider, "cb8M1/4UGH9J5wvECE6ymT9vxeE=");
_c = ThemeProvider;
const useTheme = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
_s1(useTheme, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/context/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/* eslint-disable react-refresh/only-export-components */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const createUserId = ()=>{
    var _globalThis_crypto;
    const buffer = new Uint32Array(1);
    (_globalThis_crypto = globalThis.crypto) === null || _globalThis_crypto === void 0 ? void 0 : _globalThis_crypto.getRandomValues(buffer);
    const suffix = buffer[0] % 9000 + 1000;
    return "USR-".concat(suffix);
};
const AuthProvider = (param)=>{
    let { children } = param;
    _s();
    // For demo purposes, we'll initialize from localStorage to persist across refreshes
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [walletBalance, setWalletBalance] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(450);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "AuthProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                const savedAuth = localStorage.getItem('vij_auth') === 'true';
                const savedUser = localStorage.getItem('vij_user');
                const savedWallet = Number(localStorage.getItem('vij_wallet')) || 450;
                setIsAuthenticated(savedAuth);
                if (savedUser) {
                    try {
                        setUser(JSON.parse(savedUser));
                    } catch (e) {
                        console.error("Error parsing user from localStorage", e);
                    }
                }
                setWalletBalance(savedWallet);
            }
        }
    }["AuthProvider.useEffect"], []);
    const login = (role, domain)=>{
        setIsAuthenticated(true);
        const mockUser = {
            id: createUserId(),
            name: 'Verified User',
            role,
            domain: domain || 'engineering',
            onboardingCompleted: false,
            appliedJobs: []
        };
        setUser(mockUser);
        localStorage.setItem('vij_auth', 'true');
        localStorage.setItem('vij_user', JSON.stringify(mockUser));
    };
    const addFunds = (amount)=>{
        const newBalance = walletBalance + amount;
        setWalletBalance(newBalance);
        localStorage.setItem('vij_wallet', newBalance.toString());
    };
    const completeOnboarding = ()=>{
        if (user) {
            const updatedUser = {
                ...user,
                onboardingCompleted: true
            };
            setUser(updatedUser);
            localStorage.setItem('vij_user', JSON.stringify(updatedUser));
        }
    };
    const purchaseItem = (id)=>{
        if (user) {
            const currentPurchased = user.purchasedItems || [];
            if (!currentPurchased.includes(id)) {
                const updatedUser = {
                    ...user,
                    purchasedItems: [
                        ...currentPurchased,
                        id
                    ]
                };
                setUser(updatedUser);
                localStorage.setItem('vij_user', JSON.stringify(updatedUser));
            }
        }
    };
    const applyToJob = (jobId)=>{
        if (user) {
            const currentApplied = user.appliedJobs || [];
            if (!currentApplied.includes(jobId)) {
                const updatedUser = {
                    ...user,
                    appliedJobs: [
                        ...currentApplied,
                        jobId
                    ]
                };
                setUser(updatedUser);
                localStorage.setItem('vij_user', JSON.stringify(updatedUser));
            }
        }
    };
    const hasApplied = (jobId)=>{
        var _user_appliedJobs;
        var _user_appliedJobs_includes;
        return (_user_appliedJobs_includes = user === null || user === void 0 ? void 0 : (_user_appliedJobs = user.appliedJobs) === null || _user_appliedJobs === void 0 ? void 0 : _user_appliedJobs.includes(jobId)) !== null && _user_appliedJobs_includes !== void 0 ? _user_appliedJobs_includes : false;
    };
    const updateProfile = (data)=>{
        if (user) {
            const updatedUser = {
                ...user,
                ...data
            };
            setUser(updatedUser);
            localStorage.setItem('vij_user', JSON.stringify(updatedUser));
        }
    };
    const logout = ()=>{
        setIsAuthenticated(false);
        setUser(null);
        localStorage.setItem('vij_auth', 'false');
        localStorage.removeItem('vij_user');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            isAuthenticated,
            user,
            walletBalance,
            login,
            logout,
            completeOnboarding,
            purchaseItem,
            addFunds,
            applyToJob,
            hasApplied,
            updateProfile
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/AuthContext.tsx",
        lineNumber: 162,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AuthProvider, "a+oRQ1gbYGqQJ0laB7WFXvSXCVM=");
_c = AuthProvider;
const useAuth = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/context/CurrencyContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CurrencyProvider",
    ()=>CurrencyProvider,
    "RATES",
    ()=>RATES,
    "useCurrency",
    ()=>useCurrency
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AuthContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
const CurrencyContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const RATES = {
    USD: 1,
    INR: 83.5,
    EUR: 0.92,
    GBP: 0.79
};
const LOCALES = {
    USD: 'en-US',
    INR: 'en-IN',
    EUR: 'de-DE',
    GBP: 'en-GB'
};
const getInitialCurrency = ()=>{
    const isRegistered = typeof localStorage !== 'undefined' && localStorage.getItem('vij_auth') === 'true';
    if (!isRegistered) {
        return 'INR';
    }
    if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('vij-currency-pref');
        if (saved && Object.keys(RATES).includes(saved)) {
            return saved;
        }
    }
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.includes('Calcutta') || tz.includes('Kolkata')) return 'INR';
    if (tz.includes('Europe/London')) return 'GBP';
    if (tz.includes('Europe')) return 'EUR';
    return 'USD';
};
const CurrencyProvider = (param)=>{
    let { children } = param;
    _s();
    const { isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [currency, setCurrencyState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(getInitialCurrency);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "CurrencyProvider.useEffect": ()=>{
            if (!isAuthenticated) {
                setCurrencyState('INR');
                return;
            }
            if (typeof localStorage !== 'undefined') {
                const saved = localStorage.getItem('vij-currency-pref');
                if (saved && Object.keys(RATES).includes(saved)) {
                    setCurrencyState(saved);
                    return;
                }
            }
            fetch('https://ipapi.co/json/').then({
                "CurrencyProvider.useEffect": (res)=>{
                    if (!res.ok) throw new Error('IP geolocation error');
                    return res.json();
                }
            }["CurrencyProvider.useEffect"]).then({
                "CurrencyProvider.useEffect": (data)=>{
                    if (data && data.currency) {
                        const code = data.currency.toUpperCase();
                        if ([
                            'USD',
                            'INR',
                            'EUR',
                            'GBP'
                        ].includes(code)) {
                            setCurrencyState(code);
                        }
                    }
                }
            }["CurrencyProvider.useEffect"]).catch({
                "CurrencyProvider.useEffect": (err)=>{
                    console.warn('IP currency detection failed, using timezone default:', err);
                    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                    if (tz.includes('Calcutta') || tz.includes('Kolkata')) {
                        setCurrencyState('INR');
                    } else if (tz.includes('Europe/London')) {
                        setCurrencyState('GBP');
                    } else if (tz.includes('Europe')) {
                        setCurrencyState('EUR');
                    } else {
                        setCurrencyState('USD');
                    }
                }
            }["CurrencyProvider.useEffect"]);
        }
    }["CurrencyProvider.useEffect"], [
        isAuthenticated
    ]);
    const setCurrency = (code)=>{
        setCurrencyState(code);
        localStorage.setItem('vij-currency-pref', code);
    };
    const formatCurrency = function(amountInUSD) {
        let isCompact = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
        const rate = RATES[currency];
        const converted = amountInUSD * rate;
        // Use Intl.NumberFormat for proper local formatting
        const formatter = new Intl.NumberFormat(LOCALES[currency], {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: isCompact ? 0 : 2,
            notation: isCompact ? 'compact' : 'standard'
        });
        return formatter.format(converted);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CurrencyContext.Provider, {
        value: {
            currency,
            setCurrency,
            formatCurrency
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/CurrencyContext.tsx",
        lineNumber: 116,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(CurrencyProvider, "9HLraptgirYMXA0ZXCIuHYZZqmg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = CurrencyProvider;
const useCurrency = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
_s1(useCurrency, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "CurrencyProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/context/RoadmapContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RoadmapProvider",
    ()=>RoadmapProvider,
    "useRoadmaps",
    ()=>useRoadmaps
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/* eslint-disable react-refresh/only-export-components */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const RoadmapContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const RoadmapProvider = (param)=>{
    let { children } = param;
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        activePathId: null,
        completedNodes: [],
        savedPaths: [],
        likedPaths: [],
        profileAnswers: null
    });
    const [isLoaded, setIsLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RoadmapProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                const saved = localStorage.getItem('vij_roadmap_state');
                if (saved) {
                    try {
                        setState(JSON.parse(saved));
                    } catch (e) {
                        console.error("Error loading roadmap state", e);
                    }
                }
                setIsLoaded(true);
            }
        }
    }["RoadmapProvider.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RoadmapProvider.useEffect": ()=>{
            if (isLoaded && "object" !== 'undefined') {
                localStorage.setItem('vij_roadmap_state', JSON.stringify(state));
            }
        }
    }["RoadmapProvider.useEffect"], [
        state,
        isLoaded
    ]);
    const startRoute = (id)=>{
        setState((prev)=>({
                ...prev,
                activePathId: id
            }));
    };
    const completeNode = (nodeId)=>{
        setState((prev)=>({
                ...prev,
                completedNodes: prev.completedNodes.includes(nodeId) ? prev.completedNodes.filter((id)=>id !== nodeId) : [
                    ...prev.completedNodes,
                    nodeId
                ]
            }));
    };
    const toggleSave = (id)=>{
        setState((prev)=>({
                ...prev,
                savedPaths: prev.savedPaths.includes(id) ? prev.savedPaths.filter((pid)=>pid !== id) : [
                    ...prev.savedPaths,
                    id
                ]
            }));
    };
    const toggleLike = (id)=>{
        setState((prev)=>({
                ...prev,
                likedPaths: prev.likedPaths.includes(id) ? prev.likedPaths.filter((pid)=>pid !== id) : [
                    ...prev.likedPaths,
                    id
                ]
            }));
    };
    const saveProfileAnswers = (answers)=>{
        setState((prev)=>({
                ...prev,
                profileAnswers: answers
            }));
    };
    const isNodeCompleted = (nodeId)=>state.completedNodes.includes(nodeId);
    const isPathSaved = (id)=>state.savedPaths.includes(id);
    const isPathLiked = (id)=>state.likedPaths.includes(id);
    const hasProfile = state.profileAnswers !== null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RoadmapContext.Provider, {
        value: {
            state,
            startRoute,
            completeNode,
            toggleSave,
            toggleLike,
            isNodeCompleted,
            isPathSaved,
            isPathLiked,
            saveProfileAnswers,
            hasProfile
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/RoadmapContext.tsx",
        lineNumber: 106,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(RoadmapProvider, "3M0kTxqrCLADLuO/wdIo1se3pys=");
_c = RoadmapProvider;
const useRoadmaps = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(RoadmapContext);
    if (!context) throw new Error('useRoadmaps must be used within a RoadmapProvider');
    return context;
};
_s1(useRoadmaps, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "RoadmapProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_context_677f118d._.js.map