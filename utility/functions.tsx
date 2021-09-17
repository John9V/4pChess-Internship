import { useEffect } from 'react';
import { ImageSourcePropType } from 'react-native';
import {
  nullPiece,
  nullTile,
  outOfBoundsCoords,
  validBishopTransitionCoords,
} from '../constants/Values';
import {
  CoordinatePair,
  LineType,
  Piece,
  PieceColor,
  PieceType,
  Tile,
} from '../types/types';

/**
 * Generates a new Tile object with the appropreate team piece and piece color based
 * on the coordinates passed in.
 * @param coord coordinates of the new tile
 * @param key unique identifier
 * @returns new Tile with information based on given coordinates
 */
export const newTile = (coord: CoordinatePair, key: number): Tile => {
  const x = coord?.x;
  const y = coord?.y;
  let piece: Piece = null;

  if (x != null && y != null) {
    if (x + y === 6 || (x === 2 && y === 2)) {
      piece = {
        color: 'orange',
        team: 1,
        type: 'pawn',
        startingCoords: { x: x, y: y },
      };
    } else if ((x === 4 || y === 4) && x + y === 4) {
      piece = {
        color: 'orange',
        team: 1,
        type: 'bishop',
        startingCoords: { x: x, y: y },
      };
    } else if ((x === 3 || y === 3) && x + y === 4) {
      piece = {
        color: 'orange',
        team: 1,
        type: 'knight',
        startingCoords: { x: x, y: y },
      };
    } else if ((x === 2 || y === 2) && x + y === 2) {
      piece = {
        color: 'orange',
        team: 1,
        type: 'rook',
        startingCoords: { x: x, y: y },
      };
    } else if (x === 1 && y === 1) {
      piece = {
        color: 'orange',
        team: 1,
        type: 'queen',
        startingCoords: { x: x, y: y },
      };
    } else if (x === 0 && y === 0) {
      piece = {
        color: 'orange',
        team: 1,
        type: 'king',
        startingCoords: { x: x, y: y },
      };
    }
    if (x + y === 22 || (x === 12 && y === 12)) {
      piece = {
        color: 'purple',
        team: 3,
        type: 'pawn',
        startingCoords: { x: x, y: y },
      };
    } else if ((x === 10 || y === 10) && x + y === 24) {
      piece = {
        color: 'purple',
        team: 3,
        type: 'bishop',
        startingCoords: { x: x, y: y },
      };
    } else if ((x === 11 || y === 11) && x + y === 24) {
      piece = {
        color: 'purple',
        team: 3,
        type: 'knight',
        startingCoords: { x: x, y: y },
      };
    } else if ((x === 12 || y === 12) && x + y === 26) {
      piece = {
        color: 'purple',
        team: 3,
        type: 'rook',
        startingCoords: { x: x, y: y },
      };
    } else if (x === 13 && y === 13) {
      piece = {
        color: 'purple',
        team: 3,
        type: 'queen',
        startingCoords: { x: x, y: y },
      };
    } else if (x === 14 && y === 14) {
      piece = {
        color: 'purple',
        team: 3,
        type: 'king',
        startingCoords: { x: x, y: y },
      };
    }
    if (y - x === 8 || (x === 2 && y === 12)) {
      piece = {
        color: 'red',
        team: 4,
        type: 'pawn',
        startingCoords: { x: x, y: y },
      };
    } else if (y - x === 10 && (x === 0 || y === 14)) {
      piece = {
        color: 'red',
        team: 4,
        type: 'bishop',
        startingCoords: { x: x, y: y },
      };
    } else if (y - x === 10 && (x === 1 || y === 13)) {
      piece = {
        color: 'red',
        team: 4,
        type: 'knight',
        startingCoords: { x: x, y: y },
      };
    } else if (y - x === 12 && (x === 0 || y === 14)) {
      piece = {
        color: 'red',
        team: 4,
        type: 'rook',
        startingCoords: { x: x, y: y },
      };
    } else if (x === 1 && y === 13) {
      piece = {
        color: 'red',
        team: 4,
        type: 'queen',
        startingCoords: { x: x, y: y },
      };
    } else if (x === 0 && y === 14) {
      piece = {
        color: 'red',
        team: 4,
        type: 'king',
        startingCoords: { x: x, y: y },
      };
    }
    if (x - y === 8 || (x === 12 && y === 2)) {
      piece = {
        color: 'blue',
        team: 2,
        type: 'pawn',
        startingCoords: { x: x, y: y },
      };
    } else if (x - y === 10 && (x === 14 || y === 0)) {
      piece = {
        color: 'blue',
        team: 2,
        type: 'bishop',
        startingCoords: { x: x, y: y },
      };
    } else if (x - y === 10 && (x === 13 || y === 1)) {
      piece = {
        color: 'blue',
        team: 2,
        type: 'knight',
        startingCoords: { x: x, y: y },
      };
    } else if (x - y === 12 && (x === 14 || y === 0)) {
      piece = {
        color: 'blue',
        team: 2,
        type: 'rook',
        startingCoords: { x: x, y: y },
      };
    } else if (x === 13 && y === 1) {
      piece = {
        color: 'blue',
        team: 2,
        type: 'queen',
        startingCoords: { x: x, y: y },
      };
    } else if (x === 14 && y === 0) {
      piece = {
        color: 'blue',
        team: 2,
        type: 'king',
        startingCoords: { x: x, y: y },
      };
    }
  }

  return {
    coord: coord,
    piece: piece,
    key: key,
  };
};

