import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../components/HomeScreen';
import VideoPlayer from '../components/VideoPlayer';

const Stack = createStackNavigator();

const AppStackScreens = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayer} />
    </Stack.Navigator>
  );
};

export default AppStackScreens;
