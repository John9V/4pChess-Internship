import { ImageStyle } from 'react-native';

export const piecePositionStyle = (
  x: number,
  y: number,
  tileSidelength: number,
  scale = 0.55,
  topOffset = -8
): ImageStyle => {
  return {
    zIndex: 1,
    position: 'absolute',
    width: tileSidelength * scale,
    height: tileSidelength * scale,
    top:
      (((14 - y) * tileSidelength) / 2) * 0.995 +
      ((1 - scale) * tileSidelength) / 2 +
      topOffset,
    left:
      ((x * tileSidelength) / 2) * 0.995 + ((1 - scale) * tileSidelength) / 2,
  };
};

export const highlightPositionStyle = (
  x: number,
  y: number,
  tileSidelength: number
): ImageStyle => {
  const style = piecePositionStyle(x, y, tileSidelength, 0.7, 0);
  style.zIndex = 0;
  style.backgroundColor = 'yellow';
  style.opacity = 0.6;
  style.transform = [{ rotate: '45deg' }];
  return style;
};

export const boardStyle = (boardSideLength: number): ImageStyle => {
  return {
    borderColor: 'black',
    borderWidth: 2,
    width: '100%',
    height: '100%',
    maxWidth: boardSideLength,
    maxHeight: boardSideLength,
    // transform: [{ rotate: '45deg'}],
  };
};