/**
 * Generates an array of 113 new tiles.
 * @returns array of 113 new tiles
 */
export const newTileArray = (): Tile[] => {
  const tileArray = [];
  let key = 0;
  for (let y = 0; y < 15; y++) {
    for (let x = 0; x < 15; x++) {
      if ((x + y) % 2 == 0) {
        const coord = { x: x, y: y };
        tileArray.push(newTile(coord, key++));
      }
    }
  }
  return tileArray;
};

/**
 * Converts location on the board to tile coordinates. The bottom left tile
 * would have a coordinate of (0,0) and the top right tile would have (14,14).
 * All parameters are measured in the same pixel units.
 * @param boardInputX x location on the board
 * @param boardInputY y location on the board
 * @param boardSideLength side length of the board
 * @returns coordinate pair of the tile the location is on
 */
export const coordsFromLocation = (
  boardInputX: number,
  boardInputY: number,
  boardSideLength: number
): CoordinatePair => {
  // if click is outside of board set variables to -1
  if (boardInputX < 0 || boardInputX > boardSideLength) {
    boardInputX = -1;
  }
  if (boardInputY < 0 || boardInputY > boardSideLength) {
    boardInputY = -1;
  }

  // relative clicks are decimals from -8 to 8
  const relativeClickX = (boardInputX / boardSideLength) * 1 * 16 - 8;
  const relativeClickY = ((boardInputY / boardSideLength) * 1 * 16 - 8) * -1;

  let xRegion = Math.floor(relativeClickX);
  let yRegion = Math.floor(relativeClickY);

  /* regions are integers from 0 to 16 that represent a span from the center
    of a tile to the next center of a tile */
  xRegion += 8;
  yRegion += 8;

  /* the x and y of a point are between 0 and 1 in the area where
    two regions intercept. The area where the regions intercept is an
    imaginary 1 by 1 square */
  const xPoint = Math.abs(xRegion - relativeClickX - 8);
  const yPoint = Math.abs(yRegion - relativeClickY - 8);

  /* boolean for the slope of the line of the bordering tiles in the
    region intercept */
  const positiveSlope = (xRegion + yRegion) % 2 !== 0;

  const clickedAboveSlope =
    (!positiveSlope && xPoint + yPoint > 1) ||
    (positiveSlope && yPoint > xPoint);

  let tileCoordX;
  let tileCoordY;

  if (positiveSlope) {
    if (clickedAboveSlope) {
      tileCoordX = xRegion - 1;
      tileCoordY = yRegion;
    } else {
      // clicked below slope
      tileCoordX = xRegion;
      tileCoordY = yRegion - 1;
    }
  } else {
    if (clickedAboveSlope) {
      tileCoordX = xRegion;
      tileCoordY = yRegion;
    } else {
      // clicked below slope
      tileCoordX = xRegion - 1;
      tileCoordY = yRegion - 1;
    }
  }

  tileCoordX = tileCoordX > 14 ? -1 : tileCoordX;
  tileCoordY = tileCoordY > 14 ? -1 : tileCoordY;

  return { x: tileCoordX, y: tileCoordY };
};

