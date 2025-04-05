import { 
    Text,
    TouchableOpacity,
    Button,
    View
 } from "react-native"
 import { useLayoutEffect } from "react";
 import { useSelector, useDispatch } from "react-redux";
 import { logoutUser } from "../redux/actions";

 const HomeScreen = ({ navigation }) => {
   
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.usersRoot.currentUser);
  
  const handleLogout = () => {
    dispatch(logoutUser()); 
  //   navigation.reset({
  //     index: 0,
  //     routes: [{ name: 'Login' }],
  //   });
   };
  
   useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => 
        currentUser ? (
          <TouchableOpacity 
            onPress={handleLogout}
          >
            <Text style={{ color: '#007AFF',}}>Logout</Text>
          </TouchableOpacity>
        ) : null
    });
  }, [navigation, currentUser]);

  return (
    <>
      {currentUser ? (
        <View>
          <Button title="Boards" onPress={() => navigation.navigate('Boards')} />
          <Button title="Board" onPress={() => navigation.navigate('KanbanBoard')} />
        </View>
      ) : (
        <View>
        <Button title="Login" onPress={() => navigation.navigate('Login')} />
        <Button title="Register" onPress={() => navigation.navigate('Register')} />
        </View>
      )}
    </>
  );
};

export default HomeScreen;