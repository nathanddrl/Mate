import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { StackScreenProps } from '@react-navigation/stack';
import PropTypes from 'prop-types';


const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Bienvenue sur Mate !</Text>

      <View style={styles.buttons}>
        <Button title="Se connecter" buttonStyle={styles.button} onPress={() => navigation.navigate('Sign In')} />
        <Button title="S'inscrire ?" type="outline" buttonStyle={styles.button} onPress={() => navigation.navigate('Sign Up')} />
      </View>
    </View>
  );
};

export default WelcomeScreen;

WelcomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttons: {
    marginTop: 20,
  },
  button: {
    marginVertical: 10,
  },
});
