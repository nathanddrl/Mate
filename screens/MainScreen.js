import React from 'react'
import { View, Text, StyleSheet, Button } from 'react-native'
import { useAuthentication } from '../utils/hooks/useAuthentication';
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";




export default function MainScreen() {

    const { user } = useAuthentication();
    const db = getFirestore();
    const navigation = useNavigation();

    const [firstName, setFirstName] = useState("");
    
    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    setFirstName(userDoc.data().firstName);
                }
            }
        };

        fetchUserData();
    }, [user]);


  return (
    <View style={styles.container}>
        <Text>Bonjour {firstName}</Text>

        <Button
            title="Create a new activity"
            onPress={() => navigation.navigate("CreateActivity")}
        />

    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
})


