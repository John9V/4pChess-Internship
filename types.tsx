export type RootStackParamList = {
  Home: undefined;
  NotFound: undefined;
  Game: undefined;
  GameLobby: undefined;
};

export type BottomTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
};

export type TabOneParamList = {
  TabOneScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};

export type GameScreenRoute = {
  route: {
    params: {
      joinCode: string | undefined;
      test: string | undefined;
    };
  };
};

export type LobbyRoute = {
  route: {
    params: {
      joinCode: string | undefined;
    };
  };
};
