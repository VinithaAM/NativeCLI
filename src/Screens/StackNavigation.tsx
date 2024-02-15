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
import ForgetPassword from './ForgetPassword';
import OtpScreen from './OtpScreen';
import ChangePassword from './ChangePassword';
import StorageImplementation from './StorageImplementation';
import JailMonkey from './Jail-Monkey';

export type ScreenType = {
  LoginPage: undefined;
  WelcomePage: undefined;
  RegistrationPage: undefined;
  FlatListPage: undefined;
  AddNew: undefined;
  ForgetPassword: undefined;
  OTPPage: undefined;
  ChangePassword: undefined;
  storage: undefined | any;
  samplePage: undefined | any;
  ViewModel: undefined | any;
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
      {/* <Stack.Screen name="samplePage" component={JailMonkey} /> */}
      <Stack.Screen
        name="LoginPage"
        component={LoginPage}
        options={{
          headerBackVisible: false,
          headerTintColor: 'black', // This removes the back arrow
        }}
      />
      <Stack.Screen name="RegistrationPage" component={RegistrationPage}
        options={{
          headerBackVisible: false,
          headerTintColor: 'black', // This removes the back arrow
        }} />
      <Stack.Screen
        name="FlatListPage"
        component={FlatListPage}
        options={{
          headerBackVisible: false,
          headerTintColor: 'black', // This removes the back arrow
        }}
      />
      <Stack.Screen name="AddNew" component={AddNewPage} 
        options={{
          //headerTitle:"Add New Details",
          //headerBackVisible: false,
          headerTintColor: 'black', // This removes the back arrow
        }}/>
      <Stack.Screen
        name="ForgetPassword"
        component={ForgetPassword}
        options={{
          headerBackVisible: false,
          headerTitle: 'Forget Password',
          headerStyle: {
            backgroundColor: 'lightblue',
          },
          headerTintColor: 'black',
        }}
      />
      <Stack.Screen
        name="OTPPage"
        component={OtpScreen}
        options={{
          headerTitle: '',
          headerStyle: {
            backgroundColor: 'lightblue',
          },
          headerTintColor: 'black',
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          headerTitle: 'Change Password',
          headerStyle: {
            backgroundColor: 'lightblue',
          },
          headerTintColor: 'black',
        }}
      />
      <Stack.Screen
        name="storage"
        component={StorageImplementation}
        options={{
          headerTitle: 'Profile',
          headerStyle: {
            backgroundColor: 'lightblue',
          },
          headerTintColor: 'black',
        }}
      />
      <Stack.Screen
        name="ViewModel"
        component={ViewModelData}
        options={{
          headerTitle: 'ViewProfileDetails',
          headerStyle: {
            backgroundColor: 'lightblue',
          },
          headerTintColor: 'black',
        }}
      />
    </Stack.Navigator>
  );
}

export default StackNavigation;
