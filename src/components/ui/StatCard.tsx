import { StyleSheet, Text, View } from 'react-native';
import { Colors, BorderRadius, Shadow, FontSize } from '../../theme/colors';

interface StatCardProps {
    value: string;
    label: string;
    icon: string;
    color?: string;
}
export const StatCard: React.FC<StatCardProps> = ({
    value,
    label,
    icon,
    color = Colors.primary,
}) => (
    <View style={[styles.statCard, { borderTopColor: color, borderTopWidth: 3 }]}>
        <Text style={[styles.statIcon]}>{icon}</Text>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const styles = StyleSheet.create({
    statCard: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        padding: 14,
        alignItems: 'center',
        flex: 1,
        ...Shadow.card,
    },
    statIcon: { fontSize: 22, marginBottom: 4 },
    statValue: { fontSize: FontSize.xl, fontWeight: '800' },
    statLabel: { fontSize: 11, color: Colors.textMuted, marginTop: 2, textAlign: 'center' },
});
