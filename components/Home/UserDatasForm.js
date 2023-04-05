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

      if (typeof props.onUserDataSaved === 'function') {
        props.onUserDataSaved();
      }
      
      //go to main screen
      navigation.navigate("Home");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Hello</Text>
        <TextInput
          style={styles.input}
          placeholder="Prénom"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={lastName}
          onChangeText={setLastName}
        />
        <View style={styles.buttonContainer}>
          <Button title="Enregistrer" onPress={handleFormSubmit} />
        </View>
      </View>
    </View>
  );
}
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    formContainer: {
      width: "80%",
      backgroundColor: "#f8f8f8",
      borderRadius: 10,
      padding: 20,
      alignItems: "center",
      justifyContent: "center",
      elevation: 5,
      shadowOffset: { width: 0, height: 2 },
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
    },
    input: {
      width: "100%",
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      paddingHorizontal: 15,
      paddingVertical: 10,
      marginBottom: 15,
      fontSize: 16,
    },
    buttonContainer: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 10,
    },
  });
  