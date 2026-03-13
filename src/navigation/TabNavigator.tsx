import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import EventsScreen from '../screens/tabs/EventsScreen';
import HomeScreen from '../screens//tabs/HomeScreen';
import LeadsScreen from '../screens/tabs/LeadsScreen';
import MessagesScreen from '../screens/tabs/MessagesScreen';
import NetworkScreen from '../screens/tabs/NetworkScreen';
import ProfileScreen from '../screens/tabs/ProfileScreen';
import { Colors } from '../theme/colors';
import { MainTabParamList } from '../types';
import Iconions from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<string, { active: string; inactive: string }> = {
    Home: { active: 'home', inactive: 'home-outline' },
    Network: { active: 'account-group', inactive: 'account-group-outline' },
    Leads: { active: 'target', inactive: 'target' },
    Events: { active: 'calendar', inactive: 'calendar-outline' },
    Messages: { active: 'message', inactive: 'message-outline' },
    Profile: { active: 'account', inactive: 'account-outline' },
};

export const MainTabs: React.FC = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: Colors.tabBarActive,
            tabBarInactiveTintColor: Colors.tabBarInactive,
            tabBarLabelStyle: styles.tabBarLabel,
            tabBarIcon: ({ focused, color }) => {
                const icon = focused
                    ? TAB_ICONS[route.name].active
                    : TAB_ICONS[route.name].inactive;

                return (
                    <View style={[styles.tabIconWrapper, focused && styles.tabIconActive]}>
                        <Iconions name={icon} size={22} color={color} />
                    </View>
                );
            },
        })}
    >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Network" component={NetworkScreen} />
        <Tab.Screen name="Leads" component={LeadsScreen} />
        <Tab.Screen name="Events" component={EventsScreen} />
        <Tab.Screen name="Messages" component={MessagesScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
);

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: Colors.tabBarBg,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        height: 72,
        paddingBottom: 10,
        paddingTop: 6,
        elevation: 16,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
    },
    tabBarLabel: {
        fontSize: 10,
        fontWeight: '600',
        marginTop: 2,
    },
    tabIconWrapper: {
        width: 36,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    tabIconActive: {
        backgroundColor: `${Colors.primary}15`,
    },
    tabIcon: {
        fontSize: 20,
    },
});
