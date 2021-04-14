/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import NavigationProvider from './navigation';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

function _sendPushNotification(remoteMessage) {
  console.log('Send a Push Notification!!');
  PushNotification.localNotification({
    smallIcon:
      remoteMessage.notification?.android?.smallIcon || 'notification_icon',
    userInfo: {redirect_to: remoteMessage.data?.redirect_to},
    bigPictureUrl: remoteMessage.notification?.android?.imageUrl,
    priority: 'max',
    vibrate: true,
    visibility: 'public',
    ignoreInForeground: false,
    playSound: true,
    title: remoteMessage.notification?.body,
    message: remoteMessage.notification?.title,
  });
}

const App = () => {
  React.useEffect(() => {
    let unsubscribeToOnMessage = () => null;
    let unsubscribeToOnTokenRefresh = () => null;

    messaging()
      .hasPermission()
      .then(enabled => {
        if (!enabled) {
          requestUserPermission();
        }

        console.log(
          '%c listening to notification events....',
          'color: #0F9D58; font-size: x-large; font-weight: bold; text-transform: capitalize',
        );

        messaging()
          .getToken()
          .then(token => {
            console.log('device-token', token);
          });

        unsubscribeToOnMessage = messaging().onMessage(async remoteMessage => {
          console.log('Message handled in the FOREGROUND!', remoteMessage);
          _sendPushNotification(remoteMessage);
        });

        messaging().setBackgroundMessageHandler(async remoteMessage => {
          console.log('Message handled in the background!', remoteMessage);
        });

        messaging().onNotificationOpenedApp(remoteMessage => {
          console.log(
            'Notification caused app to open from background state:',
            remoteMessage,
          );
        });

        messaging()
          .getInitialNotification()
          .then(remoteMessage => {
            if (remoteMessage) {
              console.log(
                'Notification caused app to open from quit state:',
                remoteMessage,
              );
            }
          })
          .catch(err => {
            console.log(err);
          });

        unsubscribeToOnTokenRefresh = messaging().onTokenRefresh(token => {
          console.log('Refreshed device token -', token);
        });
      })
      .catch(err => {
        console.log(err);
      });

    return () => {
      console.log(
        '%c removing on message Notification event listener....',
        'color: #DB4437; font-size: x-large; font-weight: bold; text-transform: capitalize',
      );
      unsubscribeToOnMessage();
      unsubscribeToOnTokenRefresh();
    };
  }, []);

  return <NavigationProvider />;
};

export default App;
