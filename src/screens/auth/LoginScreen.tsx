import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Colors, FontSize, Spacing, BorderRadius, Shadow } from '../../theme/colors';
import { Button } from '../../components/ui/Button';
import { InputField } from '../../components/ui/InputField';
import { RootStackParamList } from '../../types/rootStackParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
    validate,
    required,
    isEmail,
    isIndianMobile,
    isOtp,
    minLength,
} from '../../utils/validation';
import { useAlert } from '../../context/AlertContext';
import { useAuthStore } from '../../store/authStore';
import { companyAPI } from '../../service/apis/companyService';

type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
type LoginMethod = 'otp' | 'email';

const LoginScreen = ({ navigation }: LoginProps) => {
    const [method, setMethod] = useState<LoginMethod>('email');
    const alert = useAlert();
    const { login } = useAuthStore();
    // OTP flow
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [phoneTouched, setPhoneTouched] = useState(false);
    const [otpTouched, setOtpTouched] = useState(false);

    // Email flow
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    // Validation errors
    const phoneError = validate(phone, [required('Mobile number is required'), isIndianMobile()]);
    const otpError = validate(otp, [required('OTP is required'), isOtp(6)]);
    const emailError = validate(email, [required('Email is required'), isEmail()]);
    const passError = validate(password, [required('Password is required'), minLength(8)]);

    // Handlers
    const handleSendOtp = () => {
        setPhoneTouched(true);
        if (phoneError) return;
        alert.info('Comming Soon', 'OTP login comming soon');
    };

    const handleSocialLogin = () => {
        alert.info('Comming Soon', 'Social login comming soon');
    };

    const handleVerifyOtp = () => {
        setPhoneTouched(true);
        setOtpTouched(true);
        if (phoneError || otpError) return;
        navigation.replace('Main');
    };

    const handleEmailLogin = async () => {
        setEmailTouched(true);
        setPasswordTouched(true);
        if (emailError || passError) return;

        try {
            const data = {
                email: email,
                password: password,
            };

            const response = await companyAPI.login(data);

            if (response.data?.success) {
                alert.success('Login Successed', response.data?.message || 'Login successfully');
                login(response?.data?.company, response.data?.token);
                navigation.replace('Main');
            }
        } catch (error: any) {
            alert.error('Login failed', error?.message || 'Something went wrong');
        }
    };

    const handleSwitchMethod = (m: LoginMethod) => {
        setMethod(m);
        setOtpSent(false);
        setPhoneTouched(false);
        setOtpTouched(false);
        setEmailTouched(false);
        setPasswordTouched(false);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoMini}>
                        <Text style={styles.logoI}>i</Text>
                        <Text style={styles.logoNext}>NEXT</Text>
                        <View style={styles.etsBadge}>
                            <Text style={styles.etsText}>ETS</Text>
                        </View>
                    </View>
                    <Text style={styles.welcomeTitle}>Welcome Back!</Text>
                    <Text style={styles.welcomeSub}>Sign in to your business network</Text>
                </View>

                {/* Method Tabs */}
                <View style={styles.methodTabs}>
                    {(['otp', 'email'] as LoginMethod[]).map(m => (
                        <TouchableOpacity
                            key={m}
                            style={[styles.methodTab, method === m && styles.methodTabActive]}
                            onPress={() => handleSwitchMethod(m)}
                        >
                            <Text
                                style={[
                                    styles.methodTabText,
                                    method === m && styles.methodTabTextActive,
                                ]}
                            >
                                {m === 'otp' ? '📱 Mobile OTP' : '📧 Email'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {method === 'otp' ? (
                        <>
                            <InputField
                                label="Mobile Number"
                                icon="call-outline"
                                value={phone}
                                onChangeText={v => {
                                    setPhone(v);
                                    setPhoneTouched(false);
                                }}
                                placeholder="98765 43210"
                                keyboardType="phone-pad"
                                prefix="+91"
                                maxLength={10}
                                required
                                error={phoneError}
                                touched={phoneTouched}
                                hint="Enter your 10-digit registered mobile number"
                            />

                            {!otpSent ? (
                                <Button
                                    label="Send OTP"
                                    onPress={handleSendOtp}
                                    variant="primary"
                                    fullWidth
                                    size="lg"
                                />
                            ) : (
                                <>
                                    <View style={styles.otpBanner}>
                                        <Text style={styles.otpBannerIcon}>📨</Text>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.otpBannerTitle}>OTP Sent!</Text>
                                            <Text style={styles.otpBannerSub}>
                                                Sent to +91 {phone}
                                            </Text>
                                        </View>
                                    </View>

                                    <InputField
                                        label="Enter OTP"
                                        icon="shield-checkmark-outline"
                                        value={otp}
                                        onChangeText={v => {
                                            setOtp(v);
                                            setOtpTouched(false);
                                        }}
                                        placeholder="• • • • • •"
                                        keyboardType="number-pad"
                                        maxLength={6}
                                        required
                                        error={otpError}
                                        touched={otpTouched}
                                        hint="Check your SMS for the 6-digit code"
                                    />

                                    <Button
                                        label="Verify & Login"
                                        onPress={handleVerifyOtp}
                                        variant="primary"
                                        fullWidth
                                        size="lg"
                                    />

                                    <TouchableOpacity
                                        style={styles.resendBtn}
                                        onPress={() => {
                                            setOtp('');
                                            setOtpSent(false);
                                            setOtpTouched(false);
                                        }}
                                    >
                                        <Text style={styles.resendText}>
                                            Didn't receive? Resend OTP
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <InputField
                                label="Email Address"
                                icon="mail-outline"
                                value={email}
                                onChangeText={v => {
                                    setEmail(v);
                                    setEmailTouched(false);
                                }}
                                placeholder="you@company.com"
                                keyboardType="email-address"
                                required
                                error={emailError}
                                touched={emailTouched}
                            />

                            <InputField
                                label="Password"
                                icon="lock-closed-outline"
                                value={password}
                                onChangeText={v => {
                                    setPassword(v);
                                    setPasswordTouched(false);
                                }}
                                placeholder="Enter your password"
                                secureTextEntry={!showPassword}
                                trailingIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                onTrailingPress={() => setShowPassword(p => !p)}
                                required
                                error={passError}
                                touched={passwordTouched}
                                hint="Minimum 8 characters"
                            />

                            <TouchableOpacity style={styles.forgotBtn}>
                                <Text style={styles.forgotText}>Forgot Password?</Text>
                            </TouchableOpacity>

                            <Button
                                label="Login"
                                onPress={handleEmailLogin}
                                variant="primary"
                                fullWidth
                                size="lg"
                            />
                        </>
                    )}
                </View>

                {/* Divider */}
                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or continue with</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Social Login */}
                <View style={styles.socialRow}>
                    <SocialButton
                        label="Google"
                        icon="G"
                        color="#EA4335"
                        onPress={handleSocialLogin}
                    />
                    <SocialButton
                        label="LinkedIn"
                        icon="in"
                        color="#0A66C2"
                        onPress={handleSocialLogin}
                    />
                </View>

                {/* Register link */}
                <View style={styles.registerRow}>
                    <Text style={styles.registerPrompt}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.replace('Signup')}>
                        <Text style={styles.registerLink}>Register Free →</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

// Social Button
const SocialButton: React.FC<{
    label: string;
    icon: string;
    color: string;
    onPress: () => void;
}> = ({ label, icon, color, onPress }) => (
    <TouchableOpacity style={styles.socialBtn} onPress={onPress} activeOpacity={0.8}>
        <View style={[styles.socialIcon, { backgroundColor: color }]}>
            <Text style={styles.socialIconText}>{icon}</Text>
        </View>
        <Text style={styles.socialLabel}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content: { paddingHorizontal: 24, paddingBottom: 40 },
    header: { alignItems: 'center', paddingTop: 60, paddingBottom: 32 },
    logoMini: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginBottom: 24 },
    logoI: { fontSize: 36, fontWeight: '900', color: Colors.accent, fontStyle: 'italic' },
    logoNext: { fontSize: 28, fontWeight: '900', color: Colors.primaryDark, letterSpacing: 2 },
    etsBadge: {
        backgroundColor: Colors.accent,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 4,
        marginBottom: 2,
    },
    etsText: { color: Colors.white, fontSize: 10, fontWeight: '900', letterSpacing: 3 },
    welcomeTitle: {
        fontSize: FontSize.xxxl,
        fontWeight: '900',
        color: Colors.textPrimary,
        marginBottom: 6,
    },
    welcomeSub: { fontSize: FontSize.md, color: Colors.textSecondary },
    methodTabs: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        padding: 4,
        marginBottom: Spacing.lg,
        ...Shadow.card,
    },
    methodTab: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
    },
    methodTabActive: { backgroundColor: Colors.primary },
    methodTabText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '600' },
    methodTabTextActive: { color: Colors.white },
    form: { gap: 4 },
    otpBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: Colors.successLight,
        borderRadius: BorderRadius.md,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: `${Colors.success}30`,
    },
    otpBannerIcon: { fontSize: 24 },
    otpBannerTitle: { fontSize: FontSize.md, fontWeight: '800', color: Colors.success },
    otpBannerSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 1 },
    forgotBtn: { alignSelf: 'flex-end', marginBottom: 20, marginTop: -8 },
    forgotText: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: '600' },
    resendBtn: { alignItems: 'center', marginTop: 14 },
    resendText: {
        color: Colors.primary,
        fontSize: FontSize.sm,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 24 },
    dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
    dividerText: { fontSize: FontSize.sm, color: Colors.textMuted },
    socialRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
    socialBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        paddingVertical: 13,
        borderWidth: 1.5,
        borderColor: Colors.border,
        ...Shadow.card,
    },
    socialIcon: {
        width: 24,
        height: 24,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    socialIconText: { color: Colors.white, fontSize: 12, fontWeight: '900' },
    socialLabel: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary },
    registerRow: { flexDirection: 'row', justifyContent: 'center' },
    registerPrompt: { fontSize: FontSize.md, color: Colors.textSecondary },
    registerLink: { fontSize: FontSize.md, color: Colors.primary, fontWeight: '700' },
});

export default LoginScreen;
