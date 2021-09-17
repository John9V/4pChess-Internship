import * as React from 'react';
import { StyleSheet, View, ImageBackground, Dimensions } from 'react-native';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/board.png')}
        style={styles.board}
      >

      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  board: {
    borderColor: 'blue',
    borderWidth: 2,
    width: '100%',
    height: '100%',
    maxWidth: Dimensions.get('window').height,
    maxHeight: Dimensions.get('window').width,
  },
});
