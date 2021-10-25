import {
  randomAi,
  SpaceCoordinates,
  ticTacToeViewModel$,
} from '@derxjs/examples/tic-tac-toe-view-model-implementation';
import { fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import './app.element.scss';

const appDiv: HTMLElement = document.getElementById('app');
const turnTextId = 'turn-text';

appDiv.innerHTML = `
<h1>Tic Tac Toe</h1>
<h2 id="${turnTextId}"></h2>
<div class="border">
  <div class="board">
    ${([0, 1, 2] as const)
      .map((row) => ([0, 1, 2] as const).map((column) => [row, column]))
      .flat()
      .map(
        ([row, column]) => `
      <div>
        <button id="row:${row}::column:${column}"></button>
      </div>
      `
      )
      .join('')}
  </div>
</div>
<button id="reset" class="reset">
  Reset
</button>
`;

const turnTextElement = document.getElementById(turnTextId);
const spaceButtonElements: Record<string, Observable<SpaceCoordinates>> = (
  [0, 1, 2] as const
)
  .map((row) => ([0, 1, 2] as const).map((column) => [row, column]))
  .flat()
  .reduce((acc, [row, column]) => {
    const id = `row:${row}::column:${column}`;
    const buttonElement = document.getElementById(id) as HTMLButtonElement;
    acc[id] = fromEvent(buttonElement, 'click').pipe(
      map(() => ({ row, column }))
    );
    return acc;
  }, {} as Record<string, Observable<SpaceCoordinates>>);

const userSpaceClickEvents$ = merge(...Object.values(spaceButtonElements));
const userResetClickEvents$ = fromEvent(
  document.getElementById('reset'),
  'click'
).pipe(map(() => undefined));
const vm$ = ticTacToeViewModel$({
  userSpaceClickEvents$,
  userResetClickEvents$,
  ai: randomAi,
});
vm$.subscribe(({ board, turn }) => {
  turnTextElement.textContent = turn;
  ([0, 1, 2] as const)
    .map((row) => ([0, 1, 2] as const).map((column) => [row, column]))
    .flat()
    .forEach(([row, column]) => {
      const buttonElement = document.getElementById(
        `row:${row}::column:${column}`
      );
      buttonElement.textContent = board[row][column].toUpperCase();
    });
});
