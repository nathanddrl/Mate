import React from "react";
import { View } from "react-native";
import { useAuthentication } from "../../utils/hooks/useAuthentication";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { TextInput, Button, Text } from "react-native";
import { StyleSheet } from "react-native";
import { getDoc } from "firebase/firestore";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";


export default function UserDatasForm(props) {
  const navigation = useNavigation();
  const [isNewUser, setIsNewUser] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [gender, setGender] = useState("");
  const [show, setShow] = useState(false);

  const { user } = useAuthentication();

  const db = getFirestore();


  const showDatepicker = () => {
    setShow(true);
  };

  const handleDateChange = (selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShow(false);
    setDateOfBirth(currentDate);
  };
  
  const saveUserData = async (uid, data) => {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, data);
  };

  const handleFormSubmit = async () => {
    if (user) {
      await saveUserData(user.uid, {
        firstName,
        lastName,
        gender,
        dateOfBirth,
        dateOfInscription: new Date(),
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

  const handleSliderGenderChange = (value) => {
    if (value < 0.5) {
      setGender("male");
    } else {
      setGender("female");
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
        <View style={{ 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
         }}>
        <Text style={{ fontSize: 16 }}>Date de naissance: {dateOfBirth.toLocaleDateString()}</Text>
        <TouchableOpacity onPress={showDatepicker} style={styles.customBtn}>
          <MaterialCommunityIcons name="calendar" size={30} color="white" />
        </TouchableOpacity>
        </View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dateOfBirth}
            mode="date"
            is24Hour={true}
            onChange={(event, selectedDate) => handleDateChange(selectedDate)}
          />
        )}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}>
          <Text style={{ fontSize: 16 }}>Homme</Text>
          <Slider
            style={{ width: 200, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#999999"
            maximumTrackTintColor="#000000"
            tapToSeek={true}
            onSlidingComplete={(value) => handleSliderGenderChange(value)}
          />
          <Text style={{ fontSize: 16 }}>Femme</Text>
        </View>
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
  customBtn: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fcc174",
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  }
}
);
