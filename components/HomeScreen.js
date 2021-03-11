import React from 'react';
import Ripple from 'react-native-material-ripple';
import {Icon} from 'native-base';
import {
  Animated,
  Easing,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  BackHandler,
  SafeAreaView,
  Modal,
  Linking,
  Dimensions,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Clipboard from '@react-native-community/clipboard';
import {Card, IconButton} from 'react-native-paper';
import {useNetInfo} from '@react-native-community/netinfo';
import {NATIVE_AD_PLACEMENT_ID, PROMOTED_TELEGRAM_BOT_LINK} from '@env';
// import {BannerAd, TestIds, BannerAdSize} from '@react-native-firebase/admob';
// import {BannerView, AdSettings} from 'react-native-fbads';

// const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

import {
  AdIconView,
  MediaView,
  AdChoicesView,
  TriggerableView,
  withNativeAd,
} from 'react-native-fbads';
import {NativeAdsManager} from 'react-native-fbads';
import AsyncStorage from '@react-native-async-storage/async-storage';

const adsManager = new NativeAdsManager(NATIVE_AD_PLACEMENT_ID);
class AdComponent extends React.Component {
  render() {
    const {nativeAd} = this.props;
    return (
      <Card
        style={{backgroundColor: '#ffffff', borderRadius: 0}}
        elevation={16}>
        <TriggerableView
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            height: '100%',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 100,
          }}
        />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View>
            <AdIconView
              style={{
                width: 50,
                height: 50,
                position: 'absolute',
                left: 0,
                top: 0,
              }}
            />
          </View>
          <AdChoicesView
            style={{position: 'absolute', right: 0, top: 0, zIndex: 1000}}
          />
          <MediaView style={{height: 60, width: 120}} />
          <View>
            <Text
              style={{
                textAlign: 'center',
                color: '#8d8d8d',
                paddingHorizontal: 10,
              }}>
              {nativeAd.advertiserName} - {nativeAd.socialContext}
            </Text>
          </View>
        </View>
      </Card>
    );
  }
}
export const NativeAdComponent = withNativeAd(AdComponent);

