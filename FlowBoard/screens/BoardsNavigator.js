import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import BoardsScreen from './BoardsScreen';
import BoardsManagingScreen from './BoardsManagingScreen';
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Icon from 'react-native-vector-icons/FontAwesome'
import globalStyles from '../shared/globalStyles';

const Tab = createBottomTabNavigator();

const BoardsNavigator = () => {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={globalStyles.safeArea}>
                <Tab.Navigator
                    initialRouteName="Boards List"
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ color, size }) => {
                            let iconName = "";
                            if (route.name === 'Boards List') {
                                iconName = 'list';
                            } else if (route.name === 'Manage Join Requests') {
                                iconName = 'cog';
                            }
                            return <Icon name={iconName} size={size} color={color} />;
                        },
                        tabBarActiveTintColor: '#6D72C3',
                        tabBarInactiveTintColor: 'gray',
                        headerShown: false,
                        tabBarStyle: [
                            {
                                display: 'flex',
                                position: 'absolute',
                                bottom: -10,
                                height: 60,
                                backgroundColor: 'white',
                                borderTopWidth: 0,
                            }
                        ],
                    })}
                >
                    <Tab.Screen name="Boards List" component={BoardsScreen} />
                    <Tab.Screen name="Manage Join Requests" component={BoardsManagingScreen} />
                </Tab.Navigator>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default BoardsNavigator;