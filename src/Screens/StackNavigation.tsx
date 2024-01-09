import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import WelcomePage from './WelcomePage';
import LoginPage from '../Screens/LoginPage';
import RegistrationPage from './RegisterPage';
import FlatListPage from '../Screens/FlatListPage';
import AddNewPage from '../Screens/AddNewPage';
import Navigatior from '../Screens/Navigatior';
import ViewModelData from '../Screens/ViewModelData';

export type ScreenType = {
  LoginPage: undefined;
  WelcomePage: undefined;
  RegistrationPage: undefined;
  FlatListPage: undefined;
  AddNew: undefined;
  ViewModel: any;
  Accordion: any;
};
const Stack = createNativeStackNavigator<ScreenType>();
function StackNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: 'lightblue', // Set your desired background color
        },
        headerTintColor: '#fff', // Set the color of the text (title, buttons, etc.)
        headerTitleStyle: {
          fontWeight: 'bold', // Customize the font style
        },
      }}>
      {/* <Stack.Screen name="WelcomePage" component={WelcomePage} /> */}
      {/* <Stack.Screen name="WelcomePage" component={WelcomePage} /> */}
      <Stack.Screen
        name="LoginPage"
        component={LoginPage}
        options={{
          headerBackVisible: false, // This removes the back arrow
        }}
      />
      <Stack.Screen name="RegistrationPage" component={RegistrationPage} />
      <Stack.Screen
        name="FlatListPage"
        component={FlatListPage}
        options={{
          headerBackVisible: false, // This removes the back arrow
        }}
      />
      <Stack.Screen name="AddNew" component={AddNewPage} />
      <Stack.Screen name="ViewModel" component={ViewModelData} />
      {/* <Stack.Screen name="Accordion" component={Accordions} /> */}
    </Stack.Navigator>
  );
}

export default StackNavigation;