const HomeScreen = (props) => {
  const [isFirstLaunch, setIsFirstLaunch] = React.useState(null);
  const netInfo = useNetInfo();
  const [videoLink, setVideoLink] = React.useState('');
  const textFieldOpacity = React.useRef(new Animated.Value(0)).current;
  const textFieldTranslateY = React.useRef(new Animated.Value(0)).current;
  const logoOpacity = React.useRef(new Animated.Value(10)).current;
  const logoTranslateY = React.useRef(new Animated.Value(70)).current;
  const logoIconScale = React.useRef(new Animated.Value(0)).current;

  const textNoteMsgOpacity = React.useRef(new Animated.Value(0)).current;
  const textNoteMsgTranslateY = React.useRef(new Animated.Value(0)).current;
  const [isAllAnimDone, setAllAnimDone] = React.useState(false);

  const [isHowToModalOpen, setHowToModalVisibility] = React.useState(false);

  const animate = () => {
    Animated.sequence([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        easing: Easing.elastic(0.84),
        useNativeDriver: false,
      }).start(),

      logoIconScaleAnim(1000, Easing.in(Easing.bounce)),

      Animated.timing(logoTranslateY, {
        delay: 2000,
        toValue: -60,
        duration: 800,
        useNativeDriver: false,
      }).start(),

      Animated.timing(textNoteMsgOpacity, {
        delay: 3000,
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }).start(),

      Animated.timing(textNoteMsgTranslateY, {
        toValue: -50,
        duration: 800,
        useNativeDriver: false,
      }).start(),

      Animated.timing(textFieldOpacity, {
        delay: 3000,
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }).start(() => {
        setAllAnimDone(true);
      }),

      // Animated.timing(textFieldTranslateY, {
      //   toValue: 0,
      //   duration: 800,
      //   useNativeDriver: false,
      // }).start(),
    ]);
  };

  const logoIconScaleAnim = (delay = 0, easing = Easing.elastic(0.84)) => {
    Animated.timing(logoIconScale, {
      delay: delay,
      toValue: 1,
      duration: 800,
      easing: easing,
      useNativeDriver: false,
    }).start(() => {
      logoIconShrinkAnim();
    });
  };

  const logoIconShrinkAnim = (delay = 0, easing = Easing.elastic(0.84)) => {
    Animated.timing(logoIconScale, {
      delay: delay,
      toValue: 0.9,
      duration: 800,
      easing: easing,
      useNativeDriver: false,
    }).start(() => {
      logoIconScaleAnim();
    });
  };

  const fetchCopiedText = async () => {
    const copied_text = await Clipboard.getString();
    copied_text && setVideoLink(copied_text);
  };

  React.useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched')
      .then((value) => {
        if (value == null) {
          AsyncStorage.setItem('alreadyLaunched', 'true'); // No need to wait for `setItem` to finish, although you might want to handle errors
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsFirstLaunch(null);
      });

    animate();
    fetchCopiedText();
    // AdSettings.addTestDevice('hash');
  }, []);

  const logoSize = logoOpacity.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 10000],
  });

  const logoAnimatedStyles = [
    styles.box,
    {
      opacity: logoOpacity,
      width: logoSize,
      height: logoSize,
    },
    {
      transform: [
        {
          translateY: logoTranslateY,
        },
      ],
    },
  ];

  const logoIconAnimatedStyles = [
    {
      transform: [
        {
          scale: logoIconScale,
        },
      ],
    },
  ];

  const textFieldAnimatedStyles = [
    {
      opacity: textFieldOpacity,
    },
    {
      transform: [
        {
          translateY: textFieldTranslateY,
        },
      ],
    },
  ];

  const textNoteMsg = [
    {
      opacity: textNoteMsgOpacity,
    },
    {
      transform: [
        {
          translateY: textNoteMsgTranslateY,
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
    <>
      <StatusBar showHideTransition='slide' backgroundColor={isHowToModalOpen ? 'rgba(0,0,0,0.4)' : 'transparent'} barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            ...styles.container,
            height: Dimensions.get('window').height - StatusBar.currentHeight,
            width: Dimensions.get('window').width,
          }}>
          <View
            style={{
              width: 30,
              height: 30,
              alignSelf: 'flex-end',
              marginRight: 12,
              marginTop: 12,
            }}>
            {!isHowToModalOpen ? (
              <Card
                style={{
                  opacity: isAllAnimDone ? 1 : 0,
                  flex: 1,
                  borderRadius: 30 / 2,
                }}
                onPress={() => setHowToModalVisibility(true)}>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon
                    type="FontAwesome5"
                    name="question"
                    style={{fontSize: 13, color: '#454545'}}
                  />
                </View>
              </Card>
            ) : null}
          </View>

          <View
            style={{
              flex: 1,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View>
              <Animated.View style={logoAnimatedStyles}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Animated.View style={logoIconAnimatedStyles}>
                    <Icon
                      name="play"
                      style={{
                        color: '#ffffff',
                        fontSize: 55,
                        marginLeft:8
                      }}
                    />
                  </Animated.View>
                </View>
              </Animated.View>
            </View>

            <>
              <View>
                <Animated.View style={[textNoteMsg, {width: '90%'}]}>
                  {!netInfo.isConnected && !netInfo.isInternetReachable ? (
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 16,
                        color: '#8d8d8d',
                        textTransform: 'capitalize',
                      }}>
                      App needs internet connection. Please launch app again
                      after connecting to internet
                    </Text>
                  ) : (
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 16,
                        color: '#8d8d8d',
                        textTransform: 'capitalize',
                      }}>
                      To know how to generate video link of any telegram video.
                      Click on the{' '}
                      <Icon
                        type="FontAwesome5"
                        name="question-circle"
                        style={{fontSize: 14, color: '#8d8d8d'}}
                      />{' '}
                      given on the above right corner.
                    </Text>
                  )}
                </Animated.View>
              </View>

              <View style={{marginTop: 40, marginBottom:10}}>
                {netInfo.isConnected && netInfo.isInternetReachable ? (
                  <Animated.View
                    style={[
                      textFieldAnimatedStyles,
                      {
                        backgroundColor: '#e8e8e8',
                        borderRadius: 4,
                        width: '90%',
                        height: 48,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      },
                    ]}>
                    <View style={{marginLeft: 5, marginRight: 10, flex: 1}}>
                      <TextInput
                        value={videoLink}
                        placeholder="Enter Telegram Video Link"
                        onChangeText={(video_link) => setVideoLink(video_link)}
                        onSubmitEditing={
                          videoLink ? _onPlayVideoBtnPress : null
                        }
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
                        <Icon
                          name="play"
                          type="FontAwesome5"
                          style={{color: '#ffffff', fontSize: 18}}
                        />
                      </View>
                    </Ripple>
                  </Animated.View>
                ) : (
                  <Animated.View
                    style={[
                      textFieldAnimatedStyles,
                      {
                        height: 40,
                      },
                    ]}>
                    <Card
                      style={{paddingVertical: 10, paddingHorizontal: 30}}
                      onPress={() => BackHandler.exitApp()}>
                      <Text>EXIT</Text>
                    </Card>
                  </Animated.View>
                )}
              </View>
            </>
          </View>

          <View
            style={{
              opacity: isAllAnimDone ? 1 : 0,
              width: '100%',
            }}>
            <NativeAdComponent adsManager={adsManager} />
          </View>

          {isHowToModalOpen ? (
            <HowToModal
              closeModal={() => {
                setIsFirstLaunch(false);
                setHowToModalVisibility(false);
              }}
            />
          ) : null}
        </View>
      </ScrollView>
    </>
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

