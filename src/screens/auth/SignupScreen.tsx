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
    TextInput,
    Animated,
    Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, FontSize, Spacing, BorderRadius, Shadow } from '../../theme/colors';
import { Button } from '../../components/ui/Button';
import { InputField } from '../../components/ui/InputField';
import { RootStackParamList } from '../../types/rootStackParamList';
import {
    validate,
    required,
    isEmail,
    isIndianMobile,
    isStrongPassword,
    minLength,
} from '../../utils/validation';
import { companyAPI } from '../../service/apis/companyService';
import { useAlert } from '../../context/AlertContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuthStore } from '../../store/authStore';

const { width } = Dimensions.get('window');

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Real Estate',
    'Retail',
    'Manufacturing',
    'Consulting',
    'Media',
    'Other',
];
const COMPANY_TYPES = [
    'Private Limited',
    'Public Limited',
    'LLP',
    'Partnership',
    'Sole Proprietorship',
    'OPC',
    'NGO',
    'Other',
];
const EMPLOYEE_COUNTS = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];

const STEPS = [
    { label: 'Contact & Auth', subtitle: 'How can we reach you?', icon: '👤' },
    { label: 'Company Info', subtitle: 'Tell us about your company', icon: '🏢' },
    { label: 'Address & Legal', subtitle: 'Location and legal details', icon: '📋' },
];

interface Step1Form {
    email: string;
    password: string;
    contactName: string;
    phone: string;
    website: string;
}
interface Step2Form {
    companyName: string;
    category: string;
    companyType: string;
    industry: string;
    yearEstablished: string;
    employeeCount: string;
    description: string;
}
interface Step3Form {
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    gst: string;
    pan: string;
    cin: string;
    msme: string;
}

type RegisterProps = NativeStackScreenProps<RootStackParamList, 'Signup'>;

