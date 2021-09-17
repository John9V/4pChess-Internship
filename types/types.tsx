/**
 * Can be a regular (standard chess) coordinate or a diagonal (4 player chess)
 * coordinate.
 */
export type CoordinatePair = {
  x: number;
  y: number;
} | null;

export type Tile = {
  coord: CoordinatePair;
  piece: Piece;
  key: number;
};

export type Piece = {
  color: PieceColor;
  type: PieceType;
  team: TeamNumber;
  startingCoords: CoordinatePair;
} | null;

export type PieceColor =
  | 'white'
  | 'black'
  | 'orange'
  | 'blue'
  | 'purple'
  | 'red';
export type PieceType =
  | 'king'
  | 'queen'
  | 'rook'
  | 'bishop'
  | 'knight'
  | 'pawn';

export type LineType = 'diagonal' | 'parallel';

// Firebase Types
export type User = {
  userId: string;
  games: Game[];
};

export type Game = {
  gameId: string;
  joinCode: string;
  tileState: Tile[];
  users: User[];
  teams: { team1: Team; team2: Team; team3: Team; team4: Team };
};

export type Team = {
  users: User[];
  color: PieceColor;
  turnToMove: boolean;
};

export type TeamNumber = 1 | 2 | 3 | 4;