/**
 * Gets a piece image from the assets based on the type and color of the piece.
 * @param type piece type of the image to get
 * @param color color of the piece image to get
 * @returns
 */
export const getPieceImage = (
  type: PieceType,
  color: PieceColor
): ImageSourcePropType => {
  switch (color) {
    case 'white':
      switch (type) {
        case 'pawn':
          return require('../assets/images/pieces/white_pawn.png');
        case 'bishop':
          return require('../assets/images/pieces/white_bishop.png');
        case 'rook':
          return require('../assets/images/pieces/white_rook.png');
        case 'knight':
          return require('../assets/images/pieces/white_knight.png');
        case 'king':
          return require('../assets/images/pieces/white_king.png');
        case 'queen':
          return require('../assets/images/pieces/white_queen.png');
      }
      break;
    case 'black':
      switch (type) {
        case 'pawn':
          return require('../assets/images/pieces/black_pawn.png');
        case 'bishop':
          return require('../assets/images/pieces/black_bishop.png');
        case 'rook':
          return require('../assets/images/pieces/black_rook.png');
        case 'knight':
          return require('../assets/images/pieces/black_knight.png');
        case 'king':
          return require('../assets/images/pieces/black_king.png');
        case 'queen':
          return require('../assets/images/pieces/black_queen.png');
      }
      break;
    case 'orange':
      switch (type) {
        case 'pawn':
          return require('../assets/images/pieces/orange_pawn.png');
        case 'bishop':
          return require('../assets/images/pieces/orange_bishop.png');
        case 'rook':
          return require('../assets/images/pieces/orange_rook.png');
        case 'knight':
          return require('../assets/images/pieces/orange_knight.png');
        case 'king':
          return require('../assets/images/pieces/orange_king.png');
        case 'queen':
          return require('../assets/images/pieces/orange_queen.png');
      }
      break;
    case 'blue':
      switch (type) {
        case 'pawn':
          return require('../assets/images/pieces/blue_pawn.png');
        case 'bishop':
          return require('../assets/images/pieces/blue_bishop.png');
        case 'rook':
          return require('../assets/images/pieces/blue_rook.png');
        case 'knight':
          return require('../assets/images/pieces/blue_knight.png');
        case 'king':
          return require('../assets/images/pieces/blue_king.png');
        case 'queen':
          return require('../assets/images/pieces/blue_queen.png');
      }
      break;
    case 'purple':
      switch (type) {
        case 'pawn':
          return require('../assets/images/pieces/purple_pawn.png');
        case 'bishop':
          return require('../assets/images/pieces/purple_bishop.png');
        case 'rook':
          return require('../assets/images/pieces/purple_rook.png');
        case 'knight':
          return require('../assets/images/pieces/purple_knight.png');
        case 'king':
          return require('../assets/images/pieces/purple_king.png');
        case 'queen':
          return require('../assets/images/pieces/purple_queen.png');
      }
      break;
    case 'red':
      switch (type) {
        case 'pawn':
          return require('../assets/images/pieces/red_pawn.png');
        case 'bishop':
          return require('../assets/images/pieces/red_bishop.png');
        case 'rook':
          return require('../assets/images/pieces/red_rook.png');
        case 'knight':
          return require('../assets/images/pieces/red_knight.png');
        case 'king':
          return require('../assets/images/pieces/red_king.png');
        case 'queen':
          return require('../assets/images/pieces/red_queen.png');
      }
      break;
  }
};

/**
 * Given a tile array and coordinates, finds a tile in the array that has the
 * coordinates.
 * @param tiles array of tiles to look in for a matching tile
 * @param coords coordinates that are being looked for in a tile
 * @returns tile with the found coordinates or null tile if coordinates did
 *  not match
 */
export const findTileByCoords = (
  tiles: Tile[],
  coords: CoordinatePair
): Tile => {
  let matchingTile = nullTile;
  for (const t of tiles) {
    if (isSameCoord(coords, t.coord)) {
      matchingTile = t;
      break;
    }
  }
  return matchingTile;
};

/**
 * Checks if a coordinate is out of bounds.
 * @param coords coordinates to check
 * @returns true for out of bounds, false for in bounds
 */
export const isOutOfBounds = (coords: CoordinatePair): boolean => {
  if (!coords) {
    return true;
  }
  return coords.x < 0 || coords.y < 0;
};

