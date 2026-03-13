import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

// Auth screens
import SplashScreen from '../screens/onBoarding/SplashScreen';
import OnboardingScreen from '../screens/onBoarding/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import { MainTabs } from './TabNavigator';
import { AIMatchScreen } from '../screens/AIMatchScreen';
import { CommunityHelpScreen } from '../screens/CommunityHelpScreen';
import { MemberProfileScreen } from '../screens/MemberProfileScreen';
import { MembershipScreen } from '../screens/MembershipScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { ReferralsScreen } from '../screens/ReferralsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { WhatsAppGroupsScreen } from '../screens/WhatsAppGroupsScreen';
import { RootStackParamList } from '../types/rootStackParamList';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AlertProvider } from '../context/AlertContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <AlertProvider>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Splash" component={SplashScreen} />
                    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Signup" component={SignupScreen} />
                    <Stack.Screen name="Main" component={MainTabs} />
                    <Stack.Screen name="MemberProfile" component={MemberProfileScreen} />
                    <Stack.Screen name="Notifications" component={NotificationsScreen} />
                    <Stack.Screen name="Membership" component={MembershipScreen} />
                    <Stack.Screen name="WhatsAppGroups" component={WhatsAppGroupsScreen} />
                    <Stack.Screen name="AIMatch" component={AIMatchScreen} />
                    <Stack.Screen name="Referrals" component={ReferralsScreen} />
                    <Stack.Screen name="CommunityHelp" component={CommunityHelpScreen} />
                    <Stack.Screen name="Settings" component={SettingsScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </AlertProvider>
    );
}
