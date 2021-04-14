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
  ActivityIndicator,
} from 'react-native';
import LogoIcon from '../assets/logo_icon_white.svg';
import LinearGradient from 'react-native-linear-gradient';
import {ScrollView} from 'react-native-gesture-handler';
import Clipboard from '@react-native-community/clipboard';
import {Card, IconButton} from 'react-native-paper';
import {useNetInfo} from '@react-native-community/netinfo';
import {
  NATIVE_AD_PLACEMENT_ID,
  PROMOTED_TELEGRAM_BOT_LINK,
  NODE_SERVER_ENDPOINT,
  GET_STREAMTAPE_VIDEO_URL_API_KEY,
} from '@env';
import HTMLParser from 'react-native-html-parser';
import {
  AdIconView,
  MediaView,
  AdChoicesView,
  TriggerableView,
  withNativeAd,
  NativeAdsManager,
} from 'react-native-fbads';
import axios from 'axios';

const adsManager = new NativeAdsManager(NATIVE_AD_PLACEMENT_ID);
class AdComponent extends React.Component {
  render() {
    const {nativeAd} = this.props;
    return (
      <Card
        style={{backgroundColor: '#ffffff', borderRadius: 0}}
        elevation={16}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <AdChoicesView
            location="topRight"
            style={{
              position: 'absolute',
              backgroundColor: '#e0e0e0',
              right: 0,
              top: 0,
              zIndex: 1000,
            }}
          />
          <View style={{margin: 12}}>
            <MediaView style={{width: 1, height: 1}} />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <View>
                <AdIconView
                  style={{
                    width: 80,
                    height: 80,
                    flex: 1,
                  }}
                />
              </View>
              <View style={{paddingHorizontal: 10, flex: 1}}>
                <TriggerableView style={{marginRight: 8}}>
                  <Text>
                    {nativeAd.headline ||
                      'No headline given for this advertisement'}
                  </Text>
                </TriggerableView>
                <TriggerableView>
                  <Text style={{color: '#8d8d8d'}}>
                    {nativeAd.bodyText ||
                      'No description given for this advertisement'}
                  </Text>
                </TriggerableView>
              </View>
            </View>
            <View>
              <TriggerableView
                style={{
                  marginTop: 10,
                  backgroundColor: '#32CD32',
                  borderRadius: 6,
                  padding: 10,
                  width: '100%',
                  textAlignVertical: 'center',
                  textAlign: 'center',
                }}>
                <Text
                  style={{
                    textTransform: 'uppercase',
                    color: '#fff',
                    fontSize: 16,
                  }}>
                  {nativeAd.callToActionText}
                </Text>
              </TriggerableView>
            </View>
          </View>
        </View>
      </Card>
    );
  }
}
export const NativeAdComponent = withNativeAd(AdComponent);

const HomeScreen = props => {
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
  const [isBtnLoading, setBtnLoading] = React.useState(false);

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
        toValue: -90,
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
        toValue: -80,
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

  function toBool(val) {
    return val == 'true' || val == '1';
  }

  const _getStreamTapeVideoLink = async url => {
    return await axios.get(
      NODE_SERVER_ENDPOINT + GET_STREAMTAPE_VIDEO_URL_API_KEY,
      {
        params: {url: encodeURI(url)},
      },
    );
  };

  async function _onPlayVideoBtnPress(video_url = videoLink) {
    let regex = /[?&]([^=#]+)=([^&#]*)/g,
      urlParams = {},
      match;
    while ((match = regex.exec(video_url))) {
      urlParams[match[1]] = match[2];
    }
    const is_streamtape_video_url =
      toBool(urlParams.is_streamtape_video) ||
      video_url.includes('https://streamtape.com/v/') ||
      video_url.includes('http://streamtape.com/v/') ||
      video_url.includes('https://www.streamtape.com/v/') ||
      video_url.includes('http://www.streamtape.com/v/');
    if (is_streamtape_video_url) {
      setBtnLoading(true);
      await _getStreamTapeVideoLink(video_url)
        .then(res => {
          console.log(res);
          video_url = res.data.streamtape_video_url || video_url;
          setBtnLoading(false);
        })
        .catch(err => {
          console.log({...err});
          setBtnLoading(false);
        });
    }

    props.navigation.navigate('VideoPlayer', {
      video_url,
    });
  }

  const fetchCopiedText = async () => {
    const copied_text = await Clipboard.getString();
    copied_text && setVideoLink(copied_text);
  };

  const _openVideoPlayer = (url = '') => {
    if (url.includes('teleplayer://app/play/url/')) {
      url = url.replace('teleplayer://app/play/url/', '');
    } else if (url.includes('https://teleplayer.com/play/url/')) {
      url = url.replace('https://teleplayer.com/play/url/', '');
    } else if (url.includes('https://www.teleplayer.com/play/url/')) {
      url = url.replace('https://www.teleplayer.com/play/url/', '');
    }

    if (url) {
      setVideoLink(url);
      _onPlayVideoBtnPress(url);
    }
  };

  React.useEffect(() => {
    Linking.addEventListener('url', ({url}) => {
      url && _openVideoPlayer(url);
    });

    animate();
    fetchCopiedText();

    return () => {
      Linking.removeEventListener('url', ({url}) => {
        url && _openVideoPlayer(url);
      });
    };
  }, []);

  const logoSize = logoOpacity.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 11000],
  });

  const logoAnimatedStyles = [
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

  return (
    <>
      <StatusBar
        showHideTransition="slide"
        backgroundColor={isHowToModalOpen ? 'rgba(0,0,0,0.4)' : 'transparent'}
        barStyle="dark-content"
      />
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
                <LinearGradient
                  start={{x: 1, y: 0}}
                  end={{x: 0, y: 1}}
                  colors={['#31A6F6', '#195DE6']}
                  style={{height: '100%', width: '100%', borderRadius: 200}}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Animated.View style={logoIconAnimatedStyles}>
                      <View style={{marginLeft: 9}}>
                        <LogoIcon height={44} width={44} />
                      </View>
                    </Animated.View>
                  </View>
                </LinearGradient>
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

              <View style={{marginBottom: 80}}>
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
                        onChangeText={video_link => setVideoLink(video_link)}
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
                      <LinearGradient
                        start={{x: 1, y: 0}}
                        end={{x: 0, y: 1}}
                        colors={
                          videoLink
                            ? ['#31A6F6', '#195DE6']
                            : ['#cccccc', '#cccccc']
                        }
                        style={{
                          height: '80%',
                          width: 40,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingLeft: isBtnLoading ? 0 : 3,
                        }}>
                        {isBtnLoading ? (
                          <ActivityIndicator color="#FFFFFF" size={18} />
                        ) : (
                          <LogoIcon height={18} width={18} />
                        )}
                      </LinearGradient>
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
              position: 'absolute',
              bottom: 0,
              left: 0,
              opacity: isAllAnimDone ? 1 : 0,
              width: '100%',
            }}>
            <NativeAdComponent adsManager={adsManager} />
          </View>

          {isHowToModalOpen ? (
            <HowToModal closeModal={() => setHowToModalVisibility(false)} />
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
                          .then(can_open =>
                            can_open ? Linking.openURL(redirect_to) : null,
                          )
                          .catch(err => console.log(err));
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
});

export default HomeScreen;
