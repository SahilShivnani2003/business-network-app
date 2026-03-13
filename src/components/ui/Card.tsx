import { StyleSheet, TouchableOpacity, View, ViewStyle, StyleProp } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadow } from '../../theme/colors';

interface CardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
}
export const Card: React.FC<CardProps> = ({ children, style, onPress }) => {
    if (onPress) {
        return (
            <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.92}>
                {children}
            </TouchableOpacity>
        );
    }
    return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        ...Shadow.card,
        marginBottom: Spacing.md,
    },
});
