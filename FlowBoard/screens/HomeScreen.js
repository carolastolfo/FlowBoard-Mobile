import { 
    Text,
    TouchableOpacity
 } from "react-native"

const HomeScreen = ( {navigation} ) => {
    return (
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text >Log In</Text>
      </TouchableOpacity>
    )
    
}

export default HomeScreen