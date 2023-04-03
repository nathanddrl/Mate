import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/Home';
import MainScreen from '../screens/MainScreen';
import CreateActivity from '../screens/CreateActivity';

const Stack = createStackNavigator();

export default function UserStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="CreateActivity" component={CreateActivity} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}