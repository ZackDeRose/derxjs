import { TestScheduler } from 'rxjs/testing';
import { TicTacToeViewModel, SpaceCoordinates, TicTacToeAi } from './types';
import { createInitialViewModel, ticTacToeViewModel$ } from './view-model';

describe('viewModel', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) =>
      expect(actual).toEqual(expected)
    );
  });

  /**
   * Always chooses the first available spot, starting with top left
   * and moving right then down
   */
  const testAiFunction: TicTacToeAi = ({ board }) => {
    for (const i of [0, 1, 2] as const) {
      for (const j of [0, 1, 2] as const) {
        if (board[i][j] === '') {
          return { row: i, column: j };
        }
      }
    }
    throw new Error('Ai was passed a full board. This should never happen');
  };

  test('with no user events, the board stays empty', () => {
    const firstUserState = createInitialViewModel();
    testScheduler.run(({ cold, expectObservable }) => {
      const userBoardClicks = cold<SpaceCoordinates>('------');
      const userResetClicks = cold<void>('------');
      const expected = cold('a-----', { a: firstUserState });
      const result = ticTacToeViewModel$({
        userSpaceClickEvents$: userBoardClicks,
        userResetClickEvents$: userResetClicks,
        ai: testAiFunction,
      });
      expectObservable(result).toEqual(expected);
    });
  });

  test('computer player makes a move 1999ms after the player selects a square', () => {
    const initialState = createInitialViewModel();
    const userClick: SpaceCoordinates = {
      row: 1,
      column: 1,
    };
    const afterUserClick: TicTacToeViewModel = {
      board: [
        ['', '', ''],
        ['', 'x', ''],
        ['', '', ''],
      ],
      turn: `computer's turn`,
    };
    const afterComputerMoves: TicTacToeViewModel = {
      board: [
        ['o', '', ''],
        ['', 'x', ''],
        ['', '', ''],
      ],
      turn: `your turn`,
    };
    testScheduler.run(({ cold, expectObservable }) => {
      const userBoardClicks = cold<SpaceCoordinates>('---a----', {
        a: userClick,
      });
      const userResetClicks = cold<void>('------');
      const expected = cold('a--b 1999ms c', {
        a: initialState,
        b: afterUserClick,
        c: afterComputerMoves,
      });
      const result = ticTacToeViewModel$({
        userSpaceClickEvents$: userBoardClicks,
        userResetClickEvents$: userResetClicks,
        ai: testAiFunction,
      });
      expectObservable(result).toEqual(expected);
    });
  });

  test('user click does nothing on an already filled square', () => {
    const initialState = createInitialViewModel();
    const userClicksCenterSquare: SpaceCoordinates = {
      row: 1,
      column: 1,
    };
    const afterUserClick: TicTacToeViewModel = {
      board: [
        ['', '', ''],
        ['', 'x', ''],
        ['', '', ''],
      ],
      turn: `computer's turn`,
    };
    const afterComputerMoves: TicTacToeViewModel = {
      board: [
        ['o', '', ''],
        ['', 'x', ''],
        ['', '', ''],
      ],
      turn: `your turn`,
    };
    const userClicksComputersSquare: SpaceCoordinates = {
      row: 0,
      column: 0,
    };
    testScheduler.run(({ cold, expectObservable }) => {
      const userBoardClicks = cold<SpaceCoordinates>('---a 3s a-b-aaaa-bbbb-', {
        a: userClicksCenterSquare,
        b: userClicksComputersSquare,
      });
      const userResetClicks = cold<void>('------');
      const expected = cold('a--b 1999ms c', {
        a: initialState,
        b: afterUserClick,
        c: afterComputerMoves,
      });
      const result = ticTacToeViewModel$({
        userSpaceClickEvents$: userBoardClicks,
        userResetClickEvents$: userResetClicks,
        ai: testAiFunction,
      });
      expectObservable(result).toEqual(expected);
    });
  });

  test('reset button works', () => {
    const initialState = createInitialViewModel();
    const userClicksCenterSquare: SpaceCoordinates = {
      row: 1,
      column: 1,
    };
    const afterUserClick: TicTacToeViewModel = {
      board: [
        ['', '', ''],
        ['', 'x', ''],
        ['', '', ''],
      ],
      turn: `computer's turn`,
    };
    const afterComputerMoves: TicTacToeViewModel = {
      board: [
        ['o', '', ''],
        ['', 'x', ''],
        ['', '', ''],
      ],
      turn: `your turn`,
    };
    testScheduler.run(({ cold, expectObservable }) => {
      const userBoardClicks = cold<SpaceCoordinates>('---a------', {
        a: userClicksCenterSquare,
      });
      const userResetClicks = cold<void>('---- 1999ms ---a', { a: undefined });
      const expected = cold('a--b 1999ms c--a', {
        a: initialState,
        b: afterUserClick,
        c: afterComputerMoves,
      });
      const result = ticTacToeViewModel$({
        userSpaceClickEvents$: userBoardClicks,
        userResetClickEvents$: userResetClicks,
        ai: testAiFunction,
      });
      expectObservable(result).toEqual(expected);
    });
  });

  test('user wins', () => {
    const initialState = createInitialViewModel();
    const userClicksCenterSquare: SpaceCoordinates = {
      row: 1,
      column: 1,
    };
    const afterUserFirstMove: TicTacToeViewModel = {
      board: [
        ['', '', ''],
        ['', 'x', ''],
        ['', '', ''],
      ],
      turn: `computer's turn`,
    };
    const afterComputerFirstMove: TicTacToeViewModel = {
      board: [
        ['o', '', ''],
        ['', 'x', ''],
        ['', '', ''],
      ],
      turn: `your turn`,
    };
    const userClicksTopRightSquare: SpaceCoordinates = {
      row: 0,
      column: 2,
    };
    const afterUserSecondMove: TicTacToeViewModel = {
      board: [
        ['o', '', 'x'],
        ['', 'x', ''],
        ['', '', ''],
      ],
      turn: `computer's turn`,
    };
    const afterComputerSecondMove: TicTacToeViewModel = {
      board: [
        ['o', 'o', 'x'],
        ['', 'x', ''],
        ['', '', ''],
      ],
      turn: `your turn`,
    };
    const userClicksBottomLeftSquare: SpaceCoordinates = {
      row: 2,
      column: 0,
    };
    const userWins: TicTacToeViewModel = {
      board: [
        ['o', 'o', 'x'],
        ['', 'x', ''],
        ['x', '', ''],
      ],
      turn: 'game over - you win',
    };
    const bottoMiddleClick: SpaceCoordinates = {
      row: 2,
      column: 1,
    };

    testScheduler.run(({ cold, expectObservable }) => {
      const userBoardClicks = cold<SpaceCoordinates>(
        '---a 1999ms ----b 1999ms ----c 1999ms ---d--d-dddd',
        {
          a: userClicksCenterSquare,
          b: userClicksTopRightSquare,
          c: userClicksBottomLeftSquare,
          d: bottoMiddleClick,
        }
      );
      const userResetClicks = cold<void>('----');
      const expected = cold('a--b 1999ms c---d 1999ms e---f-------', {
        a: initialState,
        b: afterUserFirstMove,
        c: afterComputerFirstMove,
        d: afterUserSecondMove,
        e: afterComputerSecondMove,
        f: userWins,
      });
      const result = ticTacToeViewModel$({
        userSpaceClickEvents$: userBoardClicks,
        userResetClickEvents$: userResetClicks,
        ai: testAiFunction,
      });
      expectObservable(result).toEqual(expected);
    });
  });

  test('computer wins', () => {
    const initialState = createInitialViewModel();
    const userClicksCenterSquare: SpaceCoordinates = {
      row: 1,
      column: 1,
    };
    const afterUserFirstMove: TicTacToeViewModel = {
      board: [
        ['', '', ''],
        ['', 'x', ''],
        ['', '', ''],
      ],
      turn: `computer's turn`,
    };
    const afterComputerFirstMove: TicTacToeViewModel = {
      board: [
        ['o', '', ''],
        ['', 'x', ''],
        ['', '', ''],
      ],
      turn: `your turn`,
    };
    const userClicksMiddleRightSquare: SpaceCoordinates = {
      row: 1,
      column: 2,
    };
    const afterUserSecondMove: TicTacToeViewModel = {
      board: [
        ['o', '', ''],
        ['', 'x', 'x'],
        ['', '', ''],
      ],
      turn: `computer's turn`,
    };
    const afterComputerSecondMove: TicTacToeViewModel = {
      board: [
        ['o', 'o', ''],
        ['', 'x', 'x'],
        ['', '', ''],
      ],
      turn: `your turn`,
    };
    const userClicksBottomLeftSquare: SpaceCoordinates = {
      row: 2,
      column: 0,
    };
    const afterUsersThirdClick: TicTacToeViewModel = {
      board: [
        ['o', 'o', ''],
        ['', 'x', 'x'],
        ['x', '', ''],
      ],
      turn: `computer's turn`,
    };
    const computerWins: TicTacToeViewModel = {
      board: [
        ['o', 'o', 'o'],
        ['', 'x', 'x'],
        ['x', '', ''],
      ],
      turn: `game over - you lose`,
    };
    const bottoMiddleClick: SpaceCoordinates = {
      row: 2,
      column: 1,
    };

    testScheduler.run(({ cold, expectObservable }) => {
      const userBoardClicks = cold<SpaceCoordinates>(
        '---a 1999ms ----b 1999ms ----c 1999ms ---d--d-dddd',
        {
          a: userClicksCenterSquare,
          b: userClicksMiddleRightSquare,
          c: userClicksBottomLeftSquare,
          d: bottoMiddleClick,
        }
      );
      const userResetClicks = cold<void>('----');
      const expected = cold('a--b 1999ms c---d 1999ms e---f 1999ms g', {
        a: initialState,
        b: afterUserFirstMove,
        c: afterComputerFirstMove,
        d: afterUserSecondMove,
        e: afterComputerSecondMove,
        f: afterUsersThirdClick,
        g: computerWins,
      });
      const result = ticTacToeViewModel$({
        userSpaceClickEvents$: userBoardClicks,
        userResetClickEvents$: userResetClicks,
        ai: testAiFunction,
      });
      expectObservable(result).toEqual(expected);
    });
  });

  test('tie game', () => {
    const initialState = createInitialViewModel();
    const userClicksCenterSquare: SpaceCoordinates = {
      row: 1,
      column: 1,
    };
    const afterUserFirstMove: TicTacToeViewModel = {
      board: [
        ['', '', ''],
        ['', 'x', ''],
        ['', '', ''],
      ],
      turn: `computer's turn`,
    };
    const afterComputerFirstMove: TicTacToeViewModel = {
      board: [
        ['o', '', ''],
        ['', 'x', ''],
        ['', '', ''],
      ],
      turn: `your turn`,
    };
    const userClicksTopMiddleSquare: SpaceCoordinates = {
      row: 0,
      column: 1,
    };
    const afterUserSecondMove: TicTacToeViewModel = {
      board: [
        ['o', 'x', ''],
        ['', 'x', ''],
        ['', '', ''],
      ],
      turn: `computer's turn`,
    };
    const afterComputerSecondMove: TicTacToeViewModel = {
      board: [
        ['o', 'x', 'o'],
        ['', 'x', ''],
        ['', '', ''],
      ],
      turn: `your turn`,
    };
    const userClicksMiddleLeftSquare: SpaceCoordinates = {
      row: 1,
      column: 0,
    };
    const afterUsersThirdClick: TicTacToeViewModel = {
      board: [
        ['o', 'x', 'o'],
        ['x', 'x', ''],
        ['', '', ''],
      ],
      turn: `computer's turn`,
    };
    const afterComputerThirdMove: TicTacToeViewModel = {
      board: [
        ['o', 'x', 'o'],
        ['x', 'x', 'o'],
        ['', '', ''],
      ],
      turn: `your turn`,
    };
    const bottomLeftClick: SpaceCoordinates = {
      row: 2,
      column: 0,
    };
    const afterUsersFourthClick: TicTacToeViewModel = {
      board: [
        ['o', 'x', 'o'],
        ['x', 'x', 'o'],
        ['x', '', ''],
      ],
      turn: `computer's turn`,
    };
    const afterComputerFourthMove: TicTacToeViewModel = {
      board: [
        ['o', 'x', 'o'],
        ['x', 'x', 'o'],
        ['x', 'o', ''],
      ],
      turn: `your turn`,
    };
    const lastUserClick: SpaceCoordinates = {
      row: 2,
      column: 2,
    };
    const tieGame: TicTacToeViewModel = {
      board: [
        ['o', 'x', 'o'],
        ['x', 'x', 'o'],
        ['x', 'o', 'x'],
      ],
      turn: `game over - it's a tie`,
    };

    testScheduler.run(({ cold, expectObservable }) => {
      const userBoardClicks = cold<SpaceCoordinates>(
        '---a 1999ms ----b 1999ms ----c 1999ms ---d 1999ms ---e',
        {
          a: userClicksCenterSquare,
          b: userClicksTopMiddleSquare,
          c: userClicksMiddleLeftSquare,
          d: bottomLeftClick,
          e: lastUserClick,
        }
      );
      const userResetClicks = cold<void>('----');
      const expected = cold(
        'a--b 1999ms c---d 1999ms e---f 1999ms g--h 1999ms i--j',
        {
          a: initialState,
          b: afterUserFirstMove,
          c: afterComputerFirstMove,
          d: afterUserSecondMove,
          e: afterComputerSecondMove,
          f: afterUsersThirdClick,
          g: afterComputerThirdMove,
          h: afterUsersFourthClick,
          i: afterComputerFourthMove,
          j: tieGame,
        }
      );
      const result = ticTacToeViewModel$({
        userSpaceClickEvents$: userBoardClicks,
        userResetClickEvents$: userResetClicks,
        ai: testAiFunction,
      });
      expectObservable(result).toEqual(expected);
    });
  });

  test('user can reset game while computer is thinking', () => {
    const initialState = createInitialViewModel();
    const userClick: SpaceCoordinates = {
      row: 1,
      column: 1,
    };
    const afterUserClick: TicTacToeViewModel = {
      board: [
        ['', '', ''],
        ['', 'x', ''],
        ['', '', ''],
      ],
      turn: `computer's turn`,
    };
    const afterComputerMoves: TicTacToeViewModel = {
      board: [
        ['o', '', ''],
        ['', 'x', ''],
        ['', '', ''],
      ],
      turn: `your turn`,
    };
    testScheduler.run(({ cold, expectObservable }) => {
      const userBoardClicks = cold<SpaceCoordinates>('---a----', {
        a: userClick,
      });
      const userResetClicks = cold<void>('-----a-', { a: undefined });
      const expected = cold('a--b-a---', {
        a: initialState,
        b: afterUserClick,
        c: afterComputerMoves,
      });
      const result = ticTacToeViewModel$({
        userSpaceClickEvents$: userBoardClicks,
        userResetClickEvents$: userResetClicks,
        ai: testAiFunction,
      });
      expectObservable(result).toEqual(expected);
    });
  });
});
