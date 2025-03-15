import { 
    Text,
    TouchableOpacity,
    Button,
    View
 } from "react-native"

const HomeScreen = ( {navigation} ) => {
    return (
      <View>
        <Button title="Login" onPress={() => navigation.navigate('Login')} />
        <Button title="Boards" onPress={() => navigation.navigate('Boards')} />
        <Button title="Board" onPress={() => navigation.navigate('KanbanBoard')}/>
        </View>
    )
    
}

export default HomeScreen