const SignupScreen = ({ navigation }: RegisterProps) => {
    const alert = useAlert();
    const { login } = useAuthStore();
    const [currentStep, setCurrentStep] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [openPicker, setOpenPicker] = useState<string | null>(null);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const stepAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
        ]).start();
    }, []);

    const animateStep = () => {
        stepAnim.setValue(0);
        Animated.timing(stepAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start();
    };

    // Step 1
    const [s1, setS1] = useState<Step1Form>({
        email: '',
        password: '',
        contactName: '',
        phone: '',
        website: '',
    });
    const [s1Touched, setS1Touched] = useState<Record<keyof Step1Form, boolean>>({
        email: false,
        password: false,
        contactName: false,
        phone: false,
        website: false,
    });

    // Step 2
    const [s2, setS2] = useState<Step2Form>({
        companyName: '',
        category: '',
        companyType: '',
        industry: '',
        yearEstablished: '',
        employeeCount: '',
        description: '',
    });
    const [s2Touched, setS2Touched] = useState<Record<keyof Step2Form, boolean>>({
        companyName: false,
        category: false,
        companyType: false,
        industry: false,
        yearEstablished: false,
        employeeCount: false,
        description: false,
    });

    // Step 3
    const [s3, setS3] = useState<Step3Form>({
        street: '',
        city: '',
        state: '',
        country: 'India',
        pincode: '',
        gst: '',
        pan: '',
        cin: '',
        msme: '',
    });
    const [s3Touched, setS3Touched] = useState<Record<keyof Step3Form, boolean>>({
        street: false,
        city: false,
        state: false,
        country: false,
        pincode: false,
        gst: false,
        pan: false,
        cin: false,
        msme: false,
    });

    const upS1 = (k: keyof Step1Form, v: string) => {
        setS1(p => ({ ...p, [k]: v }));
        setS1Touched(p => ({ ...p, [k]: false }));
    };
    const upS2 = (k: keyof Step2Form, v: string) => {
        setS2(p => ({ ...p, [k]: v }));
        setS2Touched(p => ({ ...p, [k]: false }));
    };
    const upS3 = (k: keyof Step3Form, v: string) => {
        setS3(p => ({ ...p, [k]: v }));
        setS3Touched(p => ({ ...p, [k]: false }));
    };

    const s1Errors = {
        email: validate(s1.email, [required(), isEmail()]),
        password: validate(s1.password, [required(), isStrongPassword()]),
        contactName: validate(s1.contactName, []),
        phone: validate(s1.phone, [required(), isIndianMobile()]),
        website: undefined,
    };
    const s2Errors = {
        companyName: validate(s2.companyName, [required('Company name is required')]),
        category: validate(s2.category, [required('Please select a category')]),
        companyType: undefined,
        industry: undefined,
        yearEstablished: undefined,
        employeeCount: undefined,
        description: undefined,
    };
    const s3Errors = {
        street: validate(s3.street, [required('Street address is required')]),
        city: validate(s3.city, [required('City is required')]),
        state: validate(s3.state, [required('State is required')]),
        country: validate(s3.country, [required()]),
        pincode: validate(s3.pincode, [
            required('Pincode is required'),
            minLength(6, 'Enter valid 6-digit pincode'),
        ]),
        gst: undefined,
        pan: undefined,
        cin: undefined,
        msme: undefined,
    };

    const touchAllS1 = () =>
        setS1Touched({
            email: true,
            password: true,
            contactName: true,
            phone: true,
            website: true,
        });
    const touchAllS2 = () =>
        setS2Touched({
            companyName: true,
            category: true,
            companyType: true,
            industry: true,
            yearEstablished: true,
            employeeCount: true,
            description: true,
        });
    const touchAllS3 = () =>
        setS3Touched({
            street: true,
            city: true,
            state: true,
            country: true,
            pincode: true,
            gst: true,
            pan: true,
            cin: true,
            msme: true,
        });

    const s1Valid = !s1Errors.email && !s1Errors.password && !s1Errors.phone;
    const s2Valid = !s2Errors.companyName && !s2Errors.category;
    const s3Valid =
        !s3Errors.street &&
        !s3Errors.city &&
        !s3Errors.state &&
        !s3Errors.country &&
        !s3Errors.pincode;

    const handleNext = () => {
        if (currentStep === 0) {
            touchAllS1();
            if (!s1Valid) return;
        }
        if (currentStep === 1) {
            touchAllS2();
            if (!s2Valid) return;
        }
        animateStep();
        setCurrentStep(p => p + 1);
    };

    const handleBack = () => {
        if (currentStep === 0) {
            navigation.goBack();
            return;
        }
        animateStep();
        setCurrentStep(p => p - 1);
    };

    const handleSubmit = async () => {
        touchAllS3();
        if (!s3Valid) return;
        try {
            const data = {
                email: s1.email,
                password: s1.password,
                companyName: s2.companyName,
                category: s2.category,
                industry: s2.industry,
                businessDescription: s2.description,
                yearEstablished: s2.yearEstablished,
                employeeCount: s2.employeeCount,
                contactPersonName: s1.contactName,
                phone: s1.phone,
                website: s1.website,
                address: s3.street,
                legalDetails: s3.msme,
                serviceOffered: '',
                socialLinks: '',
            };
            const response = await companyAPI.register(data);
            if (response.data?.success) {
                alert.success('Registration Successful', 'Your company is registered.');
                login(response.data?.company, response.data?.token);
                navigation.replace('Main');
            }
        } catch (error: any) {
            alert.error('Registration Failed', error?.message || 'Something went wrong');
        }
    };

    const stepSlide = stepAnim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });
    const stepOpacity = stepAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

            {/* Header */}
            <View style={styles.headerBg}>
                <View style={styles.circle1} />
                <View style={styles.circle2} />
                <View style={styles.circle3} />

                <Animated.View
                    style={[
                        styles.headerContent,
                        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                    ]}
                >
                    {/* Back button */}
                    <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
                        <Ionicons name="arrow-back" size={18} color="rgba(255,255,255,0.85)" />
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>

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

                    <Text style={styles.welcomeTitle}>Create Account</Text>
                    <Text style={styles.welcomeSub}>Join India's business network</Text>
                </Animated.View>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Step Indicator */}
                <Animated.View style={{ opacity: fadeAnim }}>
                    <StepIndicator current={currentStep} steps={STEPS} />
                </Animated.View>

                {/* Step label card */}
                <Animated.View
                    style={[
                        styles.stepLabelCard,
                        {
                            opacity: stepAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.6, 1],
                            }),
                        },
                    ]}
                >
                    <View style={styles.stepIconBadge}>
                        <Text style={styles.stepIconText}>{STEPS[currentStep].icon}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.stepTitle}>{STEPS[currentStep].label}</Text>
                        <Text style={styles.stepSubtitle}>{STEPS[currentStep].subtitle}</Text>
                    </View>
                    <Text style={styles.stepCounter}>{currentStep + 1}/3</Text>
                </Animated.View>

                {/* Form Card */}
                <Animated.View
                    style={[
                        styles.card,
                        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                    ]}
                >
                    {/* STEP 1 */}
                    {currentStep === 0 && (
                        <View style={styles.formSection}>
                            <InputField
                                label="Email Address"
                                icon="mail-outline"
                                value={s1.email}
                                onChangeText={v => upS1('email', v)}
                                placeholder="you@company.com"
                                keyboardType="email-address"
                                required
                                error={s1Errors.email}
                                touched={s1Touched.email}
                            />
                            <InputField
                                label="Password"
                                icon="lock-closed-outline"
                                value={s1.password}
                                onChangeText={v => upS1('password', v)}
                                placeholder="Minimum 8 characters"
                                secureTextEntry={!showPassword}
                                trailingIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                onTrailingPress={() => setShowPassword(p => !p)}
                                required
                                error={s1Errors.password}
                                touched={s1Touched.password}
                            />
                            <InputField
                                label="Contact Person Name"
                                icon="person-outline"
                                value={s1.contactName}
                                onChangeText={v => upS1('contactName', v)}
                                placeholder="Full name"
                                autoCapitalize="words"
                            />
                            <InputField
                                label="Phone Number"
                                icon="call-outline"
                                value={s1.phone}
                                onChangeText={v => upS1('phone', v)}
                                placeholder="9876543210"
                                keyboardType="phone-pad"
                                maxLength={10}
                                required
                                error={s1Errors.phone}
                                touched={s1Touched.phone}
                            />
                            <InputField
                                label="Website"
                                icon="globe-outline"
                                value={s1.website}
                                onChangeText={v => upS1('website', v)}
                                placeholder="https://www.yourcompany.com"
                                keyboardType="url"
                            />
                        </View>
                    )}

                    {/* STEP 2 */}
                    {currentStep === 1 && (
                        <View style={styles.formSection}>
                            <InputField
                                label="Company Name"
                                icon="business-outline"
                                value={s2.companyName}
                                onChangeText={v => upS2('companyName', v)}
                                placeholder="Acme Corp"
                                autoCapitalize="words"
                                required
                                error={s2Errors.companyName}
                                touched={s2Touched.companyName}
                            />
                            <DropdownField
                                label="Category"
                                value={s2.category}
                                placeholder="Select Category"
                                options={CATEGORIES}
                                isOpen={openPicker === 'category'}
                                onToggle={() =>
                                    setOpenPicker(p => (p === 'category' ? null : 'category'))
                                }
                                onSelect={v => {
                                    upS2('category', v);
                                    setOpenPicker(null);
                                }}
                                required
                                error={s2Errors.category}
                                touched={s2Touched.category}
                            />
                            <DropdownField
                                label="Company Type"
                                value={s2.companyType}
                                placeholder="Select Company Type"
                                options={COMPANY_TYPES}
                                isOpen={openPicker === 'companyType'}
                                onToggle={() =>
                                    setOpenPicker(p => (p === 'companyType' ? null : 'companyType'))
                                }
                                onSelect={v => {
                                    upS2('companyType', v);
                                    setOpenPicker(null);
                                }}
                            />
                            <InputField
                                label="Industry"
                                icon="layers-outline"
                                value={s2.industry}
                                onChangeText={v => upS2('industry', v)}
                                placeholder="e.g. Software Development"
                                autoCapitalize="words"
                            />
                            <InputField
                                label="Year Established"
                                icon="calendar-outline"
                                value={s2.yearEstablished}
                                onChangeText={v => upS2('yearEstablished', v)}
                                placeholder="2020"
                                keyboardType="number-pad"
                                maxLength={4}
                            />
                            <DropdownField
                                label="Employee Count"
                                value={s2.employeeCount}
                                placeholder="Select Employee Range"
                                options={EMPLOYEE_COUNTS}
                                isOpen={openPicker === 'employeeCount'}
                                onToggle={() =>
                                    setOpenPicker(p =>
                                        p === 'employeeCount' ? null : 'employeeCount',
                                    )
                                }
                                onSelect={v => {
                                    upS2('employeeCount', v);
                                    setOpenPicker(null);
                                }}
                            />
                            <View style={styles.textareaWrapper}>
                                <Text style={styles.textareaLabel}>BUSINESS DESCRIPTION</Text>
                                <TextInput
                                    style={styles.textarea}
                                    value={s2.description}
                                    onChangeText={v => upS2('description', v)}
                                    placeholder="Describe your business, products, and services..."
                                    placeholderTextColor={Colors.textMuted}
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                />
                            </View>
                        </View>
                    )}

                    {/* STEP 3 */}
                    {currentStep === 2 && (
                        <View style={styles.formSection}>
                            <SectionHeader label="Company Address" icon="location-outline" />
                            <InputField
                                label="Street Address"
                                icon="location-outline"
                                value={s3.street}
                                onChangeText={v => upS3('street', v)}
                                placeholder="Enter full street address"
                                autoCapitalize="sentences"
                                required
                                error={s3Errors.street}
                                touched={s3Touched.street}
                            />
                            <InputField
                                label="City"
                                value={s3.city}
                                onChangeText={v => upS3('city', v)}
                                placeholder="Mumbai"
                                autoCapitalize="words"
                                required
                                error={s3Errors.city}
                                touched={s3Touched.city}
                            />
                            <InputField
                                label="State"
                                value={s3.state}
                                onChangeText={v => upS3('state', v)}
                                placeholder="Maharashtra"
                                autoCapitalize="words"
                                required
                                error={s3Errors.state}
                                touched={s3Touched.state}
                            />
                            <InputField
                                label="Country"
                                value={s3.country}
                                onChangeText={v => upS3('country', v)}
                                placeholder="India"
                                autoCapitalize="words"
                                required
                                error={s3Errors.country}
                                touched={s3Touched.country}
                            />
                            <InputField
                                label="Pincode"
                                value={s3.pincode}
                                onChangeText={v => upS3('pincode', v)}
                                placeholder="400001"
                                keyboardType="number-pad"
                                maxLength={6}
                                required
                                error={s3Errors.pincode}
                                touched={s3Touched.pincode}
                            />
                            <SectionHeader label="Legal Details" icon="shield-checkmark-outline" />
                            <InputField
                                label="GST Number"
                                value={s3.gst}
                                onChangeText={v => upS3('gst', v.toUpperCase())}
                                placeholder="22AAAAA0000A1Z5"
                                autoCapitalize="characters"
                                maxLength={15}
                                hint="Optional"
                            />
                            <InputField
                                label="PAN Number"
                                value={s3.pan}
                                onChangeText={v => upS3('pan', v.toUpperCase())}
                                placeholder="AAAAA0000A"
                                autoCapitalize="characters"
                                maxLength={10}
                                hint="Optional"
                            />
                            <InputField
                                label="CIN Number"
                                value={s3.cin}
                                onChangeText={v => upS3('cin', v.toUpperCase())}
                                placeholder="L17110DL1995PLC069348"
                                autoCapitalize="characters"
                                hint="Optional"
                            />
                            <InputField
                                label="MSME Number"
                                value={s3.msme}
                                onChangeText={v => upS3('msme', v.toUpperCase())}
                                placeholder="UDYAM-XX-00-0000000"
                                autoCapitalize="characters"
                                hint="Optional"
                            />
                        </View>
                    )}

                    {/* Navigation */}
                    <View style={styles.navRow}>
                        <TouchableOpacity style={styles.prevBtn} onPress={handleBack}>
                            <Ionicons name="arrow-back" size={16} color={Colors.textSecondary} />
                            <Text style={styles.prevBtnText}>
                                {currentStep === 0 ? 'Login' : 'Back'}
                            </Text>
                        </TouchableOpacity>

                        {currentStep < 2 ? (
                            <Button
                                label="Next →"
                                onPress={handleNext}
                                variant="primary"
                                size="lg"
                                style={styles.nextBtn}
                            />
                        ) : (
                            <Button
                                label="✓  Register Company"
                                onPress={handleSubmit}
                                variant="accent"
                                size="lg"
                                style={styles.nextBtn}
                            />
                        )}
                    </View>
                </Animated.View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerPrompt}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.replace('Login')}>
                        <Text style={styles.footerLink}>Login →</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

