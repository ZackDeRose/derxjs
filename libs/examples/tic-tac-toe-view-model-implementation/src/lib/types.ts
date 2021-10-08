import { Observable } from 'rxjs';

export interface TicTacToeViewModelInputs {
  userSpaceClickEvents$: Observable<SpaceCoordinates>;
  userResetClickEvents$: Observable<void>;
  ai: TicTacToeAi;
}

export type TicTacToeAi = (params: AiParams) => SpaceCoordinates;
interface AiParams {
  board: Board;
  aiLetter: 'o' | 'x';
}

export interface TicTacToeViewModel {
  board: Board;
  turn: Turn;
}

export type Turn =
  | 'your turn'
  | `computer's turn`
  | 'game over - you win'
  | 'game over - you lose'
  | `game over - it's a tie`;

export type SpaceContent = 'x' | 'o' | '';

export type Board = [
  [SpaceContent, SpaceContent, SpaceContent],
  [SpaceContent, SpaceContent, SpaceContent],
  [SpaceContent, SpaceContent, SpaceContent]
];

export type BoardIndex = 0 | 1 | 2;

export interface SpaceCoordinates {
  row: BoardIndex;
  column: BoardIndex;
}
