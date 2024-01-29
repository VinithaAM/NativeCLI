import React, {useCallback, useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {Alert, StyleSheet, Text, useColorScheme, View} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import StackNavigation from './src/Screens/StackNavigation';
import {NavigationContainer} from '@react-navigation/native';
import {PERMISSIONS} from 'react-native-permissions';
import {PermissionsAndroid, Linking} from 'react-native';
import {Button} from 'react-native-elements';
import messaging, {firebase} from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import {Notifications} from 'react-native-notifications';
import {
  NotificationListner,
  requestuserpermission,
} from './src/Services/push-notification';
import {connectToDatabase, createTables} from './src/Services/Database';

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
  const loadData = useCallback(async () => {
    try {
      const db = await connectToDatabase();
      await createTables(db);
    } catch (error) {
      console.error(error);
    }
  }, []);
  useEffect(() => {
    loadData();
    NotificationListner();
    requestuserpermission();
    requestPermission();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage.notification) {
        Alert.alert(
          'A new FCM message arrived!',
          JSON.stringify(remoteMessage.notification?.body),
        );
      }

      PushNotification.localNotification({
        message: remoteMessage.notification?.body,
        title: remoteMessage.notification?.title,
        bigPictureUrl: remoteMessage.notification?.android?.imageUrl,
        smallIcon: remoteMessage.notification?.android?.imageUrl,
        // channelId: 'Default channel',
      });
      // Notifications.events().registerNotificationReceivedForeground(
      //   (notification, completion) => {
      //     console.log('Notification Received - Foreground', notification);
      //     // Display local notification
      //     Notifications.postLocalNotification({
      //       title: notification.title,
      //       body: notification.body,
      //       sound: 'default',
      //       silent: false,
      //       category: '',
      //       userInfo: {},
      //       // id: notification.id,
      //     });
      //     completion({alert: true, sound: true, badge: true});
      //   },
      // );

      // // Register for remote notifications (FCM)
      // Notifications.registerRemoteNotifications();
      // PushNotification.localNotification({
      //   message: remoteMessage.body,
      //   title: remoteMessage.title,
      //   channelId: 'Default channel',
      //   //   // bigPictureUrl: remoteMessage.notification.android.imageUrl,
      //   //   // smallIcon: remoteMessage.notification.android.imageUrl,
      // });
    });
    // PushNotification.register();
    // return () => {
    //   // Clean up
    //   PushNotification.unregister();
    // };
    return unsubscribe;
  }, [loadData]);

  const requestPermission = async () => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    // const grand = await PermissionsAndroid.requestMultiple([
    //   //PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    //   PermissionsAndroid.PERMISSIONS.CAMERA,
    //   PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    //   PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    //   // PermissionsAndroid.PERMISSIONS.PUSH_NOTIFICATIONS,
    //   //PermissionsAndroid.PERMISSIONS.ACCESS_FILE_LOCATION,
    // ]);
    // console.log('granted', grand);
    // return grand;
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
