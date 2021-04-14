import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../components/HomeScreen';
import VideoPlayer from '../components/VideoPlayer';
import {ActivityIndicator, Linking, StyleSheet, View} from 'react-native';
import axios from 'axios';

const Stack = createStackNavigator();

const AppStackScreens = () => {
  // const NativeLinking = require('../node_modules/react-native/Libraries/Linking')
  //   .default;
  const [init_video_url, setInitVideoLink] = React.useState('');
  const [initialRouteName, setInitialRouteName] = React.useState('HomeScreen');
  const [isLoading, setIsLoading] = React.useState(true);

  const _openVideoPlayer = async (url = '') => {
    console.log('Initial url is: ' + url);
    if (url.includes('teleplayer://app/play/url/')) {
      url = url.replace('teleplayer://app/play/url/', '');
    } else if (url.includes('https://teleplayer.com/play/url/')) {
      url = url.replace('https://teleplayer.com/play/url/', '');
    } else if (url.includes('https://www.teleplayer.com/play/url/')) {
      url = url.replace('https://www.teleplayer.com/play/url/', '');
    }

    const urlParams = new URLSearchParams(url);
    console.log('urlParams == ', urlParams);
    const is_streamtape_video = toBool(urlParams.get('is_streamtape_video'));
    if (is_streamtape_video) {
      await axios
        .get(url)
        .then(res => {
          console.log(res);
          const doc = new DOMParser().parseFromString(xmlString, 'text/xml');
          url = doc.getElementById('videolink')?.textContent?.substring(2);
        })
        .catch(err => {
          console.log(err);
        });
    }

    if (url) {
      setInitVideoLink(url);
      setInitialRouteName('VideoPlayer');
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    Linking.getInitialURL()
      .then(url => {
        if (url) {
          _openVideoPlayer(url);
        } else {
          setIsLoading(false);
        }
      })
      .catch(err => console.log(err));
  }, []);

  return isLoading ? (
    <>
      <View
        style={{...StyleSheet.absoluteFillObject, justifyContent: 'center'}}>
        <ActivityIndicator color="#4285F4" size={22} />
      </View>
    </>
  ) : (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={initialRouteName}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen
        name="VideoPlayer"
        component={VideoPlayer}
        initialParams={{video_url: init_video_url}}
      />
    </Stack.Navigator>
  );
};

export default AppStackScreens;
