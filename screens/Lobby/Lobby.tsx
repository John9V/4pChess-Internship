import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import TeamInfo from '../../components/TeamInfo/TeamInfo';
import { LobbyRoute } from '../../types';
import { Game, TeamNumber } from '../../types/types';
import {
  createUser,
  doActionIfJoinCodeValid,
  joinGame,
  listenForGameUpdates,
  pickTeamDB,
} from '../../utility/firebase';
import { useComponentDidMount } from '../../utility/functions';

export default function Lobby({ route }: LobbyRoute): JSX.Element {
  const navigation = useNavigation();
  const joinCode = route?.params?.joinCode ?? '';
  const [playerCount, setPlayerCount] = React.useState(1);
  const [teamPlayerCount, setTeamPlayerCount] = React.useState([0, 0, 0, 0]);

  const toHome = () => {
    navigation.navigate('Home');
  };

  const toGame = () => {
    navigation.navigate('Game', { joinCode: joinCode });
  };

  const onValidJoinCode = () => {
    createUser();
    joinGame(joinCode);
  };

  const takeNewGameState = (gameStateData: Game | undefined) => {
    if (gameStateData === undefined) {
      return;
    }
    setPlayerCount(gameStateData.users.length);
    const teams = gameStateData.teams;
    setTeamPlayerCount([
      teams.team1.users.length,
      teams.team2.users.length,
      teams.team3.users.length,
      teams.team4.users.length,
    ]);
  };

  const getJoinTeamFunction = (team: TeamNumber) => {
    return () => pickTeamDB(joinCode, team);
  };

  useComponentDidMount(() => {
    listenForGameUpdates(joinCode, takeNewGameState);
    doActionIfJoinCodeValid(joinCode, onValidJoinCode, toHome);
    setTeamPlayerCount([0, 0, 0, 0]);
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lobby</Text>
      <View style={styles.filler1} />
      <Text>Join Code: {joinCode}</Text>
      <View style={styles.filler1} />
      <Text>Total Players: {playerCount}</Text>
      <View style={styles.filler1} />
      <View style={styles.teamsContainer}>
        <TeamInfo
          teamNumber={1}
          getJoinTeamFunction={getJoinTeamFunction}
          teamPlayerCount={teamPlayerCount}
        />
        <TeamInfo
          teamNumber={2}
          getJoinTeamFunction={getJoinTeamFunction}
          teamPlayerCount={teamPlayerCount}
        />
      </View>
      <View style={styles.teamsContainer}>
        <TeamInfo
          teamNumber={3}
          getJoinTeamFunction={getJoinTeamFunction}
          teamPlayerCount={teamPlayerCount}
        />
        <TeamInfo
          teamNumber={4}
          getJoinTeamFunction={getJoinTeamFunction}
          teamPlayerCount={teamPlayerCount}
        />
      </View>
      <View style={styles.filler2} />
      <Button title={'   Play   '} onPress={toGame} />
      <View style={styles.filler2} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamsContainer: {
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '67%',
    marginBottom: 15,
  },
  title: {
    fontSize: 40,
  },
  filler1: {
    height: 15,
  },
  filler2: {
    height: 40,
  },
});
