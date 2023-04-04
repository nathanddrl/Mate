import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useAuthentication } from "../utils/hooks/useAuthentication";
import { getFirestore, doc, collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { Card } from "react-native-elements";
import { ScrollView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function MainScreen() {
  const { user } = useAuthentication();
  const db = getFirestore();
  const navigation = useNavigation();

 
  return (
    <View style={styles.container}>
        <Text>Home</Text>
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "90%",
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
});