// ─── Section Header ────────────────────────────────────────────────────────────
const SectionHeader: React.FC<{ label: string; icon: string }> = ({ label, icon }) => (
    <View style={secStyles.wrap}>
        <View style={secStyles.iconBox}>
            <Ionicons name={icon as any} size={14} color={Colors.primary} />
        </View>
        <Text style={secStyles.label}>{label}</Text>
        <View style={secStyles.line} />
    </View>
);
const secStyles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: Spacing.md,
        marginTop: Spacing.sm,
    },
    iconBox: {
        width: 26,
        height: 26,
        borderRadius: 8,
        backgroundColor: `${Colors.primary}14`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: FontSize.sm,
        fontWeight: '800',
        color: Colors.textPrimary,
        letterSpacing: 0.3,
    },
    line: { flex: 1, height: 1, backgroundColor: Colors.border },
});

// ─── Step Indicator ───────────────────────────────────────────────────────────
const StepIndicator: React.FC<{ current: number; steps: typeof STEPS }> = ({ current, steps }) => (
    <View style={stepStyles.wrap}>
        {steps.map((s, i) => (
            <React.Fragment key={i}>
                <View style={stepStyles.stepCol}>
                    <View
                        style={[
                            stepStyles.circle,
                            i < current && stepStyles.done,
                            i === current && stepStyles.active,
                        ]}
                    >
                        {i < current ? (
                            <Ionicons name="checkmark" size={14} color={Colors.white} />
                        ) : (
                            <Text style={[stepStyles.num, i === current && stepStyles.numActive]}>
                                {i + 1}
                            </Text>
                        )}
                    </View>
                    <Text
                        style={[stepStyles.stepLabel, i === current && stepStyles.stepLabelActive]}
                        numberOfLines={1}
                    >
                        {s.label}
                    </Text>
                </View>
                {i < steps.length - 1 && (
                    <View style={[stepStyles.line, i < current && stepStyles.lineDone]} />
                )}
            </React.Fragment>
        ))}
    </View>
);
const stepStyles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: Spacing.md,
        paddingHorizontal: 4,
    },
    stepCol: { alignItems: 'center', gap: 5, width: 72 },
    circle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: Colors.border,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    active: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    done: { borderColor: Colors.primary, backgroundColor: Colors.primary },
    num: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textMuted },
    numActive: { color: Colors.white },
    stepLabel: {
        fontSize: 9,
        fontWeight: '600',
        color: Colors.textMuted,
        textAlign: 'center',
        letterSpacing: 0.2,
    },
    stepLabelActive: { color: Colors.primary, fontWeight: '800' },
    line: {
        flex: 1,
        height: 2,
        backgroundColor: Colors.border,
        marginTop: 17,
        marginHorizontal: 2,
    },
    lineDone: { backgroundColor: Colors.primary },
});

