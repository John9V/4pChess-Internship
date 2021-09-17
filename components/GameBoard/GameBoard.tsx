import * as React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import { CoordinatePair, Tile } from '../../types/types';
import {
  boardStyle,
  highlightPositionStyle,
  piecePositionStyle,
} from '../../utility/dynamicStyles';
import { getPieceImage } from '../../utility/functions';

export type gameBoardProps = {
  boardSideLength: number;
  tileSidelength: number;
  tiles: Tile[];
  highlightCoords: CoordinatePair;
  isMobilePlatform: boolean;
  handlePressMobile: (event: GestureResponderEvent) => void;
};

export default function GameBoard({
  boardSideLength,
  tileSidelength,
  tiles,
  highlightCoords,
  isMobilePlatform,
  handlePressMobile,
}: gameBoardProps): React.ReactElement {
  return (
    <ImageBackground
      source={require('../../assets/images/board3.png')}
      style={boardStyle(boardSideLength)}
    >
      {tiles.map((tile) => {
        const piece = tile.piece;
        if (piece != null) {
          return (
            <Image
              source={getPieceImage(piece.type, piece.color)}
              style={piecePositionStyle(
                tile.coord?.x != null ? tile.coord.x : -1,
                tile.coord?.y != null ? tile.coord.y : -1,
                tileSidelength
              )}
              key={tile.key}
            />
          );
        }
      })}
      {highlightCoords?.x != null && highlightCoords.y != null && (
        <View
          style={highlightPositionStyle(
            highlightCoords.x,
            highlightCoords.y,
            tileSidelength
          )}
        />
      )}

      {isMobilePlatform && (
        <TouchableOpacity
          style={styles.touchable}
          onPress={(evt) => handlePressMobile(evt)}
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
    height: '100%',
    zIndex: 10,
  },
});
