import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Card, Button } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { getFirestore, collection, getDoc, doc, deleteDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const JoinRequestsScreen = ({ route }) => {

    const navigation = useNavigation();
    const { activity } = route.params;
    const db = getFirestore();
    const [requestsList, setRequestsList] = useState([]);
    const [joinRequests, setJoinRequests] = useState(activity.joinRequests);


    const getNames = async (userId) => {
        const userRef = doc(db, "users", userId);
        const docSnap = await getDoc(userRef);
        let firstName = docSnap.data().firstName;
        let lastName = docSnap.data().lastName;
        return firstName + " " + lastName;
    };

    useEffect(() => {
        setJoinRequests(activity.joinRequests);
    }, [activity]);

    useEffect(() => {
        const fetchUserNames = async () => {
            const namesList = await Promise.all(
                joinRequests.map(async (userId) => {
                    const name = await getNames(userId);
                    return { id: userId, name };
                })
            );
            setRequestsList(namesList);
        };

        fetchUserNames();
    }, [joinRequests]);

    useEffect(() => {
        const fetchUserNames = async () => {
            const namesList = await Promise.all(
                activity.joinRequests.map(async (userId) => {
                    const name = await getNames(userId);
                    return { id: userId, name };
                })
            );
            setRequestsList(namesList);
        };

        fetchUserNames();
    }, [activity.joinRequests]);

    async function confirmJoinRequest(activityId, userId) {
        const db = getFirestore();
        const activityRef = doc(db, "activities", activityId);

        await updateDoc(activityRef, {
            joinRequests: arrayRemove(userId),
            confirmedParticipants: arrayUnion(userId),
        });

        // Update joinRequests state
        const newJoinRequests = joinRequests.filter((id) => id !== userId);
        setJoinRequests(newJoinRequests);
    }

    async function rejectJoinRequest(activityId, userId) {
        const db = getFirestore();
        const activityRef = doc(db, "activities", activityId);

        await updateDoc(activityRef, {
            joinRequests: arrayRemove(userId),
        });

        // Update joinRequests state
        const newJoinRequests = joinRequests.filter((id) => id !== userId);
        setJoinRequests(newJoinRequests);
    }


    async function rejectJoinRequest(activityId, userId) {
        const db = getFirestore();
        const activityRef = doc(db, "activities", activityId);

        await updateDoc(activityRef, {
            joinRequests: arrayRemove(userId),
        });
        const newRequestsList = requestsList.filter((item) => item.id !== userId);
        setRequestsList(newRequestsList);
    }


    return (
        <View style={styles.Maincontainer}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
            }}>
                <TouchableOpacity
                    style={styles.goBackButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialCommunityIcons name="arrow-u-left-top" size={30} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Liste des demandes de participation</Text>
            </View>
            <FlatList
                data={requestsList}
                renderItem={({ item }) => (
                    <Card containerStyle={styles.card}>
                        <Card.Title>{item.name}</Card.Title>
                        <Button
                            title="Accepter"
                            buttonStyle={styles.acceptButton}
                            onPress={() => confirmJoinRequest(activity.id, item.id)}
                        />
                        <Button
                            title="Refuser"
                            buttonStyle={styles.rejectButton}
                            onPress={() => rejectJoinRequest(activity.id, item.id)}
                        />
                    </Card>
                )}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    Maincontainer: {
        flex: 1,
        paddingTop: 40,
        paddingHorizontal: 20,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
        paddingTop: 40,
        paddingHorizontal: 20,
        backgroundColor: '#f5f5f5',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        borderRadius: 10,
        marginBottom: 20,
    },
    acceptButton: {
        backgroundColor: '#4CAF50',
        marginBottom: 10,
    },
    rejectButton: {
        backgroundColor: '#F44336',
    },
    goBackButton: {
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
});
export default JoinRequestsScreen;