// ─── Dropdown Field ───────────────────────────────────────────────────────────
interface DropdownFieldProps {
    label: string;
    value: string;
    placeholder: string;
    options: string[];
    isOpen: boolean;
    onToggle: () => void;
    onSelect: (v: string) => void;
    required?: boolean;
    error?: string;
    touched?: boolean;
}
const DropdownField: React.FC<DropdownFieldProps> = ({
    label,
    value,
    placeholder,
    options,
    isOpen,
    onToggle,
    onSelect,
    required,
    error,
    touched,
}) => {
    const showError = touched && !!error;
    return (
        <View style={dropStyles.wrap}>
            <Text style={[dropStyles.label, showError && dropStyles.labelError]}>
                {label.toUpperCase()}
                {required && <Text style={dropStyles.star}> *</Text>}
            </Text>
            <TouchableOpacity
                style={[
                    dropStyles.trigger,
                    isOpen && dropStyles.triggerOpen,
                    showError && dropStyles.triggerError,
                ]}
                onPress={onToggle}
                activeOpacity={0.85}
            >
                <Text style={[dropStyles.triggerText, !value && dropStyles.placeholder]}>
                    {value || placeholder}
                </Text>
                <Ionicons
                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={Colors.textMuted}
                />
            </TouchableOpacity>
            {showError && (
                <View style={dropStyles.errorRow}>
                    <Ionicons name="alert-circle" size={12} color={Colors.error} />
                    <Text style={dropStyles.errorText}>{error}</Text>
                </View>
            )}
            {isOpen && (
                <View style={dropStyles.menu}>
                    <ScrollView
                        nestedScrollEnabled
                        style={{ maxHeight: 200 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {options.map(opt => (
                            <TouchableOpacity
                                key={opt}
                                style={[dropStyles.item, value === opt && dropStyles.itemActive]}
                                onPress={() => onSelect(opt)}
                            >
                                <Text
                                    style={[
                                        dropStyles.itemText,
                                        value === opt && dropStyles.itemTextActive,
                                    ]}
                                >
                                    {opt}
                                </Text>
                                {value === opt && (
                                    <Ionicons name="checkmark" size={14} color={Colors.primary} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    headerBg: {
        backgroundColor: Colors.primaryDark,
        paddingTop: 52,
        paddingBottom: 48,
        paddingHorizontal: 28,
        overflow: 'hidden',
        position: 'relative',
    },
    circle1: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: Colors.primaryLight,
        opacity: 0.15,
        top: -60,
        right: -60,
    },
    circle2: {
        position: 'absolute',
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: Colors.accent,
        opacity: 0.12,
        bottom: -30,
        left: -30,
    },
    circle3: {
        position: 'absolute',
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: Colors.accentLight,
        opacity: 0.1,
        top: 28,
        left: width / 2,
    },
    headerContent: { zIndex: 10 },

    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        alignSelf: 'flex-start',
        marginBottom: 20,
        paddingVertical: 4,
    },
    backText: { color: 'rgba(255,255,255,0.85)', fontSize: FontSize.sm, fontWeight: '600' },

    logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
    logoIconBox: {
        width: 44,
        height: 44,
        borderRadius: 13,
        backgroundColor: Colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadow.button,
    },
    logoIconText: {
        fontSize: 24,
        fontWeight: '900',
        color: Colors.white,
        fontStyle: 'italic',
        lineHeight: 28,
    },
    logoWordmark: { fontSize: 19, fontWeight: '900', color: Colors.white, letterSpacing: 3 },
    etsBadge: {
        backgroundColor: 'rgba(255,255,255,0.18)',
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 1,
        alignSelf: 'flex-start',
        marginTop: 2,
    },
    etsText: { color: Colors.white, fontSize: 9, fontWeight: '800', letterSpacing: 3 },
    welcomeTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: Colors.white,
        letterSpacing: -0.5,
        marginBottom: 4,
    },
    welcomeSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.65)', fontWeight: '500' },

    scrollView: {
        flex: 1,
        backgroundColor: Colors.background,
        marginTop: -20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    scrollContent: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 48 },

    stepLabelCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        padding: 14,
        marginBottom: 14,
        borderLeftWidth: 3,
        borderLeftColor: Colors.accent,
        ...Shadow.card,
    },
    stepIconBadge: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: `${Colors.accent}18`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepIconText: { fontSize: 18 },
    stepTitle: { fontSize: FontSize.md, fontWeight: '800', color: Colors.textPrimary },
    stepSubtitle: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 1 },
    stepCounter: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.accent, opacity: 0.6 },

    card: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        ...Shadow.card,
    },
    formSection: { gap: 18 },
    row2: { flexDirection: 'row', gap: 14 },
    col: { flex: 1, minWidth: 0 },

    textareaWrapper: {},
    textareaLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: Colors.textSecondary,
        letterSpacing: 0.8,
        marginBottom: 8,
    },
    textarea: {
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.md,
        borderWidth: 1.5,
        borderColor: Colors.border,
        paddingHorizontal: Spacing.md,
        paddingVertical: 14,
        fontSize: FontSize.md,
        color: Colors.textPrimary,
        minHeight: 110,
        lineHeight: 22,
    },

    navRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 22,
        gap: 12,
    },
    prevBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        borderWidth: 1.5,
        borderColor: Colors.border,
        borderRadius: BorderRadius.md,
        paddingVertical: 13,
        paddingHorizontal: 18,
    },
    prevBtnText: { fontSize: FontSize.md, color: Colors.textSecondary, fontWeight: '600' },
    nextBtn: { flex: 1 },

    footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24 },
    footerPrompt: { fontSize: FontSize.md, color: Colors.textSecondary },
    footerLink: { fontSize: FontSize.md, color: Colors.accent, fontWeight: '800' },
});

