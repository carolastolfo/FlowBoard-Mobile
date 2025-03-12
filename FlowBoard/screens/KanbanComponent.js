import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome'

const Tab = createBottomTabNavigator()

export default KanbanComponent = () => {

  const tabOptions = ({ route }) => (
    {
      tabBarActiveTintColor: 'indigo',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: [{ display: 'flex' }],
      tabBarIcon: ({ focused }) => {

        let iconName = ""
        let colorName = focused ? 'indigo' : 'gray'

        if (route.name === "Profile") {
          iconName = focused ? 'user' : 'user-o'
        } else if (route.name === "Settings") {
          iconName = 'cog'
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

    <Tab.Navigator screenOptions={tabOptions}>
      <Tab.Screen component={ProfileScreen} name='Profile' />
      <Tab.Screen component={SettingsScreen} name='Settings' />
    </Tab.Navigator>
  )
}