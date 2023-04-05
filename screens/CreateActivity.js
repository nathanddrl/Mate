import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { useAuthentication } from "../utils/hooks/useAuthentication";
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import MapView, { Marker } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

export default function CreateActivity() {
  const { user } = useAuthentication();
  const db = getFirestore();
  const navigation = useNavigation();

  const [activityName, setActivityName] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [activityDate, setActivityDate] = useState(new Date());
  const [activityLocation, setActivityLocation] = useState("");
  const [activityParticipants, setActivityParticipants] = useState("");
  const [activityType, setActivityType] = useState("");
  const [activityCreator, setActivityCreator] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

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
      try {
        await saveActivityData(user.uid, {
          activityName,
          activityDescription,
          activityDate,
          activityLocation,
          activityParticipants,
          activityType,
          activityCreator: user.uid,
        });
        navigation.navigate("Home");
      } catch (error) {
        console.log("Error saving activity", error);
      }
    }
  };

  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setActivityDate(currentDate);
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

  const validateMapSelect = (selectedLocation) => {
    setModalVisible(false);
    setActivityLocation(selectedLocation);
    console.log("selectedLocation", selectedLocation);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer une nouvelle activité</Text>
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
      <View style={styles.customBtnContainer}>
        <TouchableOpacity onPress={showDatepicker} style={styles.customBtn}>
          <MaterialCommunityIcons name="calendar" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={showTimepicker} style={styles.customBtn}>
          <MaterialCommunityIcons
            name="clock-time-five-outline"
            size={30}
            color="white"
          />
        </TouchableOpacity>
      </View>

      <Text
        style={{
          fontSize: 16,
          color: "darkgrey",
          marginBottom: 20,
        }}
      >
        Date de l'activité : {activityDate.toLocaleString()}
      </Text>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={activityDate}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
        />
      )}

      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
        style={styles.customBtn}
      >
        <MaterialCommunityIcons
          name="map-marker-plus-outline"
          size={30}
          color="white"
        />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalView}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 48.8566,
              longitude: 2.3522,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
          >
            {selectedLocation && (
              <Marker
                draggable
                coordinate={selectedLocation}
                onDragEnd={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
              />
            )}
          </MapView>
          <TouchableOpacity
            onPress={() => {
              validateMapSelect(selectedLocation);
            }}
            style={styles.customBtn}
          >
            <Text style={styles.textStyle}>Valider</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Text
        style={{
          fontSize: 16,
          color: "darkgrey",
          marginBottom: 20,
        }}
      >
        {selectedLocation
          ? "Localisation sélectionnée"
          : "Aucune localisation sélectionnée"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de participants"
        onChangeText={(text) => setActivityParticipants(text)}
        value={activityParticipants}
      />
      <Picker
        selectedValue={activityType}
        onValueChange={(itemValue, itemIndex) => setActivityType(itemValue)}
        style={{ 
          height: 50,
          width: 150,
          marginBottom: 20,
          backgroundColor: "white",
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "lightgrey",
         }}
      >
        <Picker.Item label="Sélectionner un sport" value="" />
        <Picker.Item label="Basket" value="basket" />
        <Picker.Item label="Football" value="football" />
        <Picker.Item label="Tennis" value="tennis" />
        <Picker.Item label="Volley" value="volley" />
        <Picker.Item label="Badminton" value="badminton" />
      </Picker>
      <TouchableOpacity
        onPress={() => handleFormSubmit()}
        style={styles.validateBtn}
      >
        <Text
          style={{
            fontSize: 16,
            color: "white",
            textAlign: "center",
          }}
        >
          Créer l'activité
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    maxWidth: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  customBtnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
  },
  customBtn: {
    height: 50,
    width: "20%",
    backgroundColor: "#fcc174",
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  validateBtn: {
    height: 70,
    width: "40%",
    backgroundColor: "#006bbc",
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  locationStatus: {
    fontSize: 16,
    marginBottom: 20,
  },
  map: {
    width: "100%",
    height: 300,
  },
  modalView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
