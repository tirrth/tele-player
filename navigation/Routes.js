import React, {useRef} from 'react';
import 'react-native-gesture-handler';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AppStack from './AppStack';
import analytics from '@react-native-firebase/analytics';
import {ActivityIndicator} from 'react-native';

const MainStack = createStackNavigator();

const Routes = () => {
  const navigationRef = useRef();
  const routeNameRef = useRef();
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() =>
        (routeNameRef.current = navigationRef.current.getCurrentRoute().name)
      }
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;
        if (previousRouteName !== currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }
        // Save the current route name for later comparison
        routeNameRef.current = currentRouteName;
      }}
      fallback={
        <View
          style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator color="blue" size={25} />
        </View>
      }>
      <MainStack.Navigator>
        <MainStack.Screen
          name="AppStack"
          options={{header: () => null}}
          component={AppStack}
        />
      </MainStack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
