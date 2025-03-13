import { 
    Text,
    TouchableOpacity,
    Button
 } from "react-native"

const HomeScreen = ( {navigation} ) => {
    return (
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text >Log In</Text>
        <Button title="Boards" onPress={() => navigation.navigate('Boards')} />
      </TouchableOpacity>
    )
    
}

export default HomeScreen