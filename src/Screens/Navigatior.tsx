import React from 'react';
import {StyleSheet, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import WelcomePage from './WelcomePage';
import {createStackNavigator} from '@react-navigation/stack';
import LoginPage from './LoginPage';
import RegistrationPage from './RegisterPage';
import FlatListPage from './FlatListPage';
import SamplePage from './AddNewPage';
// import { MaterialCommunityIcons } from "@expo/vector-icons/";

type ScreenType = {
  LoginPage: undefined;
  WelcomePage: undefined;
  RegistrationPage: undefined;
  FlatListPage: undefined;
  sample: undefined;
};
const Tab = createBottomTabNavigator<ScreenType>();
const Stack = createStackNavigator();
const NavBar = () => {
  return (
    <Tab.Navigator
      initialRouteName="WelcomePage"
      screenOptions={{
        tabBarActiveBackgroundColor: 'aqua',
        tabBarInactiveBackgroundColor: 'yellow',
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'red',
        tabBarLabelStyle: {
          fontSize: 15,
        },
        headerShown: false,
      }}>
      <Tab.Screen
        name="WelcomePage"
        component={WelcomePage}
        options={{
          tabBarLabel: 'Welcome',
          // tabBarIcon: ({ color, size }) => (
          //   <MaterialCommunityIcons
          //     name="home-account"
          //     size={size}
          //     color={color}
          //   />
          // ),
        }}
      />
      <Tab.Screen
        name="LoginPage"
        component={LoginPage}
        options={{
          tabBarLabel: 'LoginPage',
          // tabBarIcon: ({ color, size }) => (
          //   <MaterialCommunityIcons name="login" size={size} color={color} />
          // ),
        }}
      />
      <Tab.Screen
        name="RegistrationPage"
        component={RegistrationPage}
        options={{
          title: 'Registration',
          headerTitleStyle: {
            fontSize: 25,
            color: 'blue',
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: 'pink',
          },
          tabBarLabel: 'RegisterPage',
          // tabBarIcon: ({ color, size }) => (
          //   <MaterialCommunityIcons
          //     name="newspaper-check"
          //     size={size}
          //     color={color}
          //   />
          // ),
        }}
      />
      <Tab.Screen
        name="FlatListPage"
        component={FlatListPage}
        options={{
          tabBarLabel: 'ListPage',
          // tabBarIcon: ({ color, size }) => (
          //   <MaterialCommunityIcons
          //     name="format-list-group"
          //     size={size}
          //     color={color}
          //   />
          // ),
        }}
      />
      {/* <Tab.Screen
        name="sample"
        component={SamplePage}
        options={{ tabBarLabel: "Page" }}
      /> */}
      {/* <Stack.Navigator>
        <Stack.Screen name="Home" component={LoginPage} />
        <Stack.Screen name="Details" component={RegistrationPage} />
      </Stack.Navigator> */}
    </Tab.Navigator>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
});

export default NavBar;
