import { DeRxJSViewModel } from '@derxjs/view-model';
import { merge, Subject } from 'rxjs';
import {
  delay,
  distinctUntilChanged,
  filter,
  map,
  scan,
  share,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import {
  Board,
  SpaceContent,
  SpaceCoordinates,
  TicTacToeViewModel,
  TicTacToeViewModelInputs,
} from './types';

export const ticTacToeViewModel$: DeRxJSViewModel<
  TicTacToeViewModelInputs,
  TicTacToeViewModel
> = ({ userSpaceClickEvents$, userResetClickEvents$, ai }) => {
  const actionsSubject = new Subject<Action>();
  const userClickActions$ = userSpaceClickEvents$.pipe(
    map(
      (space): UserSpaceClickAction => ({
        type: 'user space click',
        space: space,
      })
    ),
    shareReplay(1)
  );
  const userResetActions$ = userResetClickEvents$.pipe(
    map(
      (): UserResetAction => ({
        type: 'user reset click',
      })
    ),
    shareReplay(1)
  );
  const actions$ = merge(userClickActions$, userResetActions$, actionsSubject);

  const state$ = actions$.pipe(
    scan(reducer, createInitialViewModel()),
    startWith<TicTacToeViewModel>(createInitialViewModel()),
    distinctUntilChanged(),
    shareReplay(1)
  );

  const aiActions$ = userResetActions$.pipe(
    startWith(undefined),
    switchMap(() =>
      state$.pipe(
        filter((x) => x.turn === `computer's turn`),
        delay(2000),
        map((state) => ({
          type: 'ai action' as const,
          space: ai({ board: state.board, aiLetter: 'o' }),
        }))
      )
    )
  );

  aiActions$.subscribe((action) => actionsSubject.next(action));

  return state$;
};

interface UserSpaceClickAction {
  type: 'user space click';
  space: SpaceCoordinates;
}

interface UserResetAction {
  type: 'user reset click';
}

interface AiAction {
  type: 'ai action';
  space: SpaceCoordinates;
}

type Action = UserSpaceClickAction | UserResetAction | AiAction;

export function reducer(
  state: TicTacToeViewModel,
  action: Action
): TicTacToeViewModel {
  switch (action.type) {
    case 'user reset click': {
      return createInitialViewModel();
    }
    case 'user space click': {
      if (state.turn !== 'your turn') {
        return state;
      }
      if (isSpaceOccupied(state.board, action.space)) {
        return state;
      }
      const newBoard = nextBoard(state.board, action.space, 'x');
      const result = isGameOver(newBoard);
      switch (result) {
        case false: {
          return {
            board: newBoard,
            turn: `computer's turn`,
          };
        }
        case 'user wins': {
          return {
            board: newBoard,
            turn: 'game over - you win',
          };
        }
        case 'tie game': {
          return {
            board: newBoard,
            turn: `game over - it's a tie`,
          };
        }
        default: {
          throw 'should not be reached';
        }
      }
    }
    case 'ai action': {
      const newBoard = nextBoard(state.board, action.space, 'o');
      const result = isGameOver(newBoard);
      switch (result) {
        case false: {
          return {
            board: newBoard,
            turn: 'your turn',
          };
        }
        case 'computer wins': {
          return {
            board: newBoard,
            turn: 'game over - you lose',
          };
        }
        default: {
          throw 'should not be reached';
        }
      }
    }
  }
}

function isSpaceOccupied(board: Board, space: SpaceCoordinates): boolean {
  return board[space.row][space.column] !== '';
}

function nextBoard(
  board: Board,
  space: SpaceCoordinates,
  player: 'x' | 'o'
): Board {
  const newBoard: Board = [[...board[0]], [...board[1]], [...board[2]]];
  newBoard[space.row][space.column] = player;
  return newBoard;
}

function isGameOver(
  board: Board
): 'user wins' | 'computer wins' | 'tie game' | false {
  const winningCombinations: [
    SpaceCoordinates,
    SpaceCoordinates,
    SpaceCoordinates
  ][] = [
    [
      { row: 0, column: 0 },
      { row: 0, column: 1 },
      { row: 0, column: 2 },
    ],
    [
      { row: 1, column: 0 },
      { row: 1, column: 1 },
      { row: 1, column: 2 },
    ],
    [
      { row: 2, column: 0 },
      { row: 2, column: 1 },
      { row: 2, column: 2 },
    ],
    [
      { row: 0, column: 0 },
      { row: 1, column: 0 },
      { row: 2, column: 0 },
    ],
    [
      { row: 0, column: 1 },
      { row: 1, column: 1 },
      { row: 2, column: 1 },
    ],
    [
      { row: 0, column: 2 },
      { row: 1, column: 2 },
      { row: 2, column: 2 },
    ],
    [
      { row: 0, column: 0 },
      { row: 1, column: 1 },
      { row: 2, column: 2 },
    ],
    [
      { row: 0, column: 2 },
      { row: 1, column: 1 },
      { row: 2, column: 0 },
    ],
  ];
  for (const [x, y, z] of winningCombinations) {
    if (
      board[x.row][x.column] === 'x' &&
      board[y.row][y.column] === 'x' &&
      board[z.row][z.column] === 'x'
    ) {
      return 'user wins';
    }
    if (
      board[x.row][x.column] === 'o' &&
      board[y.row][y.column] === 'o' &&
      board[z.row][z.column] === 'o'
    ) {
      return 'computer wins';
    }
  }
  return (board.flat() as SpaceContent[]).some((contents) => contents === '')
    ? false
    : 'tie game';
}

export function createInitialViewModel(): TicTacToeViewModel {
  return {
    board: [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ],
    turn: 'your turn',
  };
}
