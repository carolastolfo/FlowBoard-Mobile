import { View, Text, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
    return (
        <View>
          <Text>Home</Text>
          <Button title="Login" onPress={() => navigation.navigate('Login')} />
          <Button title="Register" onPress={() => navigation.navigate('Register')} />
          <Button title="Boards" onPress={() => navigation.navigate('Boards')} />
        </View>
      );

}

export default HomeScreen