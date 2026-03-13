import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Animated,
  ViewToken,
} from 'react-native';
import { Colors, FontSize, Spacing, BorderRadius } from '../../theme/colors';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/index';

const { width, height } = Dimensions.get('window');

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Onboarding'>;
};

const slides = [
  {
    id: '1',
    icon: '🚀',
    title: 'Grow Your Business',
    subtitle: 'Through Trusted Network',
    description: 'Join thousands of verified business owners and entrepreneurs who are growing together through the power of trusted connections.',
    bg: Colors.primaryDark,
    accent: Colors.accent,
  },
  {
    id: '2',
    icon: '🎯',
    title: 'Get Real Clients',
    subtitle: 'And Premium Leads',
    description: 'Access verified business leads and client requirements directly. Stop chasing cold leads — get warm, relevant opportunities.',
    bg: '#0D2E6E',
    accent: '#FF8F00',
  },
  {
    id: '3',
    icon: '🤝',
    title: 'Connect With',
    subtitle: 'Verified Business Owners',
    description: 'Every member is verified. Build authentic business relationships with trustworthy partners, clients, and collaborators.',
    bg: '#1A1060',
    accent: Colors.accent,
  },
  {
    id: '4',
    icon: '🌐',
    title: 'Join Groups',
    subtitle: 'And Attend Events',
    description: 'Be part of industry WhatsApp groups, offline networking events, and online webinars. Expand your reach nationwide.',
    bg: '#0B3A2D',
    accent: '#34D399',
  },
];

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('Login');
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]) setCurrentIndex(viewableItems[0].index || 0);
  }).current;

  const bg = slides[currentIndex]?.bg || Colors.primaryDark;
  const accent = slides[currentIndex]?.accent || Colors.accent;

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle="light-content" backgroundColor={bg} />

      {/* Skip button */}
      <TouchableOpacity style={styles.skipBtn} onPress={() => navigation.replace('Login')}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={[styles.iconContainer, { backgroundColor: `${item.accent}20`, borderColor: `${item.accent}40` }]}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <Text style={[styles.title, { color: item.accent }]}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dotsRow}>
        {slides.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const dotWidth = scrollX.interpolate({ inputRange, outputRange: [8, 24, 8], extrapolate: 'clamp' });
          const dotOpacity = scrollX.interpolate({ inputRange, outputRange: [0.4, 1, 0.4], extrapolate: 'clamp' });
          return (
            <Animated.View key={i} style={[styles.dot, { width: dotWidth, opacity: dotOpacity, backgroundColor: accent }]} />
          );
        })}
      </View>

      {/* Bottom buttons */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: accent }]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>
            {currentIndex === slides.length - 1 ? 'Get Started →' : 'Next →'}
          </Text>
        </TouchableOpacity>

        {currentIndex === slides.length - 1 && (
          <View style={styles.authRow}>
            <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.replace('Login')}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.registerBtn, { borderColor: `${Colors.white}50` }]} onPress={() => navigation.replace('Signup')}>
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  skipBtn: { position: 'absolute', top: 52, right: 24, zIndex: 10, padding: 8 },
  skipText: { color: `${Colors.white}70`, fontSize: FontSize.sm, fontWeight: '600' },
  slide: { width, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingTop: 80 },
  iconContainer: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 36, borderWidth: 2 },
  icon: { fontSize: 56 },
  title: { fontSize: FontSize.xxxl, fontWeight: '900', textAlign: 'center', letterSpacing: 0.5 },
  subtitle: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.white, textAlign: 'center', marginBottom: 20 },
  description: { fontSize: FontSize.md, color: `${Colors.white}80`, textAlign: 'center', lineHeight: 26 },
  dotsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 24 },
  dot: { height: 8, borderRadius: 4 },
  bottomSection: { paddingHorizontal: 28, paddingBottom: 48 },
  nextBtn: { borderRadius: BorderRadius.lg, paddingVertical: 16, alignItems: 'center', marginBottom: 16 },
  nextBtnText: { color: Colors.white, fontSize: FontSize.lg, fontWeight: '800', letterSpacing: 0.5 },
  authRow: { flexDirection: 'row', gap: 12 },
  loginBtn: { flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.md, paddingVertical: 14, alignItems: 'center' },
  loginText: { color: Colors.primaryDark, fontSize: FontSize.md, fontWeight: '700' },
  registerBtn: { flex: 1, borderWidth: 1.5, borderRadius: BorderRadius.md, paddingVertical: 14, alignItems: 'center' },
  registerText: { color: Colors.white, fontSize: FontSize.md, fontWeight: '700' },
});

export default OnboardingScreen;