/**
 * Checks two coordinate pairs for their x and y coordinate match.
 * @param coord1 coordinate pair to check against the other pair
 * @param coord2 coordinate pair to check against the other pair
 * @returns equivalence of the coordinate x any y values
 */
export const isSameCoord = (
  coord1: CoordinatePair,
  coord2: CoordinatePair
): boolean => {
  if (!coord1 && !coord2) {
    return true;
  }
  if (!coord1 || !coord2) {
    return false;
  }
  return coord1.x === coord2.x && coord1.y === coord2.y;
};

export const isNullPiece = (piece: Piece): boolean => {
  return isSamePiece(piece, nullPiece);
};

/**
 * Compares two pieces for equality based on their properties.
 * @param piece1 piece to check against the other piece
 * @param piece2 piece to check against the other piece
 * @returns equivalence of the two pieces
 */
export const isSamePiece = (piece1: Piece, piece2: Piece): boolean => {
  return piece1?.color === piece2?.color && piece1?.type === piece2?.type;
};

/**
 * Converts diagonal coordinates to regular coordinates.
 * @param coords diagonal coordinates (4 player chess coordinates)
 * @returns regular coordinates (standard chess coordinates)
 */
export const toRegularCoords = (coords: CoordinatePair): CoordinatePair => {
  if (!coords) {
    return coords;
  }
  const x = coords.x;
  const y = coords.y;
  const newX = (x - y) / 2;
  const newY = (x + y) / 2;
  return { x: newX, y: newY };
};

/**
 * Converts regular coordinates to diagonal coordinates.
 * @param coords regular coordinates (standard chess coordinates)
 * @returns  diagonal coordinates (4 player chess coordinates)
 */
export const toDiagonalCoords = (coords: CoordinatePair): CoordinatePair => {
  if (!coords) {
    return coords;
  }
  const x = coords.x;
  const y = coords.y;
  const newX = x + y;
  const newY = y - x;
  return { x: newX, y: newY };
};

/**
 * Checks if a piece can move from a tile to another tile given those two
 * tiles and the whole tile array. The array is used to check for pieces
 * that might be in the way of the move.
 * @param fromTile tile the piece is attempting to move from
 * @param toTile tile the piece is attempting to move to
 * @param tiles tile array representing the game tile state
 * @returns if piece can successfully move given the specified tiles
 */
export const canPieceMove = (
  fromTile: Tile,
  toTile: Tile,
  tiles: Tile[]
): boolean => {
  if (fromTile.piece?.color === toTile.piece?.color) {
    return false;
  }
  const fromCoordRegular = toRegularCoords(fromTile.coord);
  const toCoordRegular = toRegularCoords(toTile.coord);
  switch (fromTile.piece?.type) {
    case 'pawn':
      return canPawnMoveBeMade(
        fromCoordRegular,
        toCoordRegular,
        tiles,
        toTile.piece !== null
      );
    case 'bishop':
      return canBishopMoveBeMade(
        fromCoordRegular,
        toCoordRegular,
        tiles,
        14,
        fromTile.piece.startingCoords
      );
    case 'rook':
      return canRookMoveBeMade(fromCoordRegular, toCoordRegular, tiles);
    case 'knight':
      return canKnightMoveBeMade(fromCoordRegular, toCoordRegular);
    case 'king':
      return canKingMoveBeMade(fromCoordRegular, toCoordRegular, tiles);
    case 'queen':
      return canQueenMoveBeMade(fromCoordRegular, toCoordRegular, tiles);
    default:
      return false;
  }
};

/**
 * Checks if a strait line move can be made given diagonal coordinates
 * (4 player chess coordinates) or regular (standard chcess) coordinates.
 * The assumed type of coordinates is based on the line type.
 * @param from coordinates to start checking from
 * @param to coordinates to check to
 * @param tiles tile array representing the game tile state
 * @param line line type of the move
 * @param limit tile limit distance of the move
 * @returns can a strait line move be made
 */
