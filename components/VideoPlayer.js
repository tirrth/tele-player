import React, {useEffect, useState} from 'react';
import RNVideoPlayer from './react-native-video-player/RNVideoPlayer';
import {StatusBar, StyleSheet} from 'react-native';

const VideoPlayer = props => {
  const {video_url} = props.route?.params;

  useEffect(() => {
    console.log('video_url = ', video_url);
  }, []);

  return (
    <>
      <StatusBar
        backgroundColor="#000000"
        barStyle="light-content"
        showHideTransition="slide"
      />
      <RNVideoPlayer
        disableBack={!props.navigation?.canGoBack()}
        source={{uri: video_url}}
        doubleTapTime={100}
        controlAnimationTiming={0}
        title="Video Player"
        navigator={props.navigation}
        seekColor="#DB4437"
      />
    </>
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
