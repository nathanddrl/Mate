import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Card, ListItem, Button, Icon } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc 
} from "firebase/firestore";
import { useAuthentication } from "../utils/hooks/useAuthentication";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ActivityDetailsScreen = ({ route }) => {
  const { activity } = route.params;
  const date = activity.activityDate.toDate().toLocaleDateString();

  const { user } = useAuthentication();
  const db = getFirestore();
  const navigation = useNavigation();

  async function deleteActivity(activityId) {
    const db = getFirestore();
  
    try {
      // Remplacez 'activities' par le nom de votre collection d'activités dans Firestore
      await deleteDoc(doc(db, 'activities', activityId));
      console.log('Activité supprimée avec succès');
      navigation.goBack();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'activité:', error);
    }
  }

  return (
    <View style={styles.container}>
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
      <Card containerStyle={styles.activityCard}>
        <Card.Title style={styles.activityTitle}>
          {activity.activityName}
        </Card.Title>
        <Card.Divider />
        <Text style={styles.activityText}>
          Description: {activity.activityDescription}
        </Text>
        <Text style={styles.activityText}>Date: {date}</Text>
        <Button
          title="Supprimer l'activité"
          onPress={() => {
            deleteActivity(activity.id);
          }}
        />
      </Card>
      {activity.activityLocation ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: activity.activityLocation.latitude,
            longitude: activity.activityLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: activity.activityLocation.latitude,
              longitude: activity.activityLocation.longitude,
            }}
            title={activity.activityName}
            description={activity.activityDescription}
          />
        </MapView>
      ) : (
        <Text style={styles.locationStatus}>Aucun lieu n'a été renseigné</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  activityCard: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    position: "absolute",
    width: "100%",
    bottom: 0,
    height: "20%",
    zIndex: 1,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  activityText: {
    fontSize: 14,
  },
  map: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  locationStatus: {
    marginTop: 10,
    fontSize: 16,
  },
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
    zIndex: 2,
  },
});

export default ActivityDetailsScreen;