export const canStraitLineMoveBeMade = (
  from: CoordinatePair,
  to: CoordinatePair,
  tiles: Tile[],
  line: LineType,
  limit = 14
): boolean => {
  if (!from || !to) {
    return false;
  }
  if (line === 'diagonal') {
    limit *= 2;
  }

  const movingOnX = from.y === to.y;
  const movingOnY = from.x === to.x;

  const positiveDirection = movingOnX ? to.x - from.x > 0 : to.y - from.y > 0;

  const withinRule = movingOnX || movingOnY;
  const withinLimit =
    Math.abs(from.x - to.x) <= limit && Math.abs(from.y - to.y) <= limit;

  // checks if the move is blocked by another piece
  for (const tile of tiles) {
    const x =
      line === 'parallel' ? toRegularCoords(tile.coord)?.x : tile.coord?.x;
    const y =
      line === 'parallel' ? toRegularCoords(tile.coord)?.y : tile.coord?.y;
    const tileOnSameAxisX = x === from.x && x === to.x;
    const tileOnSameAxisY = y === from.y && y === to.y;

    if (movingOnX && tileOnSameAxisY && x != null) {
      if (positiveDirection) {
        if (x > from.x && x < to.x && !isNullPiece(tile.piece)) {
          return false;
        }
      } else {
        if (x < from.x && x > to.x && !isNullPiece(tile.piece)) {
          return false;
        }
      }
    } else if (movingOnY && tileOnSameAxisX && y != null) {
      if (positiveDirection) {
        if (y > from.y && y < to.y && !isNullPiece(tile.piece)) {
          return false;
        }
      } else {
        if (y < from.y && y > to.y && !isNullPiece(tile.piece)) {
          return false;
        }
      }
    }
  }

  return withinRule && withinLimit;
};

/**
 * Checks if a rook move can be made given regular coordinates
 * (standard chess coordinates).
 * @param from coordinates a rook would move from
 * @param to coordinates a rook would move to
 * @param tiles tile array representing the game tile state
 * @param limit tile limit restricting the move distance
 * @returns can a rook move be made
 */
export const canRookMoveBeMade = (
  from: CoordinatePair,
  to: CoordinatePair,
  tiles: Tile[],
  limit = 14
): boolean => {
  return canStraitLineMoveBeMade(from, to, tiles, 'parallel', limit);
};

/**
 * Checks if a bishop move can be made given regular coordinates
 * (standard chess coordinates).
 * @param from coordinates a piece would move from
 * @param to coordinates a piece would move to
 * @param tiles tile array representing the game tile state
 * @param limit tile limit restricting the move distance
 * @param pieceStartingCoords the starting coordinates of the piece
 *  attempting the move
 * @returns can a bishop move be made
 */
export const canBishopMoveBeMade = (
  from: CoordinatePair,
  to: CoordinatePair,
  tiles: Tile[],
  limit = 7,
  pieceStartingCoords: CoordinatePair = outOfBoundsCoords
): boolean => {
  const diagonalFrom = toDiagonalCoords(from);
  const diagonalTo = toDiagonalCoords(to);
  const isRegularMove = canStraitLineMoveBeMade(
    diagonalFrom,
    diagonalTo,
    tiles,
    'diagonal',
    limit
  );

  /** Bishop transition is a special move that allows a bishop to transition
   * diagonals if standing on and moving to a transition tile in that bishop's
   * starting area. */
  let isBishopTransition = false;
  if (
    pieceStartingCoords &&
    !isSameCoord(pieceStartingCoords, outOfBoundsCoords)
  ) {
    let isToTransitionCoord = false;
    let isFromTransitionCoord = false;
    let isCloseToStartingCoords = false;
    const isTransitionOneTile = canStraitLineMoveBeMade(
      from,
      to,
      tiles,
      'parallel',
      1
    );

    validBishopTransitionCoords.forEach((coord) => {
      if (isSameCoord(coord, diagonalTo)) {
        isToTransitionCoord = true;
      }
      if (isSameCoord(coord, diagonalFrom)) {
        isFromTransitionCoord = true;
      }
      const toX = diagonalTo?.x;
      const toY = diagonalTo?.y;
      if (
        toX !== undefined &&
        toY !== undefined &&
        Math.abs(pieceStartingCoords?.x - toX) < 5 &&
        Math.abs(pieceStartingCoords?.y - toY) < 5
      ) {
        isCloseToStartingCoords = true;
      }
    });

    isBishopTransition =
      isToTransitionCoord &&
      isFromTransitionCoord &&
      isTransitionOneTile &&
      isCloseToStartingCoords;
  }
  return isRegularMove || isBishopTransition;
};

