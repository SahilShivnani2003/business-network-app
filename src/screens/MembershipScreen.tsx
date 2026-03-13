import { View, TouchableOpacity, Text, ScrollView, StyleSheet } from 'react-native';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/Button';
import { MEMBERSHIP_PLANS } from '../data/mockData';
import { BorderRadius, Colors, FontSize } from '../theme/colors';

export const MembershipScreen: React.FC<{ navigation: any }> = ({ navigation }) => (
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Membership Plans</Text>
        </View>
        <ScrollView
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 }}
        >
            <Text style={styles.plansSubtitle}>Unlock the full power of your business network</Text>
            {MEMBERSHIP_PLANS.map(plan => (
                <Card
                    key={plan.id}
                    style={[
                        styles.planCard,
                        plan.isPopular && { borderColor: plan.color, borderWidth: 2 },
                    ]}
                >
                    {plan.isPopular && (
                        <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
                            <Text style={styles.popularText}>⭐ MOST POPULAR</Text>
                        </View>
                    )}
                    <View style={styles.planHeader}>
                        <View>
                            <Text style={[styles.planName, { color: plan.color }]}>
                                {plan.name}
                            </Text>
                            <Text style={styles.planPrice}>
                                {plan.price} <Text style={styles.planPeriod}>{plan.period}</Text>
                            </Text>
                        </View>
                    </View>
                    <View style={{ gap: 8, marginBottom: 16 }}>
                        {plan.features.map(f => (
                            <View key={f} style={styles.featureRow}>
                                <Text style={[styles.featureCheck, { color: plan.color }]}>✓</Text>
                                <Text style={styles.featureText}>{f}</Text>
                            </View>
                        ))}
                    </View>
                    <Button
                        label={plan.id === 'free' ? 'Current Plan' : `Get ${plan.name} →`}
                        onPress={() => {}}
                        variant={plan.id === 'free' ? 'ghost' : 'primary'}
                        fullWidth
                        size="md"
                        disabled={plan.id === 'free'}
                        style={plan.id !== 'free' ? { backgroundColor: plan.color } : {}}
                    />
                </Card>
            ))}
        </ScrollView>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: {
        backgroundColor: Colors.primaryDark,
        paddingTop: 52,
        paddingBottom: 18,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: `${Colors.white}20`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backText: { color: Colors.white, fontSize: FontSize.xl, fontWeight: '700' },
    headerTitle: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.white },
    plansSubtitle: {
        fontSize: FontSize.md,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 4,
    },
    planCard: { marginBottom: 16, position: 'relative', overflow: 'hidden' },
    popularBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderBottomLeftRadius: BorderRadius.md,
    },
    popularText: { color: Colors.white, fontSize: 11, fontWeight: '800' },
    planHeader: { marginBottom: 16, marginTop: 8 },
    planName: { fontSize: FontSize.xl, fontWeight: '900' },
    planPrice: {
        fontSize: FontSize.xxl,
        fontWeight: '900',
        color: Colors.textPrimary,
        marginTop: 4,
    },
    planPeriod: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '400' },
    featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    featureCheck: { fontSize: FontSize.md, fontWeight: '800', width: 20 },
    featureText: { fontSize: FontSize.md, color: Colors.textSecondary },
});
