import { View, Text, StyleSheet } from 'react-native';
import { Member } from '../../types';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { Card } from './Card';
import { TrustScore } from './TrustScore';
import { Button } from './Button';
import { FontSize, Colors } from '../../theme/colors';
interface MemberCardProps {
    member: Member;
    onPress: () => void;
    onConnect?: () => void;
}
export const MemberCard: React.FC<MemberCardProps> = ({ member, onPress, onConnect }) => (
    <Card style={styles.memberCard} onPress={onPress}>
        <View style={styles.memberCardRow}>
            <Avatar name={member.name} size={52} />
            <View style={styles.memberInfo}>
                <View style={styles.memberNameRow}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    {member.isVerified && <Text style={styles.verifiedIcon}>✓</Text>}
                </View>
                <Text style={styles.memberCompany}>{member.company}</Text>
                <View style={styles.memberMeta}>
                    <Badge label={member.industry} size="sm" />
                    <Text style={styles.memberCity}>📍 {member.city}</Text>
                </View>
            </View>
            <TrustScore score={member.trustScore} size="sm" />
        </View>
        <View style={styles.memberCardActions}>
            <Button
                label="View Profile"
                onPress={onPress}
                variant="ghost"
                size="sm"
                style={{ flex: 1, marginRight: 8 }}
            />
            <Button
                label="Connect"
                onPress={onConnect || (() => {})}
                variant="primary"
                size="sm"
                style={{ flex: 1 }}
            />
        </View>
    </Card>
);

const styles = StyleSheet.create({
    memberCard: { marginBottom: 12 },
    memberCardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
    memberInfo: { flex: 1 },
    memberNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
    memberName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
    verifiedIcon: {
        color: Colors.primary,
        fontSize: 13,
        backgroundColor: `${Colors.primary}15`,
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 1,
    },
    memberCompany: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 6 },
    memberMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
    memberCity: { fontSize: 11, color: Colors.textMuted },
    memberCardActions: { flexDirection: 'row', marginTop: 12, gap: 8 },
});
