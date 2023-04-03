import React from "react";
import { View } from "react-native";
import { useAuthentication } from "../../utils/hooks/useAuthentication";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { TextInput, Button, Text } from "react-native";
import { StyleSheet } from "react-native";
import { getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function UserDatasForm() {

  const navigation = useNavigation();
  const [isNewUser, setIsNewUser] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const { user } = useAuthentication();

  const db = getFirestore();

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

  const saveUserData = async (uid, data) => {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, data);
  };

  const handleFormSubmit = async () => {
    if (user) {
      await saveUserData(user.uid, {
        firstName,
        lastName,
        email: user.email,
        isNewUser: false,
      });

      setIsNewUser(false);

    //go to main screen
    navigation.navigate("MainScreen");

    }
  };

  return (
    <View style={styles.container}>
      {isNewUser && (
        <View>
          <Text>Hello</Text>
          <TextInput
            placeholder="Prénom"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            placeholder="Nom"
            value={lastName}
            onChangeText={setLastName}
          />
          <Button title="Enregistrer" onPress={handleFormSubmit} />
        </View>
      )}
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
});
