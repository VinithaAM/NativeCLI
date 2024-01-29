/**
 * @format
 */

import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';
import { Notifications } from 'react-native-notifications';
import AndroidBadge from 'react-native-android-badge';
import PushNotification from 'react-native-push-notification';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
  // Register foreground handler
  PushNotification.configure({
    onNotification:function(notification){
        console.log('LOCAL NOTIFICATION ==>', notification)
        AndroidBadge.setBadge(notification.badge || 0);
    },
    popInitialNotification: true,
  requestPermissions: true,
  })

AppRegistry.registerComponent(appName, () => App);
