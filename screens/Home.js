import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAuthentication } from "../utils/hooks/useAuthentication";
import { Button } from "react-native-elements";
import { signOut } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import { TextInput } from "react-native";
import UserDatasForm from "../components/Home/UserDatasForm";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useAuthentication();

  const [isNewUser, setIsNewUser] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const db = getFirestore();
  const auth = getAuth();

  // set first name and last name if user is not new
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setFirstName(userDoc.data().firstName);
          setLastName(userDoc.data().lastName);
        }
      }
    };

    fetchUserData();
  }, [user]);

  // set isNewUser state by checking if user is new
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setIsNewUser(userDoc.data().isNewUser);
        } else {
          setIsNewUser(true);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log("Error while logging out:", error);
    }
  };

  return (
    <View style={styles.container}>
      {isNewUser ? <UserDatasForm /> : <Text>Vous êtes déjà inscrit, bonjour {firstName}</Text>}

      <Button title="Logout" onPress={handleLogout} />
      <Button
        title="Go to main screen"
        onPress={() => navigation.navigate("MainScreen")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginTop: 10,
  },
});
