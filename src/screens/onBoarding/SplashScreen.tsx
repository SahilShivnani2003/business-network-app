import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import { Colors, FontSize } from '../../theme/colors';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';

const { width, height } = Dimensions.get('window');

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Splash'>;
};

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const logoScale = new Animated.Value(0.3);
  const logoOpacity = new Animated.Value(0);
  const taglineOpacity = new Animated.Value(0);
  const dotsOpacity = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, tension: 60, friction: 6, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      Animated.timing(taglineOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(dotsOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Background circles */}
      <View style={styles.circleLarge} />
      <View style={styles.circleSmall} />
      <View style={styles.circleBottom} />

      {/* Logo area */}
      <Animated.View style={[styles.logoContainer, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <View style={styles.logoBox}>
          <Text style={styles.logoI}>i</Text>
          <Text style={styles.logoNext}>NEXT</Text>
        </View>
        <View style={styles.etsBadge}>
          <Text style={styles.etsText}>ETS</Text>
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: taglineOpacity, alignItems: 'center' }}>
        <Text style={styles.fullName}>Education Technologies & Solutions</Text>
        <View style={styles.taglineRow}>
          <Text style={styles.taglineWord}>Connect</Text>
          <Text style={styles.taglineDot}>•</Text>
          <Text style={styles.taglineWord}>Trust</Text>
          <Text style={styles.taglineDot}>•</Text>
          <Text style={styles.taglineWord}>Grow</Text>
        </View>
      </Animated.View>

      {/* Loading dots */}
      <Animated.View style={[styles.loadingContainer, { opacity: dotsOpacity }]}>
        <LoadingDots />
      </Animated.View>

      <Text style={styles.version}>Version 1.0.0</Text>
    </View>
  );
};

const LoadingDots: React.FC = () => {
  const dot1 = new Animated.Value(0.3);
  const dot2 = new Animated.Value(0.3);
  const dot3 = new Animated.Value(0.3);

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(dot1, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(dot1, { toValue: 0.3, duration: 300, useNativeDriver: true }),
      ]).start();
      setTimeout(() => {
        Animated.sequence([
          Animated.timing(dot2, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot2, { toValue: 0.3, duration: 300, useNativeDriver: true }),
        ]).start();
      }, 200);
      setTimeout(() => {
        Animated.sequence([
          Animated.timing(dot3, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot3, { toValue: 0.3, duration: 300, useNativeDriver: true }),
        ]).start();
      }, 400);
    };
    const interval = setInterval(animate, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.dots}>
      {[dot1, dot2, dot3].map((dot, i) => (
        <Animated.View key={i} style={[styles.dot, { opacity: dot }]} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleLarge: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: `${Colors.primaryLight}30`,
    top: -width * 0.4,
    right: -width * 0.3,
  },
  circleSmall: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: `${Colors.accent}20`,
    bottom: height * 0.2,
    left: -40,
  },
  circleBottom: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: `${Colors.primary}25`,
    bottom: -80,
    right: -60,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  logoI: {
    fontSize: 64,
    fontWeight: '900',
    color: Colors.accent,
    fontStyle: 'italic',
    lineHeight: 70,
  },
  logoNext: {
    fontSize: 52,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 3,
  },
  etsBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 6,
  },
  etsText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 6,
  },
  fullName: {
    color: `${Colors.white}90`,
    fontSize: FontSize.md,
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  taglineWord: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: '700',
    letterSpacing: 1,
  },
  taglineDot: {
    color: Colors.accent,
    fontSize: 18,
    fontWeight: '900',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
  },
  version: {
    position: 'absolute',
    bottom: 32,
    color: `${Colors.white}40`,
    fontSize: 11,
  },
});

export default SplashScreen;
