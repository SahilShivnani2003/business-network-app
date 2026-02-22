import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Shadow, Radius } from "../theme/theme";
import LinearGradient from "react-native-linear-gradient";
import BlogScreen from "../screens/blogs";
import ContactScreen from "../screens/contact";
import EventsScreen from "../screens/evnet";
import HomeScreen from "../screens/home";
import MembersScreen from "../screens/member";
import PlansScreen from "../screens/plans";
import { NavigationContainer } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const TAB_CONFIG = [
    { name: 'Home', icon: '🏠', label: 'Home' },
    { name: 'Members', icon: '👥', label: 'Members' },
    { name: 'Events', icon: '🎪', label: 'Events' },
    { name: 'Plans', icon: '⭐', label: 'Plans' },
    { name: 'Blog', icon: '📚', label: 'Blog' },
    { name: 'Contact', icon: '💬', label: 'Support' },
];

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
    return (
        <View style={styles.tabBar}>
            <LinearGradient colors={['#FFFFFF', '#F8FAFF']} style={styles.tabBarGrad}>
                {state.routes.map((route: any, index: any) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;
                    const tab = TAB_CONFIG.find(t => t.name === route.name);

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            activeOpacity={0.7}
                            style={styles.tabItem}
                        >
                            {isFocused ? (
                                <LinearGradient
                                    colors={[Colors.orange, Colors.orangeLight]}
                                    style={styles.tabIconActive}
                                >
                                    <Text style={styles.tabIconText}>{tab?.icon}</Text>
                                </LinearGradient>
                            ) : (
                                <View style={styles.tabIconInactive}>
                                    <Text style={styles.tabIconText}>{tab?.icon}</Text>
                                </View>
                            )}
                            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                                {tab?.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </LinearGradient>
        </View>
    );
};

export const MainTabs = () => (
    <NavigationContainer>
        <Tab.Navigator
            tabBar={props => <CustomTabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Members" component={MembersScreen} />
            <Tab.Screen name="Events" component={EventsScreen} />
            <Tab.Screen name="Plans" component={PlansScreen} />
            <Tab.Screen name="Blog" component={BlogScreen} />
            <Tab.Screen name="Contact" component={ContactScreen} />
        </Tab.Navigator>
    </NavigationContainer>
);

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        ...Shadow.dark,
    },
    tabBarGrad: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingHorizontal: 4,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        gap: 3,
        paddingVertical: 4,
    },
    tabIconActive: {
        width: 38,
        height: 38,
        borderRadius: Radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadow.orange,
    },
    tabIconInactive: {
        width: 38,
        height: 38,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIconText: {
        fontSize: 18,
    },
    tabLabel: {
        fontSize: 9,
        color: Colors.gray,
        fontWeight: '500',
    },
    tabLabelActive: {
        color: Colors.orange,
        fontWeight: '700',
    },
});