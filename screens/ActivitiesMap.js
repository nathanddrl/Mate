import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { useAuthentication } from "../utils/hooks/useAuthentication";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

export default function ActivitiesMap() {
  const { user } = useAuthentication();
  const db = getFirestore();
  const navigation = useNavigation();

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      if (user) {
        // retrieve all activities
        const activitiesRef = collection(db, "activities");
        const querySnapshot = await getDocs(activitiesRef);
        const activities = [];

        querySnapshot.forEach((doc) => {
          activities.push({ id: doc.id, ...doc.data() });
        });

        setActivities(activities);
      }
    };

    fetchActivities();
  }, [user]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 48.856614,
          longitude: 2.3522219,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {activities.map((activity) => (
          activity.activityLocation ? (

          <Marker
            key={activity.id}
            coordinate={{
              latitude: activity.activityLocation.latitude,
              longitude: activity.activityLocation.longitude,
            }}
            onPress={() => {
              navigation.navigate("ActivityDetails", { activity });
            }}
          />
          ) : null
        ))}
      </MapView>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("Home");
        }}
      >
        <MaterialCommunityIcons
          name="arrow-u-left-top"
          size={24}
          color="white"
        />
      </TouchableOpacity>


        <View style={{ 
            position: "absolute",
            bottom: 10,
            width: "100%",
            alignItems: "center",
         }}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une activité"
          value={search}
          onChangeText={(text) => {
            setSearch(text);
          }}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => {
            console.log("search");
          }}
        >
          <MaterialCommunityIcons name="magnify" size={24} color="white" />
        </TouchableOpacity>
        </View>
      </View>



    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#fcc174",
    width: 60,
    height: 60,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "90%",
    height: 60,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 25,
    bottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  searchInput: {
    width: "80%",
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingLeft: 20,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  searchButton: {
    width: 40,
    height: 40,
    backgroundColor: "#fcc174",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
});
