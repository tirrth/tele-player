import React from 'react';
import RNVideoPlayer from './react-native-video-player/RNVideoPlayer';
import {StyleSheet} from 'react-native';
import {
  InterstitialAd,
  TestIds,
  AdEventType,
} from '@react-native-firebase/admob';

// Interstitial Ad
const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
const interstitialAd = InterstitialAd.createForAdRequest(adUnitId);

const VideoPlayer = (props) => {
  const {video_url} = props.route.params;

  React.useEffect(() => {
    interstitialAd.onAdEvent((type) => {
      if (type === AdEventType.LOADED) {
        interstitialAd.show();
        console.log('InterstitialAd adLoaded');
      } else if (type === AdEventType.ERROR) {
        console.warn('InterstitialAd => Error');
      } else if (type === AdEventType.OPENED) {
        console.log('InterstitialAd => adOpened');
      } else if (type === AdEventType.CLICKED) {
        console.log('InterstitialAd => adClicked');
      } else if (type === AdEventType.LEFT_APPLICATION) {
        console.log('InterstitialAd => adLeft_App');
      } else if (type === AdEventType.CLOSED) {
        console.log('InterstitialAd => adClosed');
        // interstitialAd.load();
      }
    });
    interstitialAd.load();
  }, []);

  return (
    <RNVideoPlayer
      source={{uri: video_url}}
      doubleTapTime={100}
      controlAnimationTiming={0}
      title="Video Player Native"
      navigator={props.navigation}
      seekColor="#DB4437"
    />
  );
};

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: '100%',
    width: '100%',
  },
});

export default VideoPlayer;
