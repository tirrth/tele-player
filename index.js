/**
 * @format
 */

import {AppRegistry, Linking} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  // Must be outside of any component LifeCycle (such as `componentDidMount`).
  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: async function (remoteMessage) {
    console.log('NOTIFICATION:', remoteMessage);
    if (remoteMessage.data?.redirect_to) {
      const can_open_url = await Linking.canOpenURL(
        remoteMessage.data.redirect_to,
      );
      if (can_open_url) {
        console.log('Opening url - ', remoteMessage.data.redirect_to);
        await Linking.openURL(remoteMessage.data.redirect_to).catch(err => {
          console.log(err);
        });
      } else {
        console.log("Can't open url - ", remoteMessage.data.redirect_to);
      }
    }
  },
});

AppRegistry.registerComponent(appName, () => App);
