import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Game: 'Game',
      GameLobby: 'Lobby',
      Root: '*',
    },
    // NotFound: '*',
  },
};
