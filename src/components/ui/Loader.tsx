import { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, StyleSheet, Modal, ViewStyle } from 'react-native';
import { Colors, FontSize, BorderRadius, Spacing } from '../../theme/colors';

// ─── Types ────────────────────────────────────────────────────────────────────

type LoaderVariant =
    | 'spinner' // Rotating arc — general purpose
    | 'dots' // Three bouncing dots — inline / list
    | 'pulse' // Expanding ring — location / radar
    | 'wave' // Wave bars — audio / processing
    | 'overlay' // Fullscreen dark modal block
    | 'skeleton' // Shimmer placeholder — content loading
    | 'button'; // Tiny inline spinner — inside buttons

type LoaderSize = 'sm' | 'md' | 'lg';

interface LoaderProps {
    variant?: LoaderVariant;
    size?: LoaderSize;
    text?: string;
    /** For overlay variant — controls visibility */
    visible?: boolean;
    /** Override container style */
    style?: ViewStyle;
    /** Show/hide the loading text */
    showText?: boolean;
}

// ─── Size map ─────────────────────────────────────────────────────────────────

const SIZE = {
    sm: { spinner: 20, dot: 7, bar: 4, gap: 6, font: FontSize.xs },
    md: { spinner: 36, dot: 10, bar: 5, gap: 8, font: FontSize.sm },
    lg: { spinner: 52, dot: 13, bar: 7, gap: 11, font: FontSize.md },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

// ── Spinner ───────────────────────────────────────────────────────────────────
const Spinner = ({ size = 'md' }: { size?: LoaderSize }) => {
    const rot = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(rot, {
                toValue: 1,
                duration: 900,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ).start();
    }, []);

    const rotate = rot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
    const d = SIZE[size].spinner;

    return (
        <Animated.View
            style={[
                spinner.ring,
                { width: d, height: d, borderRadius: d / 2, transform: [{ rotate }] },
            ]}
        />
    );
};

const spinner = StyleSheet.create({
    ring: {
        borderWidth: 3,
        borderColor: Colors.border,
        borderTopColor: Colors.primary,
    },
});

// ── Dots ──────────────────────────────────────────────────────────────────────
const Dots = ({ size = 'md' }: { size?: LoaderSize }) => {
    const anims = [
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
    ];

    useEffect(() => {
        const dotColors = [Colors.primary, Colors.primaryLight, Colors.accent];
        anims.forEach((anim, i) => {
            Animated.loop(
                Animated.sequence([
                    Animated.delay(i * 150),
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 380,
                        easing: Easing.out(Easing.quad),
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim, {
                        toValue: 0,
                        duration: 380,
                        easing: Easing.in(Easing.quad),
                        useNativeDriver: true,
                    }),
                    Animated.delay(300),
                ]),
            ).start();
        });
    }, []);

    const d = SIZE[size].dot;
    const dotColorList = [Colors.primary, Colors.primaryLight, Colors.accent];

    return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: SIZE[size].gap }}>
            {anims.map((anim, i) => (
                <Animated.View
                    key={i}
                    style={{
                        width: d,
                        height: d,
                        borderRadius: d / 2,
                        backgroundColor: dotColorList[i],
                        transform: [
                            {
                                translateY: anim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, -(d * 1.3)],
                                }),
                            },
                        ],
                    }}
                />
            ))}
        </View>
    );
};

// ── Pulse ─────────────────────────────────────────────────────────────────────
const Pulse = ({ size = 'md' }: { size?: LoaderSize }) => {
    const ring1 = useRef(new Animated.Value(0)).current;
    const ring2 = useRef(new Animated.Value(0)).current;

    const animateRing = (anim: Animated.Value, delay: number) => {
        Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.parallel([
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 1400,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true,
                    }),
                ]),
            ]),
        ).start();
    };

    useEffect(() => {
        animateRing(ring1, 0);
        animateRing(ring2, 600);
    }, []);

    const d = SIZE[size].spinner;
    const dotD = d * 0.36;
    const containerD = d * 1.7;

    return (
        <View
            style={{
                width: containerD,
                height: containerD,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {[ring1, ring2].map((anim, i) => (
                <Animated.View
                    key={i}
                    style={{
                        position: 'absolute',
                        width: containerD,
                        height: containerD,
                        borderRadius: containerD / 2,
                        borderWidth: 2,
                        borderColor: Colors.primary,
                        opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0] }),
                        transform: [
                            {
                                scale: anim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.3, 1],
                                }),
                            },
                        ],
                    }}
                />
            ))}
            <View
                style={{
                    width: dotD,
                    height: dotD,
                    borderRadius: dotD / 2,
                    backgroundColor: Colors.primary,
                }}
            />
        </View>
    );
};

