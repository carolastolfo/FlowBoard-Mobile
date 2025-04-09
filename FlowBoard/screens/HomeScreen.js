import { Text, TouchableOpacity, View, StyleSheet, Image } from "react-native";
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
          <TouchableOpacity onPress={handleLogout}>
            <Text style={{ color: '#6D72C3', marginRight: 5 }}>Logout</Text>
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, currentUser]);

  return (
    <>
      {currentUser ? (
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Boards")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Boards</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Stay on Track!</Text>
          <Text style={styles.subTitle}>Plan your day, prioritize tasks, and stay productive — all in one place.</Text>
          <Image
            source={require('../images/intro.gif')}
            style={{ width: 400, height: 400, marginBottom: 20, justifyContent: 'center' }}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#E5D4ED",
    justifyContent: 'center'
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: "#6D72C3",
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: 'center'
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  button: {
    backgroundColor: "#6D72C3",
    padding: 10,
    marginLeft: 10,
    marginBottom: 20,
    borderRadius: 4,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold'
  },
});

export default HomeScreen;
