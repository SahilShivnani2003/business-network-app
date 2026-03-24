import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Dimensions,
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

const { width } = Dimensions.get('window');

type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
type LoginMethod = 'otp' | 'email';

const LoginScreen = ({ navigation }: LoginProps) => {
    const [method, setMethod] = useState<LoginMethod>('email');
    const alert = useAlert();
    const { login } = useAuthStore();

    // Animation refs
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const tabIndicator = useRef(new Animated.Value(0)).current;
    const formFade = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

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

    const phoneError = validate(phone, [required('Mobile number is required'), isIndianMobile()]);
    const otpError = validate(otp, [required('OTP is required'), isOtp(6)]);
    const emailError = validate(email, [required('Email is required'), isEmail()]);
    const passError = validate(password, [required('Password is required'), minLength(8)]);

    const switchMethod = (m: LoginMethod) => {
        Animated.sequence([
            Animated.timing(formFade, { toValue: 0, duration: 120, useNativeDriver: true }),
            Animated.timing(formFade, { toValue: 1, duration: 250, useNativeDriver: true }),
        ]).start();

        Animated.timing(tabIndicator, {
            toValue: m === 'email' ? 1 : 0,
            duration: 250,
            useNativeDriver: false,
        }).start();

        setMethod(m);
        setOtpSent(false);
        setPhoneTouched(false);
        setOtpTouched(false);
        setEmailTouched(false);
        setPasswordTouched(false);
    };

    const handleSendOtp = () => {
        setPhoneTouched(true);
        if (phoneError) return;
        alert.info('Coming Soon', 'OTP login coming soon');
    };

    const handleSocialLogin = () => {
        alert.info('Coming Soon', 'Social login coming soon');
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
            const response = await companyAPI.login({ email, password });
            if (response.data?.success) {
                alert.success('Login Successful', response.data?.message || 'Welcome back!');
                login(response?.data?.company, response.data?.token);
                navigation.replace('Main');
            }
        } catch (error: any) {
            alert.error('Login Failed', error?.message || 'Something went wrong');
        }
    };

    const tabTranslate = tabIndicator.interpolate({
        inputRange: [0, 1],
        outputRange: [0, (width - 48) / 2 - 4],
    });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

            {/* Full-bleed header with diagonal clip */}
            <View style={styles.headerBg}>
                {/* Decorative circles */}
                <View style={styles.circle1} />
                <View style={styles.circle2} />
                <View style={styles.circle3} />

                <Animated.View
                    style={[
                        styles.headerContent,
                        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                    ]}
                >
                    {/* Logo */}
                    <View style={styles.logoRow}>
                        <View style={styles.logoIconBox}>
                            <Text style={styles.logoIconText}>i</Text>
                        </View>
                        <View>
                            <Text style={styles.logoWordmark}>iNEXT</Text>
                            <View style={styles.etsBadge}>
                                <Text style={styles.etsText}>E·T·S</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.welcomeTitle}>Welcome Back</Text>
                    <Text style={styles.welcomeSub}>Your business network awaits</Text>
                </Animated.View>
            </View>

            {/* Card body */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <Animated.View
                    style={[
                        styles.card,
                        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                    ]}
                >
                    {/* Tab Switcher */}
                    <View style={styles.tabsWrapper}>
                        <Animated.View
                            style={[
                                styles.tabSlider,
                                { transform: [{ translateX: tabTranslate }] },
                            ]}
                        />
                        <TouchableOpacity
                            style={styles.tab}
                            onPress={() => switchMethod('otp')}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.tabEmoji}>📱</Text>
                            <Text
                                style={[
                                    styles.tabLabel,
                                    method === 'otp' && styles.tabLabelActive,
                                ]}
                            >
                                Mobile OTP
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.tab}
                            onPress={() => switchMethod('email')}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.tabEmoji}>📧</Text>
                            <Text
                                style={[
                                    styles.tabLabel,
                                    method === 'email' && styles.tabLabelActive,
                                ]}
                            >
                                Email
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Thin accent line */}
                    <View style={styles.accentBar} />

                    {/* Form */}
                    <Animated.View style={[styles.formArea, { opacity: formFade }]}>
                        {method === 'otp' ? (
                            <>
                                <InputField
                                    label="Mobile Number"
                                    icon="call-outline"
                                    value={phone}
                                    onChangeText={v => { setPhone(v); setPhoneTouched(false); }}
                                    placeholder="98765 43210"
                                    keyboardType="phone-pad"
                                    prefix="+91"
                                    maxLength={10}
                                    required
                                    error={phoneError}
                                    touched={phoneTouched}
                                    hint="10-digit registered mobile number"
                                />
                                {!otpSent ? (
                                    <Button
                                        label="Send OTP →"
                                        onPress={handleSendOtp}
                                        variant="primary"
                                        fullWidth
                                        size="lg"
                                    />
                                ) : (
                                    <>
                                        <View style={styles.otpBanner}>
                                            <View style={styles.otpIconCircle}>
                                                <Text style={styles.otpIcon}>✉</Text>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.otpBannerTitle}>OTP Sent!</Text>
                                                <Text style={styles.otpBannerSub}>Sent to +91 {phone}</Text>
                                            </View>
                                        </View>
                                        <InputField
                                            label="Enter OTP"
                                            icon="shield-checkmark-outline"
                                            value={otp}
                                            onChangeText={v => { setOtp(v); setOtpTouched(false); }}
                                            placeholder="• • • • • •"
                                            keyboardType="number-pad"
                                            maxLength={6}
                                            required
                                            error={otpError}
                                            touched={otpTouched}
                                            hint="6-digit code from SMS"
                                        />
                                        <Button
                                            label="Verify & Login →"
                                            onPress={handleVerifyOtp}
                                            variant="primary"
                                            fullWidth
                                            size="lg"
                                        />
                                        <TouchableOpacity
                                            style={styles.resendBtn}
                                            onPress={() => { setOtp(''); setOtpSent(false); setOtpTouched(false); }}
                                        >
                                            <Text style={styles.resendText}>Didn't receive? Resend OTP</Text>
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
                                    onChangeText={v => { setEmail(v); setEmailTouched(false); }}
                                    placeholder="you@company.com"
                                    keyboardType="email-address"
                                    required
                                    error={emailError}
                                    touched={emailTouched}
                                />
                                <View style={styles.passwordWrapper}>
                                    <InputField
                                        label="Password"
                                        icon="lock-closed-outline"
                                        value={password}
                                        onChangeText={v => { setPassword(v); setPasswordTouched(false); }}
                                        placeholder="Min. 8 characters"
                                        secureTextEntry={!showPassword}
                                        trailingIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                        onTrailingPress={() => setShowPassword(p => !p)}
                                        required
                                        error={passError}
                                        touched={passwordTouched}
                                    />
                                </View>
                                <TouchableOpacity style={styles.forgotBtn}>
                                    <Text style={styles.forgotText}>Forgot Password?</Text>
                                </TouchableOpacity>
                                <Button
                                    label="Login →"
                                    onPress={handleEmailLogin}
                                    variant="primary"
                                    fullWidth
                                    size="lg"
                                />
                            </>
                        )}
                    </Animated.View>

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={styles.divLine} />
                        <Text style={styles.divText}>or continue with</Text>
                        <View style={styles.divLine} />
                    </View>

                    {/* Social */}
                    <View style={styles.socialRow}>
                        <SocialButton label="Google" icon="G" color="#EA4335" onPress={handleSocialLogin} />
                        <SocialButton label="LinkedIn" icon="in" color="#0A66C2" onPress={handleSocialLogin} />
                    </View>
                </Animated.View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerPrompt}>New to iNEXT ETS? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text style={styles.footerLink}>Register Free →</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const SocialButton: React.FC<{
    label: string;
    icon: string;
    color: string;
    onPress: () => void;
}> = ({ label, icon, color, onPress }) => (
    <TouchableOpacity style={styles.socialBtn} onPress={onPress} activeOpacity={0.75}>
        <View style={[styles.socialIconBox, { backgroundColor: color }]}>
            <Text style={styles.socialIconText}>{icon}</Text>
        </View>
        <Text style={styles.socialLabel}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    /* ── Background header ── */
    headerBg: {
        backgroundColor: Colors.primaryDark,
        paddingTop: 56,
        paddingBottom: 52,
        paddingHorizontal: 28,
        overflow: 'hidden',
        position: 'relative',
    },
    circle1: {
        position: 'absolute',
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: Colors.primaryLight,
        opacity: 0.15,
        top: -60,
        right: -60,
    },
    circle2: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: Colors.accent,
        opacity: 0.12,
        bottom: -30,
        left: -30,
    },
    circle3: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.accentLight,
        opacity: 0.1,
        top: 30,
        left: width / 2,
    },
    headerContent: {
        zIndex: 10,
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 24,
    },
    logoIconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: Colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadow.button,
    },
    logoIconText: {
        fontSize: 30,
        fontWeight: '900',
        color: Colors.white,
        fontStyle: 'italic',
        lineHeight: 34,
    },
    logoWordmark: {
        fontSize: 22,
        fontWeight: '900',
        color: Colors.white,
        letterSpacing: 3,
    },
    etsBadge: {
        backgroundColor: 'rgba(255,255,255,0.18)',
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 1,
        alignSelf: 'flex-start',
        marginTop: 2,
    },
    etsText: {
        color: Colors.white,
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 3,
    },
    welcomeTitle: {
        fontSize: 34,
        fontWeight: '900',
        color: Colors.white,
        letterSpacing: -0.5,
        marginBottom: 4,
    },
    welcomeSub: {
        fontSize: FontSize.md,
        color: 'rgba(255,255,255,0.65)',
        fontWeight: '500',
    },

    /* ── Scroll / card ── */
    scrollView: {
        flex: 1,
        backgroundColor: Colors.background,
        marginTop: -20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 28,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.xl,
        padding: 22,
        ...Shadow.card,
    },

    /* ── Tabs ── */
    tabsWrapper: {
        flexDirection: 'row',
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.lg,
        padding: 4,
        marginBottom: 0,
        position: 'relative',
    },
    tabSlider: {
        position: 'absolute',
        top: 4,
        left: 4,
        width: '50%',
        bottom: 4,
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.md,
        ...Shadow.button,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        gap: 6,
        zIndex: 2,
    },
    tabEmoji: {
        fontSize: 15,
    },
    tabLabel: {
        fontSize: FontSize.sm,
        fontWeight: '700',
        color: Colors.textSecondary,
    },
    tabLabelActive: {
        color: Colors.white,
    },

    /* ── Accent bar ── */
    accentBar: {
        height: 3,
        backgroundColor: Colors.accent,
        borderRadius: BorderRadius.full,
        width: 40,
        marginTop: 20,
        marginBottom: 20,
    },

    /* ── Form ── */
    formArea: {
        gap: 4,
    },
    passwordWrapper: {
        marginTop: 0,
    },
    forgotBtn: {
        alignSelf: 'flex-end',
        paddingVertical: 6,
        marginBottom: 12,
    },
    forgotText: {
        color: Colors.primary,
        fontSize: FontSize.sm,
        fontWeight: '700',
    },

    /* ── OTP banner ── */
    otpBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        backgroundColor: Colors.successLight,
        borderRadius: BorderRadius.md,
        padding: 14,
        marginBottom: 14,
        borderLeftWidth: 3,
        borderLeftColor: Colors.success,
    },
    otpIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.success,
        alignItems: 'center',
        justifyContent: 'center',
    },
    otpIcon: {
        color: Colors.white,
        fontSize: 16,
    },
    otpBannerTitle: {
        fontSize: FontSize.md,
        fontWeight: '800',
        color: Colors.success,
    },
    otpBannerSub: {
        fontSize: FontSize.xs,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    resendBtn: {
        alignItems: 'center',
        marginTop: 16,
        paddingVertical: 4,
    },
    resendText: {
        color: Colors.primary,
        fontSize: FontSize.sm,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },

    /* ── Divider ── */
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginVertical: 22,
    },
    divLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.border,
    },
    divText: {
        fontSize: FontSize.xs,
        color: Colors.textMuted,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    /* ── Social ── */
    socialRow: {
        flexDirection: 'row',
        gap: 12,
    },
    socialBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.md,
        paddingVertical: 14,
        borderWidth: 1.5,
        borderColor: Colors.border,
    },
    socialIconBox: {
        width: 26,
        height: 26,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    socialIconText: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: '900',
    },
    socialLabel: {
        fontSize: FontSize.sm,
        fontWeight: '700',
        color: Colors.textPrimary,
    },

    /* ── Footer ── */
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 28,
    },
    footerPrompt: {
        fontSize: FontSize.md,
        color: Colors.textSecondary,
    },
    footerLink: {
        fontSize: FontSize.md,
        color: Colors.accent,
        fontWeight: '800',
    },
});

export default LoginScreen;