import { View, Text, StyleSheet } from 'react-native';
import { BorderRadius, Colors } from '../../theme/colors';

export const TrustScore: React.FC<{ score: number; size?: 'sm' | 'md' }> = ({
    score,
    size = 'md',
}) => {
    const color = score >= 90 ? Colors.success : score >= 75 ? Colors.primary : Colors.warning;
    return (
        <View
            style={[
                styles.trustBadge,
                { borderColor: color },
                size === 'sm' && { paddingHorizontal: 6, paddingVertical: 2 },
            ]}
        >
            <Text style={[styles.trustText, { color }, size === 'sm' && { fontSize: 10 }]}>
                ⭐ {score}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    trustBadge: {
        borderRadius: BorderRadius.full,
        borderWidth: 1.5,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    trustText: { fontSize: 11, fontWeight: '700' },
});
