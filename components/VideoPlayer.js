import React from 'react';
import RNVideoPlayer from './react-native-video-player/RNVideoPlayer';
import {StyleSheet} from 'react-native';
import {INTERSTITIAL_AD_PLACEMENT_ID} from '@env';
// import {INTERSTITIAL_AD_PLACEMENT_ID} from '@env';
// import {
//   InterstitialAd,
//   TestIds,
//   AdEventType,
// } from '@react-native-firebase/admob';

// Interstitial Ad
// const adUnitId = __DEV__
//   ? TestIds.INTERSTITIAL
//   : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
// const interstitialAd = InterstitialAd.createForAdRequest(adUnitId);

import {InterstitialAdManager} from 'react-native-fbads';

const VideoPlayer = (props) => {
  const {video_url} = props.route.params;

  React.useEffect(() => {
    // interstitialAd.onAdEvent((type) => {
    //   if (type === AdEventType.LOADED) {
    //     interstitialAd.show();
    //     console.log('InterstitialAd adLoaded');
    //   } else if (type === AdEventType.ERROR) {
    //     console.warn('InterstitialAd => Error');
    //   } else if (type === AdEventType.OPENED) {
    //     console.log('InterstitialAd => adOpened');
    //   } else if (type === AdEventType.CLICKED) {
    //     console.log('InterstitialAd => adClicked');
    //   } else if (type === AdEventType.LEFT_APPLICATION) {
    //     console.log('InterstitialAd => adLeft_App');
    //   } else if (type === AdEventType.CLOSED) {
    //     console.log('InterstitialAd => adClosed');
    //     // interstitialAd.load();
    //   }
    // });
    // interstitialAd.load();

    const placementId = INTERSTITIAL_AD_PLACEMENT_ID;
    InterstitialAdManager.preloadAd(placementId)
      .then((didClick) => {
        console.log('didClick: ', didClick);
      })
      .catch((error) => {
        console.log('Err', ...error);
      });

    // Will show it if already loaded, or wait for it to load and show it.
    InterstitialAdManager.showPreloadedAd(placementId);
  }, []);

  return (
    <RNVideoPlayer
      source={{uri: video_url}}
      doubleTapTime={100}
      controlAnimationTiming={0}
      title="Video Player"
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
