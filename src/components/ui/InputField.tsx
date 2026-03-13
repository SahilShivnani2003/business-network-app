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
        Animated.spring(borderAnim, { toValue: 1, useNativeDriver: false, speed: 28 }).start();
    };
    const onBlur = () => {
        setFocused(false);
        Animated.spring(borderAnim, { toValue: 0, useNativeDriver: false, speed: 28 }).start();
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
                Animated.timing(shakeAnim, { toValue: 7, duration: 55, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: -7, duration: 55, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 5, duration: 55, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: -5, duration: 55, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 0, duration: 55, useNativeDriver: true }),
            ]).start();
        }
    }, [showError, error]);

    const iconColor = focused ? Colors.primary : showError ? Colors.error : Colors.textMuted;

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
                    focused && styles.rowFocused,
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
                    /* Validation status icon when touched and no trailing icon */
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
                <View style={styles.errorRow}>
                    <Ionicons name="alert-circle" size={12} color={Colors.error} />
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            {/* ── Hint (only when no error) ── */}
            {hint && !showError && (
                <View style={styles.hintRow}>
                    <Ionicons
                        name="information-circle-outline"
                        size={12}
                        color={Colors.textMuted}
                    />
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
    label: {
        fontSize: 11,
        fontWeight: '700',
        color: Colors.textSecondary,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        marginBottom: 7,
    },
    labelError: {
        color: Colors.error,
    },
    requiredStar: {
        color: Colors.error,
        fontWeight: '900',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1.5,
        borderColor: Colors.border,
        height: 54,
        paddingHorizontal: Spacing.md,
    },
    rowFocused: {
        backgroundColor: `${Colors.primary}08`,
        // elevated shadow on focus
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.14,
        shadowRadius: 8,
        elevation: 4,
    },
    rowError: {
        backgroundColor: `${Colors.error}06`,
    },
    leadingIcon: {
        marginRight: Spacing.sm,
    },
    prefix: {
        fontSize: FontSize.md,
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
        fontSize: FontSize.md,
        color: Colors.textPrimary,
    },
    trailingBtn: {
        padding: 4,
    },
    statusIcon: {
        marginLeft: 4,
    },
    errorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 5,
    },
    errorText: {
        fontSize: 11,
        color: Colors.error,
        fontWeight: '600',
    },
    hintRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 5,
    },
    hintText: {
        fontSize: 11,
        color: Colors.textMuted,
    },
});
