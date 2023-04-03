import React from "react";
import { View } from "react-native";
import { useAuthentication } from "../utils/hooks/useAuthentication";
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { TextInput, Button, Text } from "react-native";
import { StyleSheet } from "react-native";
import { getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function CreateActivity() {
  const { user } = useAuthentication();
  const db = getFirestore();
  const navigation = useNavigation();

  const [activityName, setActivityName] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [activityTime, setActivityTime] = useState("");
  const [activityLocation, setActivityLocation] = useState("");
  const [activityParticipants, setActivityParticipants] = useState("");
  const [activityType, setActivityType] = useState("");
  const [activityCreator, setActivityCreator] = useState("");

  const saveActivityData = async (uid, data) => {
    const activitiesRef = collection(db, "activities");
    const newActivityRef = await addDoc(activitiesRef, {
      ...data,
      creator: uid,
    });
    console.log("Nouvelle activité ajoutée avec l'ID: ", newActivityRef.id);
  };

  const handleFormSubmit = async () => {
    if (user) {
      await saveActivityData(user.uid, {
        activityName,
        activityDescription,
        activityDate,
        activityLocation,
        activityParticipants,
        activityType,
        activityCreator: user.uid,
      });
    }
  };

  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    if (Platform.OS === "android") {
      setShow(false);
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
    setShow(true);
  };

  const showTimepicker = () => {
    showMode("time");
    setShow(true);
  };

  return (
    <View style={styles.container}>
      <Text>Créer une nouvelle activité</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom de l'activité"
        onChangeText={(text) => setActivityName(text)}
        value={activityName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description de l'activité"
        onChangeText={(text) => setActivityDescription(text)}
        value={activityDescription}
      />
      {/* date selector for the date */}
        <Button onPress={showDatepicker} title="Show date picker!" />
        <Button onPress={showTimepicker} title="Show time picker!" />
        <Text>selected: {date.toLocaleString()}</Text>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={activityDate}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
          />
        )}
      <TextInput
        style={styles.input}
        placeholder="Lieu de l'activité"
        onChangeText={(text) => setActivityLocation(text)}
        value={activityLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre de participants"
        onChangeText={(text) => setActivityParticipants(text)}
        value={activityParticipants}
      />
      <TextInput
        style={styles.input}
        placeholder="Type d'activité"
        onChangeText={(text) => setActivityType(text)}
        value={activityType}
      />
      <Button title="Créer l'activité" onPress={handleFormSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
