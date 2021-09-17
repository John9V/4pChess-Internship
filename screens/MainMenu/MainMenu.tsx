import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { StyleSheet, View, Text, Button, TextInput } from 'react-native';
import {
  joinGame,
  createUser,
  doActionIfJoinCodeValid,
} from '../../utility/firebase';
import { useComponentDidMount } from '../../utility/functions';

export default function MainMenu(): JSX.Element {
  const [joinCodeInput, onChangeJoinCodeInput] = React.useState('');
  const navigation = useNavigation();

  const toGame = () => {
    navigation.navigate('Game', { test: true });
  };

  const toGameLobby = async (joinCode?: string) => {
    const finalJoinCode = joinCode ? joinCode : await joinGame();
    navigation.navigate('GameLobby', { joinCode: finalJoinCode });
  };

  const handleInvalidJoinCode = () => {
    onChangeJoinCodeInput('');
  };

  const handleJoinGamePress = async () => {
    doActionIfJoinCodeValid(joinCodeInput, toGameLobby, handleInvalidJoinCode);
  };

  useComponentDidMount(() => {
    createUser();
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Main Menu</Text>
      <View style={styles.filler1} />
      <Button title={'Create Game'} onPress={() => toGameLobby()} />
      <View style={styles.filler1} />
      <TextInput
        onChangeText={onChangeJoinCodeInput}
        value={joinCodeInput}
        placeholder={'Enter Game Join Code'}
        style={styles.codePrompt}
      />
      <Button
        title={'Join Game'}
        onPress={handleJoinGamePress}
        disabled={joinCodeInput.length !== 9}
      />
      <View style={styles.filler2} />
      <Button title={'Offline Test Game Screen'} onPress={toGame} />
      <Text style={styles.version}>v 0.1.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
  },
  codePrompt: {
    textAlign: 'center',
    backgroundColor: 'white',
    borderRadius: 1,
    borderColor: 'black',
    marginBottom: 5,
  },
  filler1: {
    height: 40,
  },
  filler2: {
    height: 60,
  },
  version: {
    color: 'gainsboro',
    marginTop: 20,
  },
});
