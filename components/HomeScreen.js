// import React, {useRef} from 'react';
// import {
//   Animated,
//   Text,
//   View,
//   StyleSheet,
//   Button,
//   TextInput,
// } from 'react-native';

// const HomeScreen = () => {
//   const logoPosition = useRef(new Animated.ValueXY({x: 0, y: 0})).current;

//   const moveLogoToTop = () => {
//     Animated.timing(logoPosition, {
//       toValue: {x: 0, y: -100},
//       duration: 1000,
//       useNativeDriver: false,
//     }).start();
//   };

//   React.useState(() => {
//     moveLogoToTop();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Animated.View style={logoPosition.getLayout()}>
//         <View
//           style={{
//             width: 100,
//             height: 100,
//             borderRadius: 100 / 2,
//             backgroundColor: 'red',
//           }}
//         />
//       </Animated.View>
//       {/* <View style={styles.buttonRow}>
//         <Button title="Move Logo To Top" onPress={moveLogoToTop} />
//       </View> */}
//       <View
//         style={{
//           backgroundColor: '#e0e0e0',
//           borderRadius: 4,
//           width: '90%',
//           paddingLeft: 10,
//         }}>
//         <TextInput placeholder="Enter Video Link" />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   fadingContainer: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     backgroundColor: 'powderblue',
//   },
//   fadingText: {
//     fontSize: 28,
//     textAlign: 'center',
//     margin: 10,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     marginVertical: 16,
//   },
// });

// export default HomeScreen;

import React from 'react';
import Ripple from 'react-native-material-ripple';
import {Icon} from 'native-base';
import {
  Animated,
  Easing,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {BannerAd, TestIds, BannerAdSize} from '@react-native-firebase/admob';
const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const HomeScreen = (props) => {
  let hey;
  const [videoLink, setVideoLink] = React.useState('');
  const opacity = React.useRef(new Animated.Value(10)).current;
  const translateY = React.useRef(new Animated.Value(0)).current;

  const animate = () => {
    Animated.stagger(1000, [
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        easing: Easing.elastic(0.84),
        useNativeDriver: false,
      }).start(),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 800,
        useNativeDriver: false,
      }).start(),
    ]);
  };

  const animateEvery2Seconds = () => {
    setInterval(() => {
      animate();
    }, 2000);
  };

  React.useEffect(() => {
    animate();
    // animateEvery2Seconds();
  }, []);

  const size = opacity.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 10000],
  });

  const animatedStyles = [
    styles.box,
    {
      opacity,
      width: size,
      height: size,
    },
    {
      transform: [
        {
          translateY,
        },
      ],
    },
  ];

  const _onPlayVideoBtnPress = () => {
    console.log(videoLink);
    props.navigation.navigate('VideoPlayer', {
      video_url: videoLink,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      <Animated.View style={animatedStyles}>
        <View
          style={{
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon name="play" style={{color: '#ffffff', fontSize: 70}} />
        </View>
      </Animated.View>
      <View
        style={{
          backgroundColor: '#e8e8e8',
          borderRadius: 4,
          width: '90%',
          position: 'absolute',
          bottom: 130,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{marginLeft: 5, flex: 1}}>
          <TextInput
            placeholder="Enter Telegram Video Link"
            onChangeText={(video_link) => setVideoLink(video_link)}
            onSubmitEditing={videoLink ? _onPlayVideoBtnPress : null}
            autoCapitalize="none"
          />
        </View>

        <Ripple
          style={{marginRight: 5}}
          rippleContainerBorderRadius={4}
          onPress={() => _onPlayVideoBtnPress()}
          disabled={videoLink ? false : true}>
          <View
            style={{
              height: '80%',
              width: 40,
              backgroundColor: videoLink ? '#4885ed' : '#cccccc',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="play" style={{color: '#ffffff', fontSize: 18}} />
          </View>
        </Ripple>
      </View>
      <View
        style={{position: 'absolute', bottom: 0, left: 0}}
        ref={(comp) => (hey = comp)}>
        <BannerAd size={BannerAdSize.ADAPTIVE_BANNER} unitId={adUnitId} />
      </View>
    </View>
  );
};

const SECTIONS = [
  {
    title: 'Predefined animations',
    data: [
      {title: 'Bounce', easing: Easing.bounce},
      {title: 'Ease', easing: Easing.ease},
      {title: 'Elastic', easing: Easing.elastic(4)},
    ],
  },
  {
    title: 'Standard functions',
    data: [
      {title: 'Linear', easing: Easing.linear},
      {title: 'Quad', easing: Easing.quad},
      {title: 'Cubic', easing: Easing.cubic},
    ],
  },
  {
    title: 'Additional functions',
    data: [
      {
        title: 'Bezier',
        easing: Easing.bezier(0, 2, 1, -1),
      },
      {title: 'Circle', easing: Easing.circle},
      {title: 'Sin', easing: Easing.sin},
      {title: 'Exp', easing: Easing.exp},
    ],
  },
  {
    title: 'Combinations',
    data: [
      {
        title: 'In + Bounce',
        easing: Easing.in(Easing.bounce),
      },
      {
        title: 'Out + Exp',
        easing: Easing.out(Easing.exp),
      },
      {
        title: 'InOut + Elastic',
        easing: Easing.inOut(Easing.elastic(1)),
      },
    ],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    borderRadius: 6,
    // backgroundColor: '#61dafb',
    backgroundColor: '#4885ed',
  },
});

export default HomeScreen;
