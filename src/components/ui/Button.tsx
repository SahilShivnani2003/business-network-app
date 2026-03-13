import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors, FontSize, BorderRadius } from '../../theme/colors';

interface ButtonProps {
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
}
export const Button: React.FC<ButtonProps> = ({
    label,
    onPress,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    style,
}) => {
    const variantStyles: Record<string, { container: ViewStyle; text: TextStyle }> = {
        primary: { container: { backgroundColor: Colors.primary }, text: { color: Colors.white } },
        secondary: {
            container: { backgroundColor: Colors.primaryDark },
            text: { color: Colors.white },
        },
        outline: {
            container: {
                backgroundColor: 'transparent',
                borderWidth: 1.5,
                borderColor: Colors.primary,
            },
            text: { color: Colors.primary },
        },
        ghost: {
            container: { backgroundColor: `${Colors.primary}10` },
            text: { color: Colors.primary },
        },
        accent: { container: { backgroundColor: Colors.accent }, text: { color: Colors.white } },
    };
    const sizeStyles = { sm: styles.btnSm, md: styles.btnMd, lg: styles.btnLg };
    const { container, text } = variantStyles[variant];
    return (
        <TouchableOpacity
            style={[
                styles.btn,
                sizeStyles[size],
                container,
                fullWidth && { width: '100%' },
                disabled && { opacity: 0.5 },
                style,
            ]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
        >
            <Text style={[styles.btnText, size === 'lg' && { fontSize: FontSize.md }, text]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    btn: {
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    btnSm: { paddingHorizontal: 12, paddingVertical: 7 },
    btnMd: { paddingHorizontal: 20, paddingVertical: 12 },
    btnLg: { paddingHorizontal: 28, paddingVertical: 16 },
    btnText: { fontSize: FontSize.sm, fontWeight: '700', letterSpacing: 0.3 },
});
