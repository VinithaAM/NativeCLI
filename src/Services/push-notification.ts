import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
export async function requestuserpermission() {
  const authStatus = await messaging().requestPermission();
  const enable =
    authStatus == messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus == messaging.AuthorizationStatus.PROVISIONAL;
  if (enable) {
    console.log('AuthorizationStatus', authStatus);
    GetToken();
  }
}
async function GetToken() {
  let fcmToken = await AsyncStorage.getItem('Token');
  console.log('old', fcmToken);
  if (!fcmToken) {
    try {
      let token = await messaging().getToken();
      if (token) {
        console.log('new token', token);
        console.warn('token', token);
        await AsyncStorage.setItem('NewToken', token);
      } else {
      }
    } catch (error) {
      console.log('Error in fetchtoken', error);
    }
  }
}
export const NotificationListner = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused App to open from background State:',
      remoteMessage.notification,
    );
  });
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });
  messaging().onMessage(async remoteMessage => {
    console.log('Notification on foreground state .... ', remoteMessage);
  });
};
