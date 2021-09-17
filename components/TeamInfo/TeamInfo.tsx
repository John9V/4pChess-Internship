import * as React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { PieceColor, TeamNumber } from '../../types/types';

export type TeamInfoProps = {
  teamNumber: TeamNumber;
  getJoinTeamFunction: (team: TeamNumber) => () => void;
  teamPlayerCount: number[];
};

export default function TeamInfo({
  teamNumber,
  getJoinTeamFunction,
  teamPlayerCount,
}: TeamInfoProps): React.ReactElement {
  let playerCount;
  let teamColor: PieceColor;

  /**
   * Capitalizes the first character in the given string.
   * @param value string to capitalize the first letter of
   * @returns value but with the first letter capitalized
   */
  const toProperName = (value: string): string => {
    if (value.length > 0) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    } else {
      return value;
    }
  };

  try {
    playerCount = teamPlayerCount[teamNumber - 1];
  } catch (error) {
    console.warn('Team count error');
  }

  switch (teamNumber) {
    case 1:
      teamColor = 'orange';
      break;
    case 2:
      teamColor = 'blue';
      break;
    case 3:
      teamColor = 'purple';
      break;
    case 4:
      teamColor = 'red';
      break;
  }

  return (
    <View style={styles.teamBox}>
      <Text style={styles.secondaryTitle}>Team {toProperName(teamColor)}</Text>
      <Button
        color={teamColor}
        title={'Join'}
        onPress={getJoinTeamFunction(teamNumber)}
      />
      <Text>Players on Team: {playerCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  teamBox: {
    marginHorizontal: 20,
    display: 'flex',
    flex: 1,
  },
  secondaryTitle: {
    fontSize: 25,
    width: 200,
    textAlign: 'center',
  },
});
