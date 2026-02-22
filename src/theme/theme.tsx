export const Colors = {
    // Primary Brand
    bluePrimary: '#1565C0',
    blueDark: '#0D3E82',
    blueDeep: '#0A2A5C',
    blueMid: '#1976D2',
    blueLight: '#2196F3',
    bluePale: '#E3F0FF',
    blueAccent: '#42A5F5',

    // Orange Brand
    orange: '#F57C00',
    orangeLight: '#FF9800',
    orangeGlow: '#FFB74D',
    orangePale: '#FFF3E0',

    // Neutrals
    white: '#FFFFFF',
    offWhite: '#F8FAFF',
    surface: '#F1F5FF',
    border: '#DDEAFF',
    grayLight: '#E2E8F0',
    gray: '#64748B',
    grayDark: '#334155',
    dark: '#0A1628',
    darkCard: '#0F1E35',
    darkSurface: '#132040',

    // Status
    success: '#16A34A',
    warning: '#D97706',
    error: '#DC2626',
    verified: '#0EA5E9',

    // Gradients (used as arrays for LinearGradient)
    gradientBlue: ['#0D3E82', '#1565C0', '#1976D2'],
    gradientOrange: ['#E65100', '#F57C00', '#FF9800'],
    gradientCard: ['#0F1E35', '#132040'],
    gradientHero: ['#0A2A5C', '#1565C0', '#1976D2'],
};

export const Typography = {
    // Font sizes
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    xxl: 30,
    xxxl: 38,
    hero: 46,

    // Font weights (as string for React Native)
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
};

export const Radius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    full: 999,
};

export const Shadow = {
    card: {
        shadowColor: '#1565C0',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    orange: {
        shadowColor: '#F57C00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    dark: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 12,
    },
};
