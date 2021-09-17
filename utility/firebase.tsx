import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { Game, PieceColor, Team, TeamNumber, Tile } from '../types/types';
import { newTileArray } from './functions';

const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "PROJECT_ID.firebaseapp.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  // if already initialized, use that one
  firebase.app();
}

export const db = firebase.firestore();
export const getAuthRef = (): firebase.auth.Auth => firebase.auth();

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
  } else {
    // User is signed out
  }
});

/**
 * Creates a user in the database.
 */
export const createUser = async (): Promise<void> => {
  try {
    const userCredential = await getAuthRef().signInAnonymously();
    const user = userCredential.user;

    const userRef = db.collection('users').doc(user?.uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      db.collection('users').doc(user?.uid).set({
        userId: user?.uid,
        games: [],
      });
    }
  } catch (err) {
    console.warn('error ' + err);
  }
};

const newJoinCode = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Creates a new game in the database and adds the current user to it. Also
 * adds the game to the user.
 * @returns new game
 */
const createGame = async (): Promise<
  | firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
  | undefined
> => {
  let gameId;
  const joinCode = newJoinCode();
  try {
    const user = getAuthRef().currentUser;
    const userRef = db.collection('users').doc(user?.uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const team1: Team = { users: [], color: 'orange', turnToMove: true };
      const team2: Team = { users: [], color: 'blue', turnToMove: false };
      const team3: Team = { users: [], color: 'purple', turnToMove: false };
      const team4: Team = { users: [], color: 'red', turnToMove: false };
      gameId = db.collection('games').doc().id;
      const gameRef = db.collection('games').doc(gameId);
      gameRef.set({
        gameId: gameId,
        joinCode: joinCode,
        tileState: newTileArray(),
        users: [userRef],
        teams: { team1, team2, team3, team4 },
      });
      addGameToUser(userDoc, gameRef);
    }
    return db.collection('games').doc(gameId);
  } catch (err) {
    console.warn('Error creating game', err);
  }
};

/**
 * Joins a game by adding the user to the game and the game to the user.
 * If no join code is provided a new game is created and joined.
 * @param joinCode code for the desired game to join
 * @returns joincode of the game that was joined
 */
export const joinGame = async (joinCode?: string): Promise<string> => {
  const user = getAuthRef().currentUser;
  const userRef = db.collection('users').doc(user?.uid);
  const userDoc = await userRef.get();

  let returnJoinCode = joinCode;

  if (joinCode) {
    const gameQuery = db
      .collection('games')
      .where('joinCode', '==', joinCode)
      .limit(1);
    await gameQuery
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (gameDoc) => {
          await addGameToUser(userDoc, gameDoc.ref);
          await addUserToGame(gameDoc, userRef);
        });
      })
      .catch((error) => {
        console.warn('Error joining game', error);
      });
  } else {
    const newGame = await (await addGameToUser(userDoc))?.get();
    returnJoinCode = newGame?.data()?.joinCode;
    if (newGame) {
      await addUserToGame(newGame, userRef);
    }
  }

  return returnJoinCode ?? '';
};

/**
 * Adds a game to the user. If the gameRef is not specified, a new game is
 * created and added to the user.
 * @param userDoc user to add the game to
 * @param gameRef game to add to the user
 * @returns game that was added to the user
 */
const addGameToUser = async (
  userDoc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>,
  gameRef?: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
) => {
  let newGame = gameRef;
  if (!newGame) {
    newGame = await createGame();
  }
  if (await userDoc.exists) {
    await db
      .collection('users')
      .doc(userDoc.id)
      .update({
        games: firebase.firestore.FieldValue.arrayUnion(
          gameRef ? gameRef : newGame
        ),
      });
  }
  return newGame ? newGame : gameRef;
};

/**
 * Adds a user to a game.
 * @param gameDoc game to add the user to
 * @param userRef user to add to the game
 */
