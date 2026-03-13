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
    TextInput,
    Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, FontSize, Spacing, BorderRadius, Shadow } from '../../theme/colors';
import { Button } from '../../components/ui/Button';
import { InputField } from '../../components/ui/InputField';
import { RootStackParamList } from '../../types/rootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';
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
import axios from 'axios';

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
    { label: 'Contact & Authentication', subtitle: 'How can we reach you?' },
    { label: 'Company Information', subtitle: 'Tell us about your company' },
    { label: 'Address & Legal Details', subtitle: 'Company location and legal information' },
];

// ─── Step 1 form ──────────────────────────────────────────────────────────────
interface Step1Form {
    email: string;
    password: string;
    contactName: string;
    phone: string;
    website: string;
}

// ─── Step 2 form ──────────────────────────────────────────────────────────────
interface Step2Form {
    companyName: string;
    category: string;
    companyType: string;
    industry: string;
    yearEstablished: string;
    employeeCount: string;
    description: string;
}

// ─── Step 3 form ──────────────────────────────────────────────────────────────
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

type registerProps = NativeStackScreenProps<RootStackParamList, 'Signup'>;
// ─── Main Screen ──────────────────────────────────────────────────────────────
const SignupScreen = ({ navigation }: registerProps) => {
    const alert = useAlert();
    const { login } = useAuthStore();
    const [currentStep, setCurrentStep] = useState(0);
    const [showPassword, setShowPassword] = useState(false);

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
    const [openPicker, setOpenPicker] = useState<string | null>(null);

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

    // ── Helpers ───────────────────────────────────────────────────────────────
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

    // ── Validation ────────────────────────────────────────────────────────────
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
        setCurrentStep(p => p + 1);
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

            debugger
            const response = await companyAPI.register(data);

            if (response.data?.success) {
                alert.success('Register Successfull', 'Your Register successfully.');
                login(response.data?.company, response.data?.token);
                navigation.replace('Main');
            }
        } catch (error: any) {
            alert.error('Registration failed', error?.message || 'Something went wrong');
        }
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

                {/* ── Back ── */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() =>
                            currentStep === 0 ? navigation.goBack() : setCurrentStep(p => p - 1)
                        }
                    >
                        <Ionicons name="arrow-back" size={20} color={Colors.primary} />
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                </View>

                {/* ── Stepper ── */}
                <StepIndicator current={currentStep} total={3} />

                {/* ── Card ── */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{STEPS[currentStep].label}</Text>
                    <Text style={styles.cardSubtitle}>{STEPS[currentStep].subtitle}</Text>

                    {/* ══════════ STEP 1 ══════════ */}
                    {currentStep === 0 && (
                        <View style={styles.formSection}>
                            <View style={styles.row2}>
                                <View style={styles.col}>
                                    <InputField
                                        label="Email Address"
                                        icon="mail-outline"
                                        value={s1.email}
                                        onChangeText={v => upS1('email', v)}
                                        placeholder="test@company.com"
                                        keyboardType="email-address"
                                        required
                                        error={s1Errors.email}
                                        touched={s1Touched.email}
                                    />
                                </View>
                                <View style={styles.col}>
                                    <InputField
                                        label="Password"
                                        icon="lock-closed-outline"
                                        value={s1.password}
                                        onChangeText={v => upS1('password', v)}
                                        placeholder="••••••••••"
                                        secureTextEntry={!showPassword}
                                        trailingIcon={
                                            showPassword ? 'eye-off-outline' : 'eye-outline'
                                        }
                                        onTrailingPress={() => setShowPassword(p => !p)}
                                        required
                                        error={s1Errors.password}
                                        touched={s1Touched.password}
                                    />
                                </View>
                            </View>

                            <View style={styles.row2}>
                                <View style={styles.col}>
                                    <InputField
                                        label="Contact Person Name"
                                        icon="person-outline"
                                        value={s1.contactName}
                                        onChangeText={v => upS1('contactName', v)}
                                        placeholder="John Doe"
                                        autoCapitalize="words"
                                    />
                                </View>
                                <View style={styles.col}>
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
                                </View>
                            </View>

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

                    {/* ══════════ STEP 2 ══════════ */}
                    {currentStep === 1 && (
                        <View style={styles.formSection}>
                            <View style={styles.row2}>
                                <View style={styles.col}>
                                    <InputField
                                        label="Company Name"
                                        icon="business-outline"
                                        value={s2.companyName}
                                        onChangeText={v => upS2('companyName', v)}
                                        placeholder="Enter company name"
                                        autoCapitalize="words"
                                        required
                                        error={s2Errors.companyName}
                                        touched={s2Touched.companyName}
                                    />
                                </View>
                                <View style={styles.col}>
                                    <DropdownField
                                        label="Category"
                                        value={s2.category}
                                        placeholder="Select Category"
                                        options={CATEGORIES}
                                        isOpen={openPicker === 'category'}
                                        onToggle={() =>
                                            setOpenPicker(p =>
                                                p === 'category' ? null : 'category',
                                            )
                                        }
                                        onSelect={v => {
                                            upS2('category', v);
                                            setOpenPicker(null);
                                        }}
                                        required
                                        error={s2Errors.category}
                                        touched={s2Touched.category}
                                    />
                                </View>
                            </View>

                            <View style={styles.row2}>
                                <View style={styles.col}>
                                    <DropdownField
                                        label="Company Type"
                                        value={s2.companyType}
                                        placeholder="Select Company Type"
                                        options={COMPANY_TYPES}
                                        isOpen={openPicker === 'companyType'}
                                        onToggle={() =>
                                            setOpenPicker(p =>
                                                p === 'companyType' ? null : 'companyType',
                                            )
                                        }
                                        onSelect={v => {
                                            upS2('companyType', v);
                                            setOpenPicker(null);
                                        }}
                                    />
                                </View>
                                <View style={styles.col}>
                                    <InputField
                                        label="Industry"
                                        icon="layers-outline"
                                        value={s2.industry}
                                        onChangeText={v => upS2('industry', v)}
                                        placeholder="e.g., Software Development"
                                        autoCapitalize="words"
                                    />
                                </View>
                            </View>

                            <View style={styles.row2}>
                                <View style={styles.col}>
                                    <InputField
                                        label="Year Established"
                                        icon="calendar-outline"
                                        value={s2.yearEstablished}
                                        onChangeText={v => upS2('yearEstablished', v)}
                                        placeholder="2020"
                                        keyboardType="number-pad"
                                        maxLength={4}
                                    />
                                </View>
                                <View style={styles.col}>
                                    <DropdownField
                                        label="Employee Count"
                                        value={s2.employeeCount}
                                        placeholder="Select Employee Count"
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
                                </View>
                            </View>

                            {/* Description textarea */}
                            <Text style={styles.textareaLabel}>BUSINESS DESCRIPTION</Text>
                            <TextInput
                                style={styles.textarea}
                                value={s2.description}
                                onChangeText={v => upS2('description', v)}
                                placeholder="Describe your business, products, and services..."
                                placeholderTextColor={Colors.textMuted}
                                multiline
                                numberOfLines={5}
                                textAlignVertical="top"
                            />
                        </View>
                    )}

                    {/* ══════════ STEP 3 ══════════ */}
                    {currentStep === 2 && (
                        <View style={styles.formSection}>
                            <Text style={styles.sectionHeading}>Company Address</Text>

                            <InputField
                                label="Street Address"
                                icon="location-outline"
                                value={s3.street}
                                onChangeText={v => upS3('street', v)}
                                placeholder="Enter full address"
                                autoCapitalize="sentences"
                                required
                                error={s3Errors.street}
                                touched={s3Touched.street}
                            />

                            <View style={styles.row2}>
                                <View style={styles.col}>
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
                                </View>
                                <View style={styles.col}>
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
                                </View>
                            </View>

                            <View style={styles.row2}>
                                <View style={styles.col}>
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
                                </View>
                                <View style={styles.col}>
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
                                </View>
                            </View>

                            <Text style={[styles.sectionHeading, { marginTop: Spacing.lg }]}>
                                Legal Details
                            </Text>

                            <View style={styles.row2}>
                                <View style={styles.col}>
                                    <InputField
                                        label="GST Number"
                                        value={s3.gst}
                                        onChangeText={v => upS3('gst', v.toUpperCase())}
                                        placeholder="22AAAAA0000A1Z5"
                                        autoCapitalize="characters"
                                        maxLength={15}
                                        hint="Optional"
                                    />
                                </View>
                                <View style={styles.col}>
                                    <InputField
                                        label="PAN Number"
                                        value={s3.pan}
                                        onChangeText={v => upS3('pan', v.toUpperCase())}
                                        placeholder="AAAAA0000A"
                                        autoCapitalize="characters"
                                        maxLength={10}
                                        hint="Optional"
                                    />
                                </View>
                            </View>

                            <View style={styles.row2}>
                                <View style={styles.col}>
                                    <InputField
                                        label="CIN Number"
                                        value={s3.cin}
                                        onChangeText={v => upS3('cin', v.toUpperCase())}
                                        placeholder="L17110DL1995PLC069348"
                                        autoCapitalize="characters"
                                        hint="Optional"
                                    />
                                </View>
                                <View style={styles.col}>
                                    <InputField
                                        label="MSME Number"
                                        value={s3.msme}
                                        onChangeText={v => upS3('msme', v.toUpperCase())}
                                        placeholder="UDYAM-XX-00-0000000"
                                        autoCapitalize="characters"
                                        hint="Optional"
                                    />
                                </View>
                            </View>
                        </View>
                    )}

                    {/* ── Navigation buttons ── */}
                    <View style={styles.navRow}>
                        <TouchableOpacity
                            style={styles.prevBtn}
                            onPress={() =>
                                currentStep === 0 ? navigation.goBack() : setCurrentStep(p => p - 1)
                            }
                        >
                            <Text style={styles.prevBtnText}>Previous</Text>
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
                </View>

                {/* Register link */}
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

// ─── Step Indicator ───────────────────────────────────────────────────────────
const StepIndicator: React.FC<{ current: number; total: number }> = ({ current, total }) => (
    <View style={styles.stepperWrap}>
        {Array.from({ length: total }).map((_, i) => (
            <React.Fragment key={i}>
                <View
                    style={[
                        styles.stepCircle,
                        i < current && styles.stepDone,
                        i === current && styles.stepActive,
                    ]}
                >
                    {i < current ? (
                        <Ionicons name="checkmark" size={14} color={Colors.white} />
                    ) : (
                        <Text style={[styles.stepNum, i === current && styles.stepNumActive]}>
                            {i + 1}
                        </Text>
                    )}
                </View>
                {i < total - 1 && (
                    <View style={[styles.stepLine, i < current && styles.stepLineDone]} />
                )}
            </React.Fragment>
        ))}
    </View>
);

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
    container: { flex: 1, backgroundColor: Colors.background },
    content: { paddingHorizontal: 16, paddingBottom: 48 },

    header: { paddingTop: 52, paddingBottom: 8 },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
    backText: { color: Colors.primary, fontSize: FontSize.md, fontWeight: '600' },

    // Stepper
    stepperWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Spacing.lg,
        paddingHorizontal: Spacing.md,
    },
    stepCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: Colors.border,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepActive: { borderColor: Colors.primary, backgroundColor: Colors.primary },
    stepDone: { borderColor: Colors.primary, backgroundColor: Colors.primary },
    stepNum: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textMuted },
    stepNumActive: { color: Colors.white },
    stepLine: { flex: 1, height: 3, backgroundColor: Colors.border, marginHorizontal: 4 },
    stepLineDone: { backgroundColor: Colors.primary },

    // Card
    card: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        ...Shadow.card,
    },
    cardTitle: {
        fontSize: FontSize.xxl,
        fontWeight: '900',
        color: Colors.textPrimary,
        textAlign: 'center',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: Spacing.lg,
    },

    formSection: { gap: 0 },
    sectionHeading: {
        fontSize: FontSize.md,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
    },

    row2: { flexDirection: 'row', gap: 12 },
    col: { flex: 1 },

    textareaLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: Colors.textSecondary,
        letterSpacing: 0.8,
        marginBottom: 7,
    },
    textarea: {
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.md,
        borderWidth: 1.5,
        borderColor: Colors.border,
        paddingHorizontal: Spacing.md,
        paddingVertical: 12,
        fontSize: FontSize.md,
        color: Colors.textPrimary,
        minHeight: 110,
        marginBottom: Spacing.md,
    },

    navRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Spacing.lg,
    },
    prevBtn: {
        borderWidth: 1.5,
        borderColor: Colors.border,
        borderRadius: BorderRadius.md,
        paddingVertical: 13,
        paddingHorizontal: 24,
    },
    prevBtnText: { fontSize: FontSize.md, color: Colors.textSecondary, fontWeight: '600' },
    nextBtn: { flex: 1, marginLeft: 12 },

    loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.lg },
    loginPrompt: { fontSize: FontSize.md, color: Colors.textSecondary },
    loginLink: { fontSize: FontSize.md, color: Colors.primary, fontWeight: '700' },
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
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1.5,
        borderColor: Colors.border,
        height: 54,
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
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    itemActive: { backgroundColor: `${Colors.primary}10` },
    itemText: { fontSize: FontSize.md, color: Colors.textPrimary },
    itemTextActive: { color: Colors.primary, fontWeight: '700' },
});

export default SignupScreen;