const dropStyles = StyleSheet.create({
    wrap: { marginBottom: Spacing.md },
    label: {
        fontSize: 11,
        fontWeight: '700',
        color: Colors.textSecondary,
        letterSpacing: 0.8,
        marginBottom: 7,
    },
    labelError: { color: Colors.error },
    star: { color: Colors.error, fontWeight: '900' },
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.md,
        borderWidth: 1.5,
        borderColor: Colors.border,
        height: 52,
        paddingHorizontal: Spacing.md,
    },
    triggerOpen: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}08` },
    triggerError: { borderColor: Colors.error, backgroundColor: `${Colors.error}06` },
    triggerText: { fontSize: FontSize.md, color: Colors.textPrimary, flex: 1 },
    placeholder: { color: Colors.textMuted },
    errorRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 },
    errorText: { fontSize: 11, color: Colors.error, fontWeight: '600' },
    menu: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1.5,
        borderColor: Colors.border,
        marginTop: 4,
        ...Shadow.card,
        zIndex: 99,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        paddingVertical: 11,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    itemActive: { backgroundColor: `${Colors.primary}10` },
    itemText: { fontSize: FontSize.md, color: Colors.textPrimary },
    itemTextActive: { color: Colors.primary, fontWeight: '700' },
});

export default SignupScreen;