const addUserToGame = async (
  gameDoc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>,
  userRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
) => {
  if (await gameDoc.exists) {
    await db
      .collection('games')
      .doc(gameDoc.id)
      .update({
        users: firebase.firestore.FieldValue.arrayUnion(userRef),
      });
  }
};

export const deleteGame = (
  gameRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
): void => {
  gameRef?.delete();
};

/**
 * Updates the tile state for a game in the database.
 * @param joinCode code of the game to update the state for
 * @param tiles new tile state to set
 */
export const updateTileState = (joinCode: string, tiles: Tile[]): void => {
  db.collection('games')
    .where('joinCode', '==', joinCode)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        db.collection('games').doc(doc.id).update({
          tileState: tiles,
        });
      });
    })
    .catch((error) => {
      console.warn('Error updating tile state: ', error);
    });
};

/**
 * Calls a callback function passing in the new game state once the game
 * state was changed in the database for a specific game given its join code.
 * @param joinCode code of the game to listen for updates for
 * @param takeNewGameState callback function that accepts new game state
 */
export const listenForGameUpdates = (
  joinCode: string,
  takeNewGameState: (gameStateData: Game | undefined) => void
): void => {
  db.collection('games')
    .withConverter(gameConverter)
    .where('joinCode', '==', joinCode)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        db.collection('games')
          .withConverter(gameConverter)
          .doc(doc.id)
          .onSnapshot((doc) => {
            takeNewGameState(doc.data());
          });
      });
    })
    .catch((error) => {
      console.warn('Error getting updates: ', error);
    });
};

/**
 * Assigns the current user to a team in the database for a game given its
 * join code. Also leaves any other team the user was already on in the
 * given game.
 * @param joinCode code of the game to pick a team in
 * @param team team to pick
 */
export const pickTeamDB = (joinCode: string, team: TeamNumber): void => {
  const currentUserId = getAuthRef().currentUser?.uid;
  db.collection('games')
    .where('joinCode', '==', joinCode)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let valueToSet;
        let valueToRemove;
        switch (team) {
          case 1:
            valueToRemove = {
              team2: {
                users: firebase.firestore.FieldValue.arrayRemove(currentUserId),
              },
              team3: {
                users: firebase.firestore.FieldValue.arrayRemove(currentUserId),
              },
              team4: {
                users: firebase.firestore.FieldValue.arrayRemove(currentUserId),
              },
            };
            valueToSet = {
              team1: {
                users: firebase.firestore.FieldValue.arrayUnion(currentUserId),
              },
            };
            break;
          case 2:
            valueToRemove = {
              team1: {
                users: firebase.firestore.FieldValue.arrayRemove(currentUserId),
              },
              team3: {
                users: firebase.firestore.FieldValue.arrayRemove(currentUserId),
              },
              team4: {
                users: firebase.firestore.FieldValue.arrayRemove(currentUserId),
              },
            };
            valueToSet = {
              team2: {
                users: firebase.firestore.FieldValue.arrayUnion(currentUserId),
              },
            };
            break;
          case 3:
            valueToRemove = {
              team1: {
                users: firebase.firestore.FieldValue.arrayRemove(currentUserId),
              },
              team2: {
                users: firebase.firestore.FieldValue.arrayRemove(currentUserId),
              },
              team4: {
                users: firebase.firestore.FieldValue.arrayRemove(currentUserId),
              },
            };
            valueToSet = {
              team3: {
                users: firebase.firestore.FieldValue.arrayUnion(currentUserId),
              },
            };
            break;
          case 4:
            valueToRemove = {
              team1: {
                users: firebase.firestore.FieldValue.arrayRemove(currentUserId),
              },
              team2: {
                users: firebase.firestore.FieldValue.arrayRemove(currentUserId),
              },
              team3: {
                users: firebase.firestore.FieldValue.arrayRemove(currentUserId),
              },
            };
            valueToSet = {
              team4: {
                users: firebase.firestore.FieldValue.arrayUnion(currentUserId),
              },
            };
            break;
        }
        if (valueToSet) {
          db.collection('games').doc(doc.id).set(
            {
              teams: valueToSet,
            },
            { merge: true }
          );
        }
        if (valueToRemove) {
          db.collection('games').doc(doc.id).set(
            {
              teams: valueToRemove,
            },
            { merge: true }
          );
        }
      });
    })
    .catch((error) => {
      console.warn('Error joining team: ', error);
    });
};

