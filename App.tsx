import React from 'react';
import type {PropsWithChildren} from 'react';
import {StyleSheet, Text, useColorScheme, View} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import StackNavigation from './src/Screens/StackNavigation';
import {NavigationContainer} from '@react-navigation/native';
import {PERMISSIONS} from 'react-native-permissions';
import {PermissionsAndroid, Linking} from 'react-native';
import {Button} from 'react-native-elements';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const requestPermission = async () => {
    console.log('helllo');
    const grand = await PermissionsAndroid.requestMultiple([
      //PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      // PermissionsAndroid.PERMISSIONS.PUSH_NOTIFICATIONS,
      //PermissionsAndroid.PERMISSIONS.ACCESS_FILE_LOCATION,
    ]);
    console.log('granted', grand);
    return grand;
  };
  return (
    // <SafeAreaView style={backgroundStyle}>
    //   <StatusBar />
    //   <ScrollView
    //     contentInsetAdjustmentBehavior="automatic"
    //     style={backgroundStyle}>
    //     <NavigationContainer>
    //       <StackNavigation></StackNavigation>
    //     </NavigationContainer>
    //   </ScrollView>
    // </SafeAreaView>
    <NavigationContainer>
      {/* <Button
        title="Click to permission"
        onPress={async () => {
          requestPermission();
        }}></Button> */}
      <StackNavigation></StackNavigation>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
{
  /* <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View> */
}
