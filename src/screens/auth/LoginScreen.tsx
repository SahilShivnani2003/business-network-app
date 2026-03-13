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
  Dimensions,
} from 'react-native';
import { Colors, FontSize, Spacing, BorderRadius, Shadow } from '../../theme/colors';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { Button } from '../../components/ui/Button';

const { height } = Dimensions.get('window');

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

type LoginMethod = 'otp' | 'email';

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [method, setMethod] = useState<LoginMethod>('otp');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleLogin = () => {
    navigation.replace('Main');
  };

  const handleSendOtp = () => {
    setOtpSent(true);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoMini}>
            <Text style={styles.logoI}>i</Text>
            <Text style={styles.logoNext}>NEXT</Text>
            <View style={styles.etsBadge}><Text style={styles.etsText}>ETS</Text></View>
          </View>
          <Text style={styles.welcomeTitle}>Welcome Back!</Text>
          <Text style={styles.welcomeSub}>Sign in to your business network</Text>
        </View>

        {/* Method tabs */}
        <View style={styles.methodTabs}>
          {(['otp', 'email'] as LoginMethod[]).map(m => (
            <TouchableOpacity
              key={m}
              style={[styles.methodTab, method === m && styles.methodTabActive]}
              onPress={() => { setMethod(m); setOtpSent(false); }}
            >
              <Text style={[styles.methodTabText, method === m && styles.methodTabTextActive]}>
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
                value={phone}
                onChangeText={setPhone}
                placeholder="+91 98765 43210"
                keyboardType="phone-pad"
                prefix="+91"
              />
              {!otpSent ? (
                <Button label="Send OTP" onPress={handleSendOtp} variant="primary" fullWidth size="lg" />
              ) : (
                <>
                  <InputField label="Enter OTP" value={otp} onChangeText={setOtp} placeholder="• • • • • •" keyboardType="number-pad" />
                  <Button label="Verify & Login" onPress={handleLogin} variant="primary" fullWidth size="lg" />
                  <TouchableOpacity style={styles.resendBtn}>
                    <Text style={styles.resendText}>Resend OTP in 30s</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          ) : (
            <>
              <InputField label="Email Address" value={email} onChangeText={setEmail} placeholder="you@company.com" keyboardType="email-address" />
              <InputField label="Password" value={password} onChangeText={setPassword} placeholder="Enter password" secureTextEntry />
              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
              <Button label="Login" onPress={handleLogin} variant="primary" fullWidth size="lg" />
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
          <SocialButton label="Google" icon="G" color="#EA4335" onPress={handleLogin} />
          <SocialButton label="LinkedIn" icon="in" color="#0A66C2" onPress={handleLogin} />
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

const InputField: React.FC<{
  label: string; value: string; onChangeText: (t: string) => void;
  placeholder?: string; secureTextEntry?: boolean; keyboardType?: any; prefix?: string;
}> = ({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, prefix }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputWrapper}>
      {prefix && <Text style={styles.inputPrefix}>{prefix}</Text>}
      <TextInput
        style={[styles.input, prefix && styles.inputWithPrefix]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType || 'default'}
        autoCapitalize="none"
      />
    </View>
  </View>
);

const SocialButton: React.FC<{ label: string; icon: string; color: string; onPress: () => void }> = ({ label, icon, color, onPress }) => (
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
  etsBadge: { backgroundColor: Colors.accent, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginLeft: 4, marginBottom: 2 },
  etsText: { color: Colors.white, fontSize: 10, fontWeight: '900', letterSpacing: 3 },
  welcomeTitle: { fontSize: FontSize.xxxl, fontWeight: '900', color: Colors.textPrimary, marginBottom: 6 },
  welcomeSub: { fontSize: FontSize.md, color: Colors.textSecondary },
  methodTabs: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: 4, marginBottom: Spacing.lg, ...Shadow.card },
  methodTab: { flex: 1, paddingVertical: 10, borderRadius: BorderRadius.md, alignItems: 'center' },
  methodTabActive: { backgroundColor: Colors.primary },
  methodTabText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '600' },
  methodTabTextActive: { color: Colors.white },
  form: { gap: 4 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, ...Shadow.card },
  input: { flex: 1, paddingHorizontal: 16, paddingVertical: 14, fontSize: FontSize.md, color: Colors.textPrimary },
  inputWithPrefix: { paddingLeft: 4 },
  inputPrefix: { paddingLeft: 16, fontSize: FontSize.md, color: Colors.textSecondary, fontWeight: '600' },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 20, marginTop: -8 },
  forgotText: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: '600' },
  resendBtn: { alignItems: 'center', marginTop: 12 },
  resendText: { color: Colors.textMuted, fontSize: FontSize.sm },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontSize: FontSize.sm, color: Colors.textMuted },
  socialRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  socialBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.surface, borderRadius: BorderRadius.md, paddingVertical: 13, borderWidth: 1.5, borderColor: Colors.border, ...Shadow.card },
  socialIcon: { width: 24, height: 24, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  socialIconText: { color: Colors.white, fontSize: 12, fontWeight: '900' },
  socialLabel: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary },
  registerRow: { flexDirection: 'row', justifyContent: 'center' },
  registerPrompt: { fontSize: FontSize.md, color: Colors.textSecondary },
  registerLink: { fontSize: FontSize.md, color: Colors.primary, fontWeight: '700' },
});

export default LoginScreen;
