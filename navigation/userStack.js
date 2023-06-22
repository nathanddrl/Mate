import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";

import HomeScreen from "../screens/Home";
import MainScreen from "../screens/MainScreen";
import CreateActivity from "../screens/CreateActivity";
import ActivityDetailsScreen from "../screens/ActivityDetailsScreen";
import ActivitiesMap from "../screens/ActivitiesMap";
import JoinRequestsScreen from "../screens/JoinRequestsScreen";

const Stack = createStackNavigator();

export default function UserStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          headerStyle: {
            backgroundColor: "#006bbc",
          },
          headerTintColor: "#006bbc",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          // no separator
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "" }}
        />
        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={{ title: "" }}
        />
        <Stack.Screen
          name="ActivityDetails"
          component={ActivityDetailsScreen}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
            title: "",
          }}
        />
        <Stack.Screen
          name="CreateActivity"
          component={CreateActivity}
          options={{ title: "", headerTintColor: "#006bbc" }}
        />
        <Stack.Screen
          name="ActivitiesMap"
          component={ActivitiesMap}
          options={{
            title: "",
            headerShown: false,
          }}
          screenOptions={{ HeaderShown: false }}
        />          
        <Stack.Screen
          name="JoinRequests"
          component={JoinRequestsScreen}
          options={{ 
            title: "",
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
