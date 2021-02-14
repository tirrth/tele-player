import React from 'react';
import 'react-native-gesture-handler';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AppStack from './AppStack';
import linking from '../Linking';
import {ActivityIndicator} from 'react-native';

const MainStack = createStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer
      linking={linking}
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