class HowToModal extends React.Component {
  render() {
    return (
      <View
        style={{
          height: Dimensions.get('window').height,
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
        }}>
        <Modal
          animationType="fade"
          onRequestClose={this.props.closeModal}
          transparent={true}
          visible={true}
          presentationStyle="overFullScreen">
          <View
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <SafeAreaView
              style={{
                backgroundColor: '#fff',
                borderRadius: 6,
                // height: '70%',
                width: '90%',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingLeft: 20,
                  paddingRight: 6,
                }}>
                <Text style={{fontWeight: 'bold', fontSize: 18}}>
                  Follow Steps
                </Text>
                <IconButton icon="check" onPress={this.props.closeModal} />
              </View>
              <View style={{...styles.horizontalSeparator}} />
              <View style={{padding: 10}}>
                <View style={{flexDirection: 'row', marginBottom: 4}}>
                  <Text style={{fontWeight: 'bold', fontSize: 16}}>1. </Text>
                  <Text style={{fontSize: 16, color: '#454545'}}>
                    <Text
                      style={{color: '#4285F4'}}
                      onPress={() => {
                        const redirect_to = PROMOTED_TELEGRAM_BOT_LINK;
                        Linking.canOpenURL(redirect_to)
                          .then((can_open) =>
                            can_open ? Linking.openURL(redirect_to) : null,
                          )
                          .catch((err) => console.log(err));
                      }}>
                      Open{' '}
                      <Icon
                        type="FontAwesome5"
                        name="external-link-alt"
                        style={{color: '#4285F4', fontSize: 12}}
                      />
                    </Text>
                    {'  '}
                    and follow the bot.
                  </Text>
                </View>
                <View style={{flexDirection: 'row', marginBottom: 4}}>
                  <Text style={{fontWeight: 'bold', fontSize: 16}}>2. </Text>
                  <Text style={{fontSize: 16, color: '#454545'}}>
                    Forward any file to the followed bot.
                  </Text>
                </View>
                <View style={{flexDirection: 'row', marginBottom: 4}}>
                  <Text style={{fontWeight: 'bold', fontSize: 16}}>3. </Text>
                  <Text style={{fontSize: 16, color: '#454545'}}>
                    You will receive a download link of the video from bot.
                  </Text>
                </View>
                <View style={{flexDirection: 'row', marginBottom: 4}}>
                  <Text style={{fontWeight: 'bold', fontSize: 16}}>4. </Text>
                  <Text style={{fontSize: 16, color: '#454545'}}>
                    Copy the link and paste it into the text field.
                  </Text>
                </View>
              </View>
            </SafeAreaView>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  horizontalSeparator: {
    width: '100%',
    height: 1,
    backgroundColor: '#ddd',
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  box: {
    // borderRadius: 6,
    borderRadius: 200,
    // backgroundColor: '#61dafb',
    backgroundColor: '#4885ed',
  },
});

export default HomeScreen;