/**
 * Triggers a callback function if the current user is on a specified team
 * in the database game.
 * @param joinCode game the teams are checked in
 * @param team team to check for user
 * @param action callback funtion
 */
export const doActionIfCurrentUserOnTeam = async (
  joinCode: string,
  team: TeamNumber | undefined,
  action: () => void
): Promise<void> => {
  const currentUserId = getAuthRef().currentUser?.uid;
  await db
    .collection('games')
    .where('joinCode', '==', joinCode)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(async (doc) => {
        const teams = doc.data().teams;
        let userIsOnTeam;
        switch (team) {
          case 1:
            userIsOnTeam = teams.team1.users.includes(currentUserId);
            break;
          case 2:
            userIsOnTeam = teams.team2.users.includes(currentUserId);
            break;
          case 3:
            userIsOnTeam = teams.team3.users.includes(currentUserId);
            break;
          case 4:
            userIsOnTeam = teams.team4.users.includes(currentUserId);
            break;
        }
        if (userIsOnTeam) {
          action();
        }
      });
    })
    .catch((error) => {
      console.warn('Error getting documents: ', error);
    });
};

const gameConverter = {
  toFirestore(game: Game): firebase.firestore.DocumentData {
    return {
      gameId: game.gameId,
      joinCode: game.joinCode,
      tileState: game.tileState,
      users: game.users,
      teams: game.teams,
    };
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Game {
    const data = snapshot.data(options);
    return {
      gameId: data.gameId,
      joinCode: data.joinCode,
      tileState: data.tileState,
      users: data.users,
      teams: data.teams,
    };
  },
};

/**
 * Based on the validity of the given join code an appropriate callback
 * function is called.
 * @param joinCode code to check for validity
 * @param action callback called on valid join code
 * @param handleInvalidJoinCode callback called on invalid join code
 */
export const doActionIfJoinCodeValid = (
  joinCode: string,
  action: (gameJoinCode: string) => void,
  handleInvalidJoinCode?: () => void
): void => {
  if (!joinCode || joinCode.length !== 9) {
    handleInvalidJoinCode && handleInvalidJoinCode();
    return;
  }
  db.collection('games')
    .where('joinCode', '==', joinCode)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        action(joinCode);
      } else {
        handleInvalidJoinCode && handleInvalidJoinCode();
      }
    })
    .catch((error) => {
      console.warn('Error checking join code: ', error);
    });
};

/**
 * Gets the team color for the current user in a game.
 * @param joinCode code of the game
 * @param storeTeamColor callback function that accepts the team color
 */
export const getTeamColor = (
  joinCode: string,
  storeTeamColor: (color: PieceColor) => void
): void => {
  const userId = getAuthRef().currentUser?.uid;
  if (!userId) {
    return;
  }

  db.collection('games')
    .where('joinCode', '==', joinCode)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const teams = doc.data().teams;
        const team1 = teams.team1;
        const team2 = teams.team2;
        const team3 = teams.team3;
        const team4 = teams.team4;

        if (team1.users.includes(userId)) {
          storeTeamColor(team1.color);
        } else if (team2.users.includes(userId)) {
          storeTeamColor(team2.color);
        } else if (team3.users.includes(userId)) {
          storeTeamColor(team3.color);
        } else if (team4.users.includes(userId)) {
          storeTeamColor(team4.color);
        }
      });
    })
    .catch((error) => {
      console.warn('Error getting color of team: ', error);
    });
};
