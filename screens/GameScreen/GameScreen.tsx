import * as React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  GestureResponderEvent,
} from 'react-native';
import {
  coordsFromLocation,
  newTileArray,
  findTileByCoords,
  isOutOfBounds,
  isSameCoord,
  isNullPiece,
  canPieceMove,
  useComponentDidMount,
} from '../../utility/functions';
import {
  CoordinatePair,
  Game,
  Tile,
  PieceType,
  PieceColor,
} from '../../types/types';
import {
  centerCoord,
  nullPiece,
  nullTile,
  outOfBoundsCoords,
} from '../../constants/Values';
import {
  createUser,
  doActionIfCurrentUserOnTeam,
  doActionIfJoinCodeValid,
  getTeamColor,
  joinGame,
  listenForGameUpdates,
  updateTileState,
} from '../../utility/firebase';
import { useNavigation } from '@react-navigation/native';
import { GameScreenRoute } from '../../types';
import GameBoard from '../../components/GameBoard/GameBoard';
import PawnPromotionPopup from '../../components/PawnPromotionPopup/PawnPromotionPopup';

export default function GameScreen({ route }: GameScreenRoute): JSX.Element {
  useComponentDidMount(() => {
    doActionIfJoinCodeValid(joinCode, onValidJoinCode, toHome);
    !testMode && getTeamColor(joinCode, storeTeamColor);
  });

  const [
    pawnPromotionPopupIsVisible,
    setPawnPromotionPopupIsVisible,
  ] = React.useState(false);
  const [
    pieceTypeToPromotePawnTo,
    setPieceTypeToPromotePawnTo,
  ] = React.useState<PieceType>('pawn');
  const [teamColor, setTeamColor] = React.useState<PieceColor>('white');

  const navigation = useNavigation();

  const platform = Platform.OS;
  const mobilePlatform = platform === 'android' || platform === 'ios';
  const webPlatform = platform === 'web';

  const joinCode = route.params?.joinCode ?? '';
  const testMode = route.params?.test
    ? route.params?.test.toString() === 'true'
    : false;

  let tilesWeb = newTileArray();
  const [tiles, setTiles] = React.useState(newTileArray());
  const [highlightCoords, setHighlightCoords] = React.useState(
    outOfBoundsCoords
  );

  let prevoiouslySelectedTileWeb = nullTile;
  const [
    prevoiouslySelectedTileMobile,
    setPrevoiouslySelectedTileMobile,
  ] = React.useState(nullTile);

  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;
  const boardSideLength =
    windowHeight < windowWidth ? windowHeight : windowWidth;
  const boardOffsetX = (windowWidth - boardSideLength) / 2;
  const boardOffsetY = (windowHeight - boardSideLength) / 2;
  const tileSidelength = boardSideLength / 8;

  const setTilesWeb = (newTiles: Tile[]) => {
    tilesWeb = newTiles;
    setTiles(newTiles);
  };

  const toHome = () => {
    !testMode && navigation.navigate('Home');
  };

  const takeNewGameState = (gameStateData: Game | undefined) => {
    if (gameStateData === undefined) {
      return;
    }
    if (webPlatform) {
      setTilesWeb(gameStateData.tileState);
    } else if (mobilePlatform) {
      setTiles(gameStateData.tileState);
    }
  };

  const setGameListener = () => {
    listenForGameUpdates(joinCode, takeNewGameState);
  };

  const onValidJoinCode = () => {
    createUser();
    joinGame(joinCode);
    setGameListener();
  };

  const storeTeamColor = (color: PieceColor) => {
    setTeamColor(color);
  };

  const getCoordsMobile = (evt: GestureResponderEvent) => {
    const clickX = evt.nativeEvent.locationX;
    const clickY = evt.nativeEvent.locationY;
    return coordsFromLocation(clickX, clickY, boardSideLength);
  };

  const getCoordsWeb = (event: MouseEvent) => {
    const clickX = event.clientX - boardOffsetX;
    const clickY = event.clientY - boardOffsetY;
    return coordsFromLocation(clickX, clickY, boardSideLength);
  };

  const handlePressMobile = async (evt: GestureResponderEvent) => {
    const coords = getCoordsMobile(evt);
    setPrevoiouslySelectedTileMobile(
      await selectTileAndAttemptMove(coords, prevoiouslySelectedTileMobile)
    );
  };

  const handleClickWeb = async (event: MouseEvent) => {
    const coords = getCoordsWeb(event);
    prevoiouslySelectedTileWeb = await selectTileAndAttemptMove(
      coords,
      prevoiouslySelectedTileWeb
    );
  };

  /**
   * Attempts to move a piece from a tile to another. Highlights the selected
   * tile appropriately based on whether the attempted move was successfull.
   * @param toCoords the coordinates to attempt to move to
   * @param fromTile the tile to move the containing piece from
   * @returns previously selected tile
   */
  const selectTileAndAttemptMove = async (
    toCoords: CoordinatePair,
    fromTile: Tile
  ) => {
    if (!isSameCoord(toCoords, centerCoord)) {
      setPieceTypeToPromotePawnTo('pawn');
    }

    const toTile = findTileByCoords(tiles, toCoords);
    let promotionWasUsed = false;

    let teamPieceIsOnOneOrBothChosenTiles = testMode;
    !testMode &&
      (await doActionIfCurrentUserOnTeam(joinCode, fromTile.piece?.team, () => {
        teamPieceIsOnOneOrBothChosenTiles = true;
      }));
    !testMode &&
      (await doActionIfCurrentUserOnTeam(joinCode, toTile.piece?.team, () => {
        teamPieceIsOnOneOrBothChosenTiles = true;
      }));

    const movingTeamPawnToCenter =
      teamPieceIsOnOneOrBothChosenTiles &&
      fromTile.piece?.type === 'pawn' &&
      isSameCoord(toCoords, centerCoord);

    if (movingTeamPawnToCenter) {
      let promotionIsTriggered = false;
      setPieceTypeToPromotePawnTo((pieceType) => {
        if (pieceType !== 'pawn') {
          promotionWasUsed = true;
        } else {
          promotionIsTriggered = true;
        }
        return pieceType;
      });
      if (promotionIsTriggered) {
        displayPawnPromotionPrompt();
        return fromTile;
      }
    }

    let cancelMove = false;
    setPawnPromotionPopupIsVisible((isVisible) => {
      if (isVisible) {
        cancelMove = true;
      }
      return isVisible;
    });
    if (cancelMove) {
      return fromTile;
    }

    let selectedTile = nullTile;
    if (!isOutOfBounds(toCoords)) {
      await setHighlightCoords((highlightCoords) => {
        let newHighlightCoords = isSameCoord(toCoords, highlightCoords)
          ? outOfBoundsCoords
          : toCoords;

        if (mobilePlatform) {
          selectedTile = findTileByCoords(tiles, newHighlightCoords);
        } else if (webPlatform) {
          selectedTile = findTileByCoords(tilesWeb, newHighlightCoords);
        }

        if (
          teamPieceIsOnOneOrBothChosenTiles &&
          movePiece(fromTile, selectedTile)
        ) {
          selectedTile = nullTile;
          newHighlightCoords = outOfBoundsCoords;
        }

        return newHighlightCoords;
      });
    }
    if (promotionWasUsed) {
      setPieceTypeToPromotePawnTo('pawn');
    }
    return selectedTile;
  };

  const displayPawnPromotionPrompt = () => {
    !testMode && getTeamColor(joinCode, storeTeamColor);

    let promptAlreadyDisplayed = false;
    setPieceTypeToPromotePawnTo((x) => {
      if (x !== 'pawn') {
        setPieceTypeToPromotePawnTo('pawn');
        promptAlreadyDisplayed = true;
      }
      return x;
    });

    if (promptAlreadyDisplayed) {
      return;
    }

    setPawnPromotionPopupIsVisible(true);
  };

  const confirmPawnPromotion = (type: PieceType) => {
    setPieceTypeToPromotePawnTo(type);
  };

  const dismissPromotionPopup = () => {
    setTimeout(() => {
      setPawnPromotionPopupIsVisible(false);
    }, 500);
  };

  /**
   * Moves a piece from one tile to another if the piece can make a correct move.
   * @param fromTile tile the piece is to be moved from
   * @param toTile tile the piece iss to move to
   * @returns boolean representing if the piece was moved successfully
   */
  const movePiece = (fromTile: Tile, toTile: Tile): boolean => {
    let allTiles = newTileArray();

    if (mobilePlatform) {
      allTiles = tiles;
    } else if (webPlatform) {
      allTiles = tilesWeb;
    }

    if (isNullPiece(fromTile.piece)) {
      return false;
    }
    if (
      isSameCoord(toTile.coord, outOfBoundsCoords) ||
      isSameCoord(toTile.coord, fromTile.coord)
    ) {
      return false;
    }
    if (!canPieceMove(fromTile, toTile, allTiles)) {
      return false;
    }

    if (webPlatform) {
      for (const tile of allTiles) {
        if (isSameCoord(tile.coord, toTile.coord)) {
          tile.piece = fromTile.piece;
          setPieceTypeToPromotePawnTo((promotionPieceType) => {
            if (
              tile.piece &&
              promotionPieceType !== 'pawn' &&
              isSameCoord(toTile.coord, centerCoord)
            ) {
              tile.piece.type = promotionPieceType;
            }
            return promotionPieceType;
          });
        }
      }
      for (const tile of allTiles) {
        if (isSameCoord(tile.coord, fromTile.coord)) {
          tile.piece = nullPiece;
        }
      }
      joinCode && updateTileState(joinCode, allTiles);
      setTilesWeb(allTiles);
    } else if (mobilePlatform) {
      setTiles((tiles) => {
        for (const tile of tiles) {
          if (isSameCoord(tile.coord, toTile.coord)) {
            tile.piece = fromTile.piece;
            setPieceTypeToPromotePawnTo((promotionPieceType) => {
              if (
                tile.piece &&
                promotionPieceType !== 'pawn' &&
                isSameCoord(toTile.coord, centerCoord)
              ) {
                tile.piece.type = promotionPieceType;
              }
              return promotionPieceType;
            });
          }
        }
        for (const tile of tiles) {
          if (isSameCoord(tile.coord, fromTile.coord)) {
            tile.piece = nullPiece;
          }
        }
        joinCode && updateTileState(joinCode, tiles);
        return tiles;
      });
    } else {
      // unknown platform
      return false;
    }
    return true;
  };

  if (webPlatform) {
    // sets click listener
    React.useEffect(() => {
      addEventListener('mouseup', handleClickWeb);
      return () => {
        removeEventListener('mouseup', handleClickWeb);
      };
    }, []);
  }

  return (
    <View style={styles.container}>
      <GameBoard
        boardSideLength={boardSideLength}
        tileSidelength={tileSidelength}
        tiles={tiles}
        highlightCoords={highlightCoords}
        isMobilePlatform={mobilePlatform}
        handlePressMobile={handlePressMobile}
      />
      <PawnPromotionPopup
        pawnPromotionPopupIsVisible={pawnPromotionPopupIsVisible}
        teamColor={teamColor}
        tileSidelength={tileSidelength}
        confirmPawnPromotion={confirmPawnPromotion}
        dismissPromotionPopup={dismissPromotionPopup}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
