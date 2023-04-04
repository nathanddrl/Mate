import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAuthentication } from "../utils/hooks/useAuthentication";
import { Button } from "react-native-elements";
import { signOut } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { useState, useEffect, useLayoutEffect } from "react";
import { TextInput } from "react-native";
import UserDatasForm from "../components/Home/UserDatasForm";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { Card } from "react-native-elements";
import { ScrollView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useAuthentication();

  const [isNewUser, setIsNewUser] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [activities, setActivities] = useState([]);

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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderRight />,
    });
  }, [navigation]);

  const HeaderRight = () => {
    const navigation = useNavigation();

    const fetchActivities = async () => {
      if (user) {
        // retrieve all activities
        const activitiesRef = collection(db, "activities");
        const querySnapshot = await getDocs(activitiesRef);
        const newActivities = [];

        querySnapshot.forEach((doc) => {
          newActivities.push({ id: doc.id, ...doc.data() });
        });
        setActivities(newActivities);
        navigation.navigate("Home");
      }
    };

    const handleIconPress = () => {
      navigation.navigate("ActivitiesMap");
    };

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: 100,
          marginRight: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            fetchActivities();
          }}
          style={{ marginRight: 10 }}
        >
          <MaterialCommunityIcons name="refresh" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleIconPress} style={{ marginRight: 10 }}>
          <MaterialCommunityIcons
            name="map-search-outline"
            size={30}
            color="white"
          />
        </TouchableOpacity>
      </View>
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderLeft />,
    });
  }, [navigation]);

  const HeaderLeft = () => {
    const navigation = useNavigation();

    const handleIconPress = () => {};

    return (
      <View
        style={{
          flexDirection: "row",
          marginLeft: 10,
          backgroundColor: "#006bbc",
        }}
      >
        <Text
          style={{
            fontSize: 36,
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          Mate
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.maincontainer}>
      {isNewUser ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#006bbc",
            width: "100%",
          }}
        >
          <Button title="Logout" onPress={handleLogout} />
          <UserDatasForm />
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.container}>
            <Text
              style={{
                fontSize: 36,
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              Bonjour {firstName}
            </Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#fff",
                marginTop: 20,
              }}
            >
              Voici les activités disponibles
            </Text>
            {activities.length > 0 ? (
              <ScrollView contentContainerStyle={styles.scrollView}>
                {activities.map((activity) => {
                  const date = activity.activityDate
                    .toDate()
                    .toLocaleDateString();

                  return (
                    <TouchableOpacity
                      key={activity.id}
                      style={styles.activityContainer}
                      activeOpacity={0.9}
                      onPress={() =>
                        navigation.navigate("ActivityDetails", { activity })
                      }
                    >
                      <Card containerStyle={styles.activityCard}>
                        <Card.Title style={styles.activityTitle}>
                          {activity.activityName}
                        </Card.Title>
                        <Card.Divider />
                        <Text style={styles.activityText}>
                          Description: {activity.activityDescription}
                        </Text>
                        <Text style={styles.activityText}>Date: {date}</Text>
                        <Text style={styles.activityText}>Lieu</Text>
                      </Card>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            ) : (
              <Text style={{ color: "#fff", fontSize: 20, marginTop: 20 }}>
                Aucune activité disponible
              </Text>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate("CreateActivity")}
                style={styles.bottomButton}
              >
                <MaterialCommunityIcons
                  name="plus-box-multiple-outline"
                  size={30}
                  color="#006bbc"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleLogout()}
                style={styles.bottomButton}
              >
                <MaterialCommunityIcons
                  name="logout"
                  size={30}
                  color="#006bbc"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginTop: 10,
  },
  activityContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  activityCard: {
    borderRadius: 10,
    marginBottom: 10,
    width: "90%",
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  activityText: {
    fontSize: 14,
    marginBottom: 5,
  },
  scrollView: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginVertical: 20,
    paddingVertical: 20,
    backgroundColor: "#fff",
    height: "100%",
    borderRadius: 45,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    height: 60,
    position: "absolute",
    backgroundColor: "#fff",
    padding: 10,
    width: "90%",
    borderRadius: 25,
    bottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  bottomButton: {
    width: "100%",
  },
  maincontainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    backgroundColor: "#006bbc",
  },
});
