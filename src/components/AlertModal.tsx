import React from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BorderRadius, Colors, FontSize, Shadow, Spacing } from '../theme/colors';
import { AlertButton, AlertConfig, AlertType, ButtonStyle } from '../types/alertTypes';

const { width } = Dimensions.get('window');

// ─── Theme maps (local — UI concern only) ─────────────────────────────────────

export const ALERT_META: Record<
    AlertType,
    { icon: string; iconColor: string; iconBg: string; accentColor: string }
> = {
    success: {
        icon: 'checkmark-circle',
        iconColor: Colors.success,
        iconBg: Colors.successLight,
        accentColor: Colors.success,
    },
    error: {
        icon: 'close-circle',
        iconColor: Colors.error,
        iconBg: Colors.errorLight,
        accentColor: Colors.error,
    },
    warning: {
        icon: 'warning',
        iconColor: Colors.warning,
        iconBg: Colors.warningLight,
        accentColor: Colors.warning,
    },
    info: {
        icon: 'information-circle',
        iconColor: Colors.primary,
        iconBg: `${Colors.primary}15`,
        accentColor: Colors.primary,
    },
    confirm: {
        icon: 'help-circle',
        iconColor: Colors.primary,
        iconBg: `${Colors.primary}15`,
        accentColor: Colors.primary,
    },
};

export const BUTTON_THEME: Record<ButtonStyle, { bg: string; border?: string; text: string }> = {
    primary: { bg: Colors.primary, text: Colors.white },
    danger: { bg: Colors.error, text: Colors.white },
    warning: { bg: Colors.warning, text: Colors.white },
    ghost: { bg: 'transparent', border: Colors.border, text: Colors.textSecondary },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface AlertModalProps {
    visible: boolean;
    config: AlertConfig | null;
    buttons: AlertButton[];
    canDismissOnBackdrop: boolean;
    onBackdropPress: () => void;
    onRequestClose: () => void;
    // Animated values driven by the context
    backdropOpacity: Animated.Value;
    cardScale: Animated.Value;
    cardOpacity: Animated.Value;
}

// ─── Component ────────────────────────────────────────────────────────────────

const AlertModal: React.FC<AlertModalProps> = ({
    visible,
    config,
    buttons,
    canDismissOnBackdrop,
    onBackdropPress,
    onRequestClose,
    backdropOpacity,
    cardScale,
    cardOpacity,
}) => {
    const meta = config ? ALERT_META[config.type] : ALERT_META.info;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            statusBarTranslucent
            onRequestClose={canDismissOnBackdrop ? onRequestClose : undefined}
        >
            {/* ── Backdrop ── */}
            <TouchableWithoutFeedback onPress={canDismissOnBackdrop ? onBackdropPress : undefined}>
                <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
            </TouchableWithoutFeedback>

            {/* ── Card ── */}
            <View style={styles.centreContainer} pointerEvents="box-none">
                <Animated.View
                    style={[
                        styles.card,
                        { opacity: cardOpacity, transform: [{ scale: cardScale }] },
                    ]}
                >
                    {/* Accent strip */}
                    <View style={[styles.accentStrip, { backgroundColor: meta.accentColor }]} />

                    {/* Icon circle */}
                    <View style={[styles.iconCircle, { backgroundColor: meta.iconBg }]}>
                        <Ionicons name={meta.icon as any} size={36} color={meta.iconColor} />
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>{config?.title}</Text>

                    {/* Message */}
                    {!!config?.message && <Text style={styles.message}>{config.message}</Text>}

                    {/* Buttons */}
                    <View style={[styles.buttonsRow, buttons.length === 1 && styles.buttonsSingle]}>
                        {buttons.map((btn, i) => {
                            const theme = BUTTON_THEME[btn.style ?? 'primary'];
                            return (
                                <TouchableOpacity
                                    key={i}
                                    style={[
                                        styles.btn,
                                        buttons.length > 1 && { flex: 1 },
                                        { backgroundColor: theme.bg },
                                        theme.border
                                            ? { borderWidth: 1.5, borderColor: theme.border }
                                            : null,
                                    ]}
                                    onPress={btn.onPress}
                                    activeOpacity={0.82}
                                >
                                    <Text style={[styles.btnText, { color: theme.text }]}>
                                        {btn.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default AlertModal;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.overlay,
    },
    centreContainer: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.xl,
    },
    card: {
        width: '100%',
        maxWidth: width - Spacing.xl * 2,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        alignItems: 'center',
        paddingBottom: Spacing.lg,
        ...Shadow.button,
    },
    accentStrip: {
        width: '100%',
        height: 5,
        marginBottom: Spacing.lg,
    },
    iconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    title: {
        fontSize: FontSize.xl,
        fontWeight: '800',
        color: Colors.textPrimary,
        textAlign: 'center',
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.sm,
    },
    message: {
        fontSize: FontSize.md,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.md,
    },
    buttonsRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.sm,
        width: '100%',
    },
    buttonsSingle: {
        justifyContent: 'center',
    },
    btn: {
        borderRadius: BorderRadius.md,
        paddingVertical: 13,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 100,
    },
    btnText: {
        fontSize: FontSize.md,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
});
