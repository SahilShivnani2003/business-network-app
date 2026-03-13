import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Colors, FontSize, Spacing, BorderRadius, Shadow } from '../../theme/colors';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/index';
import { Button } from '../../components/ui/button';

type Props = { navigation: StackNavigationProp<RootStackParamList, 'Signup'> };

const INDUSTRIES = [
    'Information Technology',
    'Real Estate',
    'Digital Marketing',
    'Finance',
    'Healthcare',
    'Manufacturing',
    'Education',
    'Retail',
    'Consulting',
    'Other',
];

const SignupScreen: React.FC<Props> = ({ navigation }) => {
    const [form, setForm] = useState({
        name: '',
        mobile: '',
        email: '',
        businessName: '',
        industry: '',
        city: '',
        password: '',
    });
    const [showIndustryPicker, setShowIndustryPicker] = useState(false);

    const update = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.backText}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.sub}>Join India's fastest growing business network</Text>
                </View>

                {/* Progress bar */}
                <View style={styles.progressBar}>
                    <View style={styles.progressFill} />
                </View>
                <Text style={styles.progressLabel}>Step 1 of 1 — Basic Details</Text>

                {/* Form */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>👤 Personal Information</Text>
                    <InputField
                        label="Full Name *"
                        value={form.name}
                        onChange={v => update('name', v)}
                        placeholder="John Doe"
                    />
                    <InputField
                        label="Mobile Number *"
                        value={form.mobile}
                        onChange={v => update('mobile', v)}
                        placeholder="+91 98765 43210"
                        keyboardType="phone-pad"
                    />
                    <InputField
                        label="Email Address *"
                        value={form.email}
                        onChange={v => update('email', v)}
                        placeholder="you@company.com"
                        keyboardType="email-address"
                    />
                </View>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>🏢 Business Information</Text>
                    <InputField
                        label="Business Name *"
                        value={form.businessName}
                        onChange={v => update('businessName', v)}
                        placeholder="Your Company Pvt Ltd"
                    />

                    {/* Industry Selector */}
                    <Text style={styles.inputLabel}>Industry *</Text>
                    <TouchableOpacity
                        style={styles.pickerBtn}
                        onPress={() => setShowIndustryPicker(!showIndustryPicker)}
                    >
                        <Text
                            style={[
                                styles.pickerText,
                                !form.industry && { color: Colors.textMuted },
                            ]}
                        >
                            {form.industry || 'Select your industry'}
                        </Text>
                        <Text style={styles.pickerArrow}>{showIndustryPicker ? '▲' : '▼'}</Text>
                    </TouchableOpacity>
                    {showIndustryPicker && (
                        <View style={styles.dropdown}>
                            {INDUSTRIES.map(ind => (
                                <TouchableOpacity
                                    key={ind}
                                    style={[
                                        styles.dropdownItem,
                                        form.industry === ind && styles.dropdownItemActive,
                                    ]}
                                    onPress={() => {
                                        update('industry', ind);
                                        setShowIndustryPicker(false);
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.dropdownItemText,
                                            form.industry === ind && styles.dropdownItemTextActive,
                                        ]}
                                    >
                                        {ind}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    <InputField
                        label="City *"
                        value={form.city}
                        onChange={v => update('city', v)}
                        placeholder="Mumbai, Delhi, Bangalore..."
                    />
                </View>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>🔒 Security</Text>
                    <InputField
                        label="Password *"
                        value={form.password}
                        onChange={v => update('password', v)}
                        placeholder="Min. 8 characters"
                        secureTextEntry
                    />
                    <View style={styles.passwordStrength}>
                        <View
                            style={[
                                styles.strengthBar,
                                form.password.length >= 6 && { backgroundColor: Colors.success },
                            ]}
                        />
                        <View
                            style={[
                                styles.strengthBar,
                                form.password.length >= 10 && { backgroundColor: Colors.success },
                            ]}
                        />
                        <View
                            style={[
                                styles.strengthBar,
                                form.password.length >= 12 && { backgroundColor: Colors.primary },
                            ]}
                        />
                        <Text style={styles.strengthText}>
                            {form.password.length >= 12
                                ? 'Strong'
                                : form.password.length >= 6
                                ? 'Medium'
                                : 'Weak'}
                        </Text>
                    </View>
                </View>

                <View style={styles.termsRow}>
                    <Text style={styles.termsText}>By registering, you agree to our </Text>
                    <TouchableOpacity>
                        <Text style={styles.termsLink}>Terms & Privacy Policy</Text>
                    </TouchableOpacity>
                </View>

                <Button
                    label="Create Free Account →"
                    onPress={() => navigation.replace('Main')}
                    variant="primary"
                    fullWidth
                    size="lg"
                    style={{ marginBottom: 24 }}
                />

                <View style={styles.loginRow}>
                    <Text style={styles.loginPrompt}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.replace('Login')}>
                        <Text style={styles.loginLink}>Login →</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const InputField: React.FC<{
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    keyboardType?: any;
    secureTextEntry?: boolean;
}> = ({ label, value, onChange, placeholder, keyboardType, secureTextEntry }) => (
    <View style={{ marginBottom: 14 }}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            placeholderTextColor={Colors.textMuted}
            keyboardType={keyboardType || 'default'}
            secureTextEntry={secureTextEntry}
            autoCapitalize="none"
        />
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content: { paddingHorizontal: 20, paddingBottom: 40 },
    header: { paddingTop: 52, paddingBottom: 20 },
    backBtn: { marginBottom: 16 },
    backText: { color: Colors.primary, fontSize: FontSize.md, fontWeight: '600' },
    title: { fontSize: FontSize.xxxl, fontWeight: '900', color: Colors.textPrimary },
    sub: { fontSize: FontSize.md, color: Colors.textSecondary, marginTop: 4 },
    progressBar: { height: 4, backgroundColor: Colors.border, borderRadius: 2, marginBottom: 6 },
    progressFill: { height: 4, width: '100%', backgroundColor: Colors.primary, borderRadius: 2 },
    progressLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: Spacing.lg },
    sectionCard: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        marginBottom: 16,
        ...Shadow.card,
    },
    sectionTitle: {
        fontSize: FontSize.md,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: FontSize.sm,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.md,
        borderWidth: 1.5,
        borderColor: Colors.border,
        paddingHorizontal: 14,
        paddingVertical: 13,
        fontSize: FontSize.md,
        color: Colors.textPrimary,
    },
    pickerBtn: {
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.md,
        borderWidth: 1.5,
        borderColor: Colors.border,
        paddingHorizontal: 14,
        paddingVertical: 13,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    pickerText: { fontSize: FontSize.md, color: Colors.textPrimary },
    pickerArrow: { color: Colors.textMuted, fontSize: 12 },
    dropdown: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: 14,
        ...Shadow.card,
    },
    dropdownItem: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    dropdownItemActive: { backgroundColor: `${Colors.primary}10` },
    dropdownItemText: { fontSize: FontSize.md, color: Colors.textPrimary },
    dropdownItemTextActive: { color: Colors.primary, fontWeight: '700' },
    passwordStrength: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
    strengthBar: { flex: 1, height: 4, backgroundColor: Colors.border, borderRadius: 2 },
    strengthText: { fontSize: 11, color: Colors.textMuted, width: 48 },
    termsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
    },
    termsText: { fontSize: FontSize.sm, color: Colors.textSecondary },
    termsLink: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
    loginRow: { flexDirection: 'row', justifyContent: 'center' },
    loginPrompt: { fontSize: FontSize.md, color: Colors.textSecondary },
    loginLink: { fontSize: FontSize.md, color: Colors.primary, fontWeight: '700' },
});

export default SignupScreen;
