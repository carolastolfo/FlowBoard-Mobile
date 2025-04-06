import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BoardsScreen from './BoardsScreen';
import BoardsManagingScreen from './BoardsManagingScreen';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const Tab = createBottomTabNavigator();

const BoardsNavigator = () => {
    return (
        <SafeAreaProvider>
                <Tab.Navigator
                    initialRouteName="Boards List"
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ color, size }) => {
                            let iconName = "";
                            if (route.name === 'Boards List') {
                                iconName = 'list';
                            } else if (route.name === 'Manage Join Requests') {
                                iconName = 'settings';
                            }
                            return <MaterialIcons name={iconName} size={size} color={color} />;
                        },
                        tabBarActiveTintColor: '#6D72C3',
                        tabBarInactiveTintColor: 'gray',
                        headerShown: false,
                    })}
                >
                    <Tab.Screen name="Boards List" component={BoardsScreen} />
                    <Tab.Screen name="Manage Join Requests" component={BoardsManagingScreen} />
                </Tab.Navigator>
        </SafeAreaProvider>
    );
};

export default BoardsNavigator;