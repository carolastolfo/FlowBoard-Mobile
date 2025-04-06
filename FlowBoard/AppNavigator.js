import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import KanbanComponent from "./screens/KanbanComponent";
import CreateBoardScreen from "./screens/CreateBoardScreen";

import BoardsNavigator from "./screens/BoardsNavigator";


// Create a stack navigator
const Stack = createNativeStackNavigator();

const AppNavigator = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Home" }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: "Register" }}
        />
        <Stack.Screen
          name="Boards"
          component={BoardsNavigator}
          options={{ title: "Boards" }}
        />
        <Stack.Screen
          name="KanbanBoard"
          component={KanbanComponent}
          options={{ title: "Board" }}
        />
        <Stack.Screen
          name="CreateBoard"
          component={CreateBoardScreen}
          options={{ title: "Create a New Board" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
