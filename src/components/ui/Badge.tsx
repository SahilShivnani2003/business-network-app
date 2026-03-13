import { View, Text, StyleSheet } from 'react-native';
import { BorderRadius, Colors, FontSize } from '../../theme/colors';

interface BadgeProps {
    label: string;
    color?: string;
    bgColor?: string;
    size?: 'sm' | 'md';
}
export const Badge: React.FC<BadgeProps> = ({
    label,
    color = Colors.primary,
    bgColor,
    size = 'md',
}) => (
    <View
        style={[
            styles.badge,
            { backgroundColor: bgColor || `${color}18` },
            size === 'sm' && styles.badgeSm,
        ]}
    >
        <Text style={[styles.badgeText, { color }, size === 'sm' && styles.badgeTextSm]}>
            {label}
        </Text>
    </View>
);

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: BorderRadius.full,
        alignSelf: 'flex-start',
    },
    badgeSm: { paddingHorizontal: 7, paddingVertical: 2 },
    badgeText: { fontSize: FontSize.sm, fontWeight: '600' },
    badgeTextSm: { fontSize: 10 },
});
