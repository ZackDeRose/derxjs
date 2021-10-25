import { DeRxJSComponent } from '@derxjs/react';
import {
  TicTacToeViewModelInputs,
  TicTacToeViewModel,
  SpaceCoordinates,
  SpaceContent,
  ticTacToeViewModel$,
  createInitialViewModel,
  randomAi,
} from '@derxjs/examples/tic-tac-toe-view-model-implementation';

export const TicTacToe = () => {
  return DeRxJSComponent<
    TicTacToeViewModelInputs,
    TicTacToeViewModel,
    TicTacToeProps
  >({
    viewModel$: ticTacToeViewModel$,
    component: TicTacToeView as any,
    initialValue: createInitialViewModel(),
    triggerMap: {
      spaceClick: 'userSpaceClickEvents$',
      resetClick: 'userResetClickEvents$',
    },
    inputs: {
      ai: randomAi,
    },
  });
};

export interface TicTacToeProps {
  spaceClick: (spaceCoordinates: SpaceCoordinates) => void;
  resetClick: () => void;
}

interface SpaceProps {
  contents: SpaceContent;
  spaceCoordinates: SpaceCoordinates;
  clickHandler: (spaceCoordinates: SpaceCoordinates) => void;
}
const Space = ({ contents, clickHandler, spaceCoordinates }: SpaceProps) => (
  <div>
    <button onClick={() => clickHandler(spaceCoordinates)}>
      {contents.toUpperCase()}
    </button>
  </div>
);

function TicTacToeView({
  state,
  triggers,
}: {
  state: TicTacToeViewModel;
  triggers: TicTacToeProps;
}) {
  return (
    <>
      <h2>{state.turn}</h2>
      <div className={'border'}>
        <div className={'board'}>
          {([0, 1, 2] as const)
            .map((row) => ([0, 1, 2] as const).map((column) => [row, column]))
            .flat()
            .map(([row, column]) => (
              <Space
                contents={state.board[row][column]}
                spaceCoordinates={{ row, column }}
                clickHandler={triggers.spaceClick}
              />
            ))}
        </div>
      </div>
      <button className="reset" onClick={triggers.resetClick}>
        Reset
      </button>
    </>
  );
}