// ── Wave ──────────────────────────────────────────────────────────────────────
const Wave = ({ size = 'md' }: { size?: LoaderSize }) => {
    const bars = Array.from({ length: 6 }, () => useRef(new Animated.Value(0.3)).current);
    const barColors = [
        Colors.primary,
        Colors.primaryLight,
        Colors.primary,
        Colors.primaryLight,
        Colors.primary,
        Colors.accent,
    ];

    useEffect(() => {
        bars.forEach((anim, i) => {
            Animated.loop(
                Animated.sequence([
                    Animated.delay(i * 100),
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim, {
                        toValue: 0.3,
                        duration: 500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ]),
            ).start();
        });
    }, []);

    const barW = SIZE[size].bar;
    const barH = SIZE[size].spinner;

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                gap: SIZE[size].gap - 2,
                height: barH,
            }}
        >
            {bars.map((anim, i) => (
                <Animated.View
                    key={i}
                    style={{
                        width: barW,
                        height: barH,
                        borderRadius: barW,
                        backgroundColor: barColors[i],
                        transform: [{ scaleY: anim }],
                        transformOrigin: 'bottom',
                    }}
                />
            ))}
        </View>
    );
};

// ── Button Spinner (tiny, no text) ────────────────────────────────────────────
const ButtonSpinner = () => {
    const rot = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(rot, {
                toValue: 1,
                duration: 700,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ).start();
    }, []);

    const rotate = rot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

    return (
        <Animated.View
            style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: 'rgba(255,255,255,0.3)',
                borderTopColor: Colors.white,
                transform: [{ rotate }],
            }}
        />
    );
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
const Skeleton = ({ size = 'md' }: { size?: LoaderSize }) => {
    const shimmer = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmer, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(shimmer, {
                    toValue: 0,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ]),
        ).start();
    }, []);

    const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

    const skelBlock = (w: number | `${number}%`, h: number, radius = 6) => (
        <Animated.View
            style={{
                width: w,
                height: h,
                borderRadius: radius,
                backgroundColor: Colors.border,
                opacity,
            }}
        />
    );

    const avatarSize = size === 'sm' ? 32 : size === 'lg' ? 52 : 42;

    return (
        <View style={{ width: '100%', gap: 12 }}>
            {/* Avatar + name row */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                {skelBlock(avatarSize, avatarSize, avatarSize / 2)}
                <View style={{ flex: 1, gap: 8 }}>
                    {skelBlock('70%', 12)}
                    {skelBlock('45%', 10)}
                </View>
            </View>
            {/* Body lines */}
            {skelBlock('100%', 10)}
            {skelBlock('88%', 10)}
            {skelBlock('60%', 10)}
        </View>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Loader
// ─────────────────────────────────────────────────────────────────────────────

export const Loader = ({
    variant = 'spinner',
    size = 'md',
    text,
    visible = true,
    style,
    showText = true,
}: LoaderProps) => {
    const loadingText = text ?? 'Loading';

    // ── Overlay variant — modal fullscreen block ───────────────────────────────
    if (variant === 'overlay') {
        return (
            <Modal transparent animationType="fade" visible={visible} statusBarTranslucent>
                <View style={styles.overlayBackdrop}>
                    <View style={styles.overlayCard}>
                        <Spinner size={size} />
                        {showText && <Text style={styles.overlayText}>{loadingText}</Text>}
                    </View>
                </View>
            </Modal>
        );
    }

    // ── Button variant — no wrapper card, just the tiny spinner ───────────────
    if (variant === 'button') {
        return <ButtonSpinner />;
    }

    // ── Skeleton — wider container, no text ───────────────────────────────────
    if (variant === 'skeleton') {
        return (
            <View style={[styles.skeletonWrap, style]}>
                <Skeleton size={size} />
            </View>
        );
    }

    // ── All other inline variants ─────────────────────────────────────────────
    const renderIndicator = () => {
        switch (variant) {
            case 'dots':
                return <Dots size={size} />;
            case 'pulse':
                return <Pulse size={size} />;
            case 'wave':
                return <Wave size={size} />;
            default:
                return <Spinner size={size} />;
        }
    };

    return (
        <View style={[styles.container, style]}>
            {renderIndicator()}
            {showText && (
                <Text style={[styles.label, { fontSize: SIZE[size].font }]}>{loadingText}</Text>
            )}
        </View>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        padding: Spacing.md,
    },
    label: {
        color: Colors.textSecondary,
        fontWeight: '500',
        letterSpacing: 0.2,
    },

    // ── Overlay ───────────────────────────────────────────────────────────────
    overlayBackdrop: {
        flex: 1,
        backgroundColor: Colors.overlay, // rgba(13,27,62,0.6)
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlayCard: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        paddingVertical: Spacing.xl,
        paddingHorizontal: Spacing.xxl,
        alignItems: 'center',
        gap: Spacing.md,
        // Card shadow
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 24,
        elevation: 12,
    },
    overlayText: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        fontWeight: '500',
    },

    // ── Skeleton ──────────────────────────────────────────────────────────────
    skeletonWrap: {
        width: '100%',
        padding: Spacing.md,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
    },
});
