import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Spacing, FontSize, Colors } from '../../theme/colors';

interface SectionHeaderProps {
    title: string;
    actionLabel?: string;
    onAction?: () => void;
}
export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, actionLabel, onAction }) => (
    <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {actionLabel && (
            <TouchableOpacity onPress={onAction}>
                <Text style={styles.sectionAction}>{actionLabel}</Text>
            </TouchableOpacity>
        )}
    </View>
);

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
        marginTop: Spacing.lg,
    },
    sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
    sectionAction: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
});
