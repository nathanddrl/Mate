import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Card, ListItem, Button, Icon } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import {
  getFirestore,
  collection,
  getDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useAuthentication } from "../utils/hooks/useAuthentication";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Calendar from "expo-calendar";
import requestToJoinActivity from "../utils/requestJoinActivity";

const ActivityDetailsScreen = ({ route }) => {
  const { activity } = route.params;
  const date = activity.activityDate.toDate().toLocaleDateString();

  const [creator, setCreator] = useState(null);

  const { user } = useAuthentication();
  const db = getFirestore();
  const navigation = useNavigation();

  // ask for permission to access the calendar if not already done
  const requestCalendarPermission = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        console.log("Calendar access granted");
      } else {
        console.log("Calendar access denied");
      }
      return status;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const getDefaultCalendarSource = async () => {
    const calendars = await Calendar.getCalendarsAsync();
    const defaultCalendars = calendars.filter(
      (each) => each.source.name === "Default"
    );
    return defaultCalendars[0].source;
  };


  useEffect(() => {
    // get user info
    const fetchUser = async () => {
      if (user) {
        const userRef = doc(db, "users", activity.activityCreator);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setCreator(docSnap.data());
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUser();
  }, [user]);

  async function deleteActivity(activityId) {
    const db = getFirestore();
    //only if the user is the creator of the activity
    if (user.uid == activity.activityCreator) {
      try {
        // Remplacez 'activities' par le nom de votre collection d'activités dans Firestore
        await deleteDoc(doc(db, "activities", activityId));
        console.log("Activité supprimée avec succès");
        navigation.goBack();
      } catch (error) {
        console.error("Erreur lors de la suppression de l'activité:", error);
      }
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.goBack();
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
        <Text style={styles.activityText}>
          Créateur : {creator?.firstName} {creator?.lastName}
        </Text>
        <View style={styles.buttonContainer}>
          {
            user &&
            user.uid == activity.activityCreator &&
            activity.joinRequests?.length > 0 && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => {
                  navigation.navigate("JoinRequests", {
                    activity: activity
                  });
                }}
              >
                <MaterialCommunityIcons name="human-handsup" size={30} color="white" />
                <Text style={{ fontSize: 12, fontWeight: "bold", display : "flex", flexDirection : "row", justifyContent : "center", alignItems : "center", color : "white" }}>
                  {activity.joinRequests.length}
                </Text>
              </TouchableOpacity>
            )
          }
          {user && user.uid == activity.activityCreator && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                deleteActivity(activity.id);
              }}
            >
              <MaterialCommunityIcons name="trash-can-outline" size={30} color="white" />
            </TouchableOpacity>
          )}
          {
            user &&
            user.uid != activity.activityCreator &&
            !activity.confirmedParticipants?.includes(user.uid) &&
            !activity.joinRequests?.includes(user.uid) && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => {
                  requestToJoinActivity(activity.id, user.uid);
                  alert("Votre demande a été envoyée");
                }}
              >
                <MaterialCommunityIcons name="account-plus" size={30} color="white" />
              </TouchableOpacity>
            )
          }
          <TouchableOpacity
            style={styles.iconButton}
            onPress={async () => {
              const status = await requestCalendarPermission();
              if (status === "granted") {
                const defaultCalendarSource =
                  Platform.OS === "ios"
                    ? await getDefaultCalendarSource()
                    : { isLocalAccount: true, name: "Expo Calendar" };

                const calendarId = await Calendar.createCalendarAsync({
                  title: "Expo Calendar",
                  color: "blue",
                  entityType: Calendar.EntityTypes.EVENT,
                  sourceId: defaultCalendarSource.id,
                  source: defaultCalendarSource,
                  name: "internalCalendarName",
                  ownerAccount: "personal",
                  accessLevel: Calendar.CalendarAccessLevel.OWNER,
                });

                await Calendar.createEventAsync(calendarId, {
                  title:
                    activity.activityName ??
                    "" + " - " + activity.activityType ??
                    "",
                  startDate: activity.activityDate.toDate(),
                  endDate: activity.activityDate.toDate(),
                  timeZone: "UTC",
                  location: activity.activityLocation,
                  notes: activity.activityDescription ?? "",
                });

                // give feedback to the user
                alert("L'activité a été ajoutée à votre calendrier");
              } else {
                console.log("Calendar access not granted");
              }
            }}
          >
            <MaterialCommunityIcons name="calendar-plus" size={30} color="white" />
          </TouchableOpacity>
        </View>
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
    height: "25%",
    zIndex: 1,
    display : "flex",
    flexDirection : "column",
    justifyContent : "space-between",
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
  joinRequestsButton: {
    width: 60,
    height: 60,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  joinRequestsButton: {
    backgroundColor: "#fcc174",
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  deleteButton: {
    backgroundColor: "#ff6347",
    padding: 10,
    borderRadius: 10,
  },
  joinButton: {
    backgroundColor: "#3cb371",
    padding: 10,
    borderRadius: 10,
  },
  calendarButton: {
    backgroundColor: "#1e90ff",
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  iconButton: {
    backgroundColor: "#006bbc",
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },


});

export default ActivityDetailsScreen;
