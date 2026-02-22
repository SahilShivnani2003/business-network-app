import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Radius, Spacing, Typography } from '../theme/theme';

const Header = ({
  title,
  subtitle,
  showLogo = false,
  showBack = false,
  showNotification = true,
  onBack,
  navigation,
  rightComponent,
}:any) => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.blueDark} />
      <LinearGradient
        colors={['#0D3E82', '#1565C0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.container}
      >
        <View style={styles.inner}>
          {/* Left Side */}
          <View style={styles.left}>
            {showBack ? (
              <TouchableOpacity
                onPress={onBack || (() => navigation?.goBack())}
                style={styles.backBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.backIcon}>←</Text>
              </TouchableOpacity>
            ) : null}

            {showLogo ? (
              <View style={styles.logoContainer}>
                <View style={styles.logoBox}>
                  <Text style={styles.logoI}>i</Text>
                </View>
                <View style={styles.logoTextContainer}>
                  <Text style={styles.logoNext}>NEXT</Text>
                  <View style={styles.etsBadge}>
                    <Text style={styles.etsText}>ETS</Text>
                  </View>
                </View>
              </View>
            ) : (
              <View>
                <Text style={styles.title}>{title}</Text>
                {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
              </View>
            )}
          </View>

          {/* Right Side */}
          <View style={styles.right}>
            {rightComponent ? (
              rightComponent
            ) : showNotification ? (
              <View style={styles.rightActions}>
                <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
                  <Text style={styles.iconText}>🔔</Text>
                  <View style={styles.notifDot} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.avatarBtn} activeOpacity={0.7}>
                  <LinearGradient
                    colors={[Colors.orange, Colors.orangeLight]}
                    style={styles.avatar}
                  >
                    <Text style={styles.avatarText}>A</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>

        {/* Decorative bottom stripe */}
        <View style={styles.stripe} />
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar?.currentHeight + 8,
    paddingBottom: 14,
    paddingHorizontal: Spacing.md,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  right: {
    alignItems: 'flex-end',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  backIcon: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '600',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    backgroundColor: Colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoI: {
    color: Colors.white,
    fontSize: 26,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  logoTextContainer: {
    flexDirection: 'column',
  },
  logoNext: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
    lineHeight: 22,
  },
  etsBadge: {
    backgroundColor: Colors.orange,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
    alignSelf: 'flex-start',
    marginTop: 1,
  },
  etsText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  title: {
    color: Colors.white,
    fontSize: Typography.lg,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: Typography.xs,
    marginTop: 1,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    position: 'relative',
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.orange,
    borderWidth: 1.5,
    borderColor: Colors.blueDark,
  },
  avatarBtn: {},
  avatar: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  stripe: {
    height: 2,
    backgroundColor: Colors.orange,
    marginTop: 10,
    marginHorizontal: -Spacing.md,
    opacity: 0.6,
  },
});

export default Header;
