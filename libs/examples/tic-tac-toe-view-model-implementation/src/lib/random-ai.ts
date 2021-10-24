import { SpaceCoordinates } from '..';
import { TicTacToeAi } from './types';

export const randomAi: TicTacToeAi = ({ board }) => {
  const openSpots: SpaceCoordinates[] = [];
  for (let row = 0; row <= 2; row++) {
    for (let col = 0; col <= 2; col++) {
      if (board[row][col] === '') {
        openSpots.push({ row, column: col } as SpaceCoordinates);
      }
    }
  }
  const index = Math.floor(Math.random() * openSpots.length);
  return openSpots[index];
};
