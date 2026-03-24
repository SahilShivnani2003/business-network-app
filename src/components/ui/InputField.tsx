import { useState, useRef, useEffect } from 'react';
import { Animated, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, FontSize, BorderRadius, Shadow, Spacing } from '../../theme/colors';

interface InputFieldProps {
    label: string;
    value: string;
    onChangeText: (t: string) => void;
    placeholder?: string;
    icon?: string;
    trailingIcon?: string;
    onTrailingPress?: () => void;
    secureTextEntry?: boolean;
    keyboardType?: any;
    autoCapitalize?: any;
    maxLength?: number;
    prefix?: string;
    required?: boolean;
    error?: string;
    touched?: boolean;
    hint?: string;
}

export const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    icon,
    trailingIcon,
    onTrailingPress,
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitalize = 'none',
    maxLength,
    prefix,
    required,
    error,
    touched,
    hint,
}: InputFieldProps) => {
    const [focused, setFocused] = useState(false);
    const borderAnim = useRef(new Animated.Value(0)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;

    const showError = touched && !!error;

    // ── Animated border on focus / blur ───────────────────────────────────────
    const onFocus = () => {
        setFocused(true);
        Animated.spring(borderAnim, { toValue: 1, useNativeDriver: false, speed: 28, bounciness: 4 }).start();
    };
    const onBlur = () => {
        setFocused(false);
        Animated.spring(borderAnim, { toValue: 0, useNativeDriver: false, speed: 28, bounciness: 4 }).start();
    };

    const animatedBorderColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [
            showError ? Colors.error : Colors.border,
            showError ? Colors.error : Colors.primary,
        ],
    });

    // ── Shake on error ────────────────────────────────────────────────────────
    useEffect(() => {
        if (showError) {
            Animated.sequence([
                Animated.timing(shakeAnim, { toValue: 7,  duration: 55, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: -7, duration: 55, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 5,  duration: 55, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: -5, duration: 55, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 0,  duration: 55, useNativeDriver: true }),
            ]).start();
        }
    }, [showError, error]);

    const iconColor = focused
        ? Colors.primary
        : showError
        ? Colors.error
        : Colors.textMuted;

    return (
        <Animated.View style={[styles.wrap, { transform: [{ translateX: shakeAnim }] }]}>

            {/* ── Label ── */}
            <Text style={[styles.label, showError && styles.labelError]}>
                {label.toUpperCase()}
                {required && <Text style={styles.requiredStar}> *</Text>}
            </Text>

            {/* ── Input row ── */}
            <Animated.View
                style={[
                    styles.row,
                    { borderColor: animatedBorderColor },
                    showError && styles.rowError,
                ]}
            >
                {/* Leading icon */}
                {icon && (
                    <Ionicons
                        name={icon as any}
                        size={18}
                        color={iconColor}
                        style={styles.leadingIcon}
                    />
                )}

                {/* Prefix  e.g. "+91" */}
                {prefix && (
                    <>
                        <Text style={styles.prefix}>{prefix}</Text>
                        <View style={styles.prefixDivider} />
                    </>
                )}

                {/* Text input */}
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.textMuted}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={false}
                    maxLength={maxLength}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />

                {/* Trailing icon — e.g. eye toggle */}
                {trailingIcon ? (
                    <TouchableOpacity onPress={onTrailingPress} style={styles.trailingBtn}>
                        <Ionicons name={trailingIcon as any} size={18} color={Colors.textMuted} />
                    </TouchableOpacity>
                ) : (
                    touched &&
                    value.length > 0 && (
                        <Ionicons
                            name={showError ? 'close-circle' : 'checkmark-circle'}
                            size={18}
                            color={showError ? Colors.error : Colors.success}
                            style={styles.statusIcon}
                        />
                    )
                )}
            </Animated.View>

            {/* ── Error message ── */}
            {showError && (
                <View style={styles.feedbackRow}>
                    <Ionicons name="alert-circle" size={12} color={Colors.error} />
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            {/* ── Hint (only when no error) ── */}
            {hint && !showError && (
                <View style={styles.feedbackRow}>
                    <Ionicons name="information-circle-outline" size={12} color={Colors.textMuted} />
                    <Text style={styles.hintText}>{hint}</Text>
                </View>
            )}

        </Animated.View>
    );
};

const styles = StyleSheet.create({
    wrap: {
        marginBottom: Spacing.md,
    },

    // ── Label ─────────────────────────────────────────────────────────────────
    label: {
        fontSize: FontSize.xs,           // 11
        fontWeight: '700',
        color: Colors.textSecondary,     // #5A6A85
        letterSpacing: 0.9,
        marginBottom: 7,
    },
    labelError: {
        color: Colors.error,             // #DC2626
    },
    requiredStar: {
        color: Colors.error,
        fontWeight: '900',
    },

    // ── Input row ─────────────────────────────────────────────────────────────
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface, // pure #FFFFFF
        borderRadius: BorderRadius.md,   // 12
        borderWidth: 1.5,
        borderColor: Colors.border,      // #E3EAF4 — animated, just the default
        height: 54,
        paddingHorizontal: Spacing.md,
        // single, clean drop-shadow (no glow / inner shadow)
        shadowColor: Colors.shadow,      // rgba(21,101,192,0.12)
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
    },
    rowError: {
        backgroundColor: Colors.errorLight, // #FEE2E2 — very subtle red tint
    },

    // ── Inner elements ────────────────────────────────────────────────────────
    leadingIcon: {
        marginRight: Spacing.sm,         // 8
    },
    prefix: {
        fontSize: FontSize.md,           // 15
        color: Colors.textSecondary,
        fontWeight: '600',
        marginRight: 4,
    },
    prefixDivider: {
        width: 1,
        height: 22,
        backgroundColor: Colors.border,
        marginRight: Spacing.sm,
    },
    input: {
        flex: 1,
        fontSize: FontSize.md,           // 15
        color: Colors.textPrimary,       // #0D1B3E
        paddingVertical: 0,              // keeps text vertically centered on Android
    },
    trailingBtn: {
        padding: 4,
    },
    statusIcon: {
        marginLeft: 4,
    },

    // ── Feedback row (error + hint share layout) ──────────────────────────────
    feedbackRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 5,
    },
    errorText: {
        fontSize: FontSize.xs,           // 11
        color: Colors.error,
        fontWeight: '600',
    },
    hintText: {
        fontSize: FontSize.xs,           // 11
        color: Colors.textMuted,         // #9BA5B7
    },
});