import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/WelcomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProfileSettingsScreen from './screens/SettingsScreen';
import { ProfileProvider } from './context/ProfileContext';
import SolarPanelScreen from './screens/SolarPanelScreen';
import SolarPanelManagementScreen from './screens/SolarPanelManagementScreen';
import InvestmentCalculatorScreen from './screens/InvestmentCalculatorScreen';


const Stack = createStackNavigator();

const App = () => {
  return (
    <ProfileProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Perfil" component={ProfileScreen} />
          <Stack.Screen name="Configurações do Perfil" component={ProfileSettingsScreen} />
          <Stack.Screen name="SolarPanelScreen" component={SolarPanelScreen} />
          <Stack.Screen name="SolarPanelManagementScreen" component={SolarPanelManagementScreen} />
          <Stack.Screen name="InvestmentCalculatorScreen" component={InvestmentCalculatorScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ProfileProvider>
  );
};

export default App;
