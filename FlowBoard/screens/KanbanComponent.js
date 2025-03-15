import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome'
import TodoScreen from './TodoScreen';
import DoingScreen from './DoingScreen';
import DoneScreen from './DoneScreen';
import globalStyles from '../shared/globalStyles';

const Tab = createBottomTabNavigator()

const KanbanComponent = () => {

  const tabOptions = ({ route }) => (
    {
      tabBarActiveTintColor: '#6D72C3',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: [{ display: 'flex' }],
      tabBarStyle: [
        {
          position: 'absolute',
          bottom: -10,
          height: 60,
          backgroundColor: 'white',
          borderTopWidth: 0,
        }
      ],
      tabBarIcon: ({ focused }) => {

        let iconName = ""
        let colorName = focused ? '#6D72C3' : 'gray'

        if (route.name === "To-Do") {
          iconName = focused ? 'list' : 'list'
        } else if (route.name === "Doing") {
          iconName = 'tasks'
        } else if (route.name === "Done") {
          iconName = 'check-circle'
        }

        return (
          <Icon name={iconName} size={25} color={colorName} />
        )

      }
    }
  )

  return (
    // Use NavigationContainer only if you do not have from previous navigations
    // for example: if you are presenting Bottom Tabs as your first screen
    // you must use NavigationContainer
    // <NavigationContainer>

    <SafeAreaProvider>
      <SafeAreaView style={globalStyles.safeArea}>
        <Tab.Navigator screenOptions={tabOptions}>
          <Tab.Screen component={TodoScreen} name='To-Do' />
          <Tab.Screen component={DoingScreen} name='Doing' />
          <Tab.Screen component={DoneScreen} name='Done' />
        </Tab.Navigator>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default KanbanComponent