import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import KanbanScreen from './screens/KanbanScreen';


// Create a stack navigator
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      {/* <Stack.Navigator initialRouteName="Home"> */}
      {/* <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home' }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Login' }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Register' }}
        /> */}

      <Stack.Navigator initialRouteName="Kanban">
        <Stack.Screen
          name="Kanban"
          component={KanbanScreen}
          options={{ title: 'Kanban' }}
        />

        {/* <Stack.Screen 
            name="name" 
            component={SomethingScreen} 
            options={{ title: 'Something' }}
          /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