/**
 * Checks if a queen move can be made given regular coordinates
 * (standard chess coordinates).
 * @param from coordinates a piece would move from
 * @param to coordinates a piece would move to
 * @param tiles tile array representing the game tile state
 * @param limit tile limit restricting the move distance
 * @returns can a queen move be made
 */
export const canQueenMoveBeMade = (
  from: CoordinatePair,
  to: CoordinatePair,
  tiles: Tile[],
  limit = 14
): boolean => {
  return (
    canBishopMoveBeMade(from, to, tiles, limit) ||
    canRookMoveBeMade(from, to, tiles, limit)
  );
};

/**
 * Checks if a knight move can be made given regular coordinates
 * (standard chess coordinates).
 * @param from coordinates a piece would move from
 * @param to coordinates a piece would move to
 * @returns can a knight move be made
 */
export const canKnightMoveBeMade = (
  from: CoordinatePair,
  to: CoordinatePair
): boolean => {
  if (!from || !to) {
    return false;
  }

  let xDifference = Math.abs(Math.abs(from.x) - Math.abs(to.x));
  let yDifference = Math.abs(Math.abs(from.y) - Math.abs(to.y));

  // accounts for edge cases that happen on the axis
  if (Math.abs(from.x) === 1 && Math.abs(to.x) === 1 && from.x !== to.x) {
    xDifference = 2;
  }
  if (Math.abs(from.y) === 1 && Math.abs(to.y) === 1 && from.y !== to.y) {
    yDifference = 2;
  }

  return (
    (xDifference === 1 && yDifference === 2) ||
    (xDifference === 2 && yDifference === 1)
  );
};

/**
 * Checks if a pawn move can be made given regular coordinates
 * (standard chess coordinates).
 * @param from coordinates a piece would move from
 * @param to coordinates a piece would move to
 * @param tiles tile array representing the game tile state
 * @param toTileHasPiece tile to move to has a piece
 * @returns can a pawn move be made
 */
export const canPawnMoveBeMade = (
  from: CoordinatePair,
  to: CoordinatePair,
  tiles: Tile[],
  toTileHasPiece: boolean
): boolean => {
  const levelsMovedUp = levelChange(from, to);
  const withinLimitedRookMove = canRookMoveBeMade(from, to, tiles, 1);
  const withinLimitedBishopMove = canBishopMoveBeMade(from, to, tiles, 1);

  const withinLimit =
    (withinLimitedRookMove && !toTileHasPiece) ||
    (withinLimitedBishopMove && toTileHasPiece);
  const toCorrectLevel = levelsMovedUp === 1;
  const correctSideMove =
    withinLimitedRookMove && levelsMovedUp === 0 && !toTileHasPiece;
  return (withinLimit && toCorrectLevel) || correctSideMove;
};

/**
 * Calculates change in levels given two coordinates. Levels represent the
 * radius in tiles away from the center tile. A positive level change would
 * mean moving closer to center and a negative one would mean moving away.
 * @param from coordinates the change would start from
 * @param to coordinates the change would aim to
 * @returns number of tiles moved closer to center
 */
export const levelChange = (
  from: CoordinatePair,
  to: CoordinatePair
): number => {
  if (!from || !to) {
    return 0;
  }
  const fromLevel =
    Math.abs(from.x) > Math.abs(from.y - 7)
      ? Math.abs(from.x)
      : Math.abs(from.y - 7);
  const toLevel =
    Math.abs(to.x) > Math.abs(to.y - 7) ? Math.abs(to.x) : Math.abs(to.y - 7);

  return fromLevel - toLevel;
};

/**
 * Checks if a king move can be made given regular coordinates
 * (standard chess coordinates).
 * @param from coordinates a piece would move from
 * @param to coordinates a piece would move to
 * @param tiles tile array representing the game tile state
 * @returns can a king move be made
 */
export const canKingMoveBeMade = (
  from: CoordinatePair,
  to: CoordinatePair,
  tiles: Tile[]
): boolean => {
  return canQueenMoveBeMade(from, to, tiles, 1);
};

// lifecycle method
export const useComponentDidMount = (handler: {
  (): void;
  (): void;
  (): void;
  (): void | (() => void | undefined);
}): void => {
  return useEffect(() => {
    return handler();
  }, []);
};
