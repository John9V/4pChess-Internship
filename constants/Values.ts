import { CoordinatePair, Piece, Tile } from '../types/types';

export const outOfBoundsCoords: CoordinatePair = null;

export const nullPiece: Piece = null;

export const nullTile: Tile = {
  coord: outOfBoundsCoords,
  piece: nullPiece,
  key: -1,
};

export const centerCoord: CoordinatePair = { x: 7, y: 7 };

export const validBishopTransitionCoords: CoordinatePair[] = [
  { x: 0, y: 4 },
  { x: 1, y: 3 },
  { x: 4, y: 0 },
  { x: 3, y: 1 }, // bottom left
  { x: 0, y: 10 },
  { x: 1, y: 11 },
  { x: 4, y: 14 },
  { x: 3, y: 13 }, // top left
  { x: 14, y: 4 },
  { x: 13, y: 3 },
  { x: 10, y: 0 },
  { x: 11, y: 1 }, // bottom right
  { x: 14, y: 10 },
  { x: 13, y: 11 },
  { x: 10, y: 14 },
  { x: 11, y: 13 }, // top right
];
