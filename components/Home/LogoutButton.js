import React from 'react';
import { Button } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/auth';

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.log('Error while logging out:', error);
    }
  };

  return <Button title="Déconnection" onPress={handleLogout} />;
};

export default LogoutButton;
