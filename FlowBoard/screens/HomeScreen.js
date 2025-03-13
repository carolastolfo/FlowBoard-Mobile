import { 
    Text,
    TouchableOpacity
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