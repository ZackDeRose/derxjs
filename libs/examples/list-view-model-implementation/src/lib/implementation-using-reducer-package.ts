import { actionize, createDeRxJSReducer } from '@derxjs/reducer';
import { DeRxJSViewModel } from '@derxjs/view-model';
import { map } from 'rxjs/operators';
import { ListAction, ListViewModel, ListViewModelInputs } from './types';

export const listViewModel$: DeRxJSViewModel<
  ListViewModelInputs,
  ListViewModel
> = ({ push$, pop$, initialValue }) => {
  const state = createDeRxJSReducer({
    reducer,
    incomingObservables: {
      push: push$.pipe(
        map((item) => ({ item })),
        actionize('push')
      ),
      pop: pop$.pipe(
        map(() => undefined),
        actionize('pop')
      ),
    }, // when out of beta, this should be:
    // incomingObservables: [push$.pipe(actionize('push'), pop$.pipe(actionize('pop')))]
    effects: [],
    sideEffects: [],
    initialState: initialValue,
  });
  return state;
};

function reducer(state: ListViewModel, action: ListAction): ListViewModel {
  switch (action.type) {
    case 'push': {
      return [...state, action.item];
    }
    case 'pop': {
      const newState = [...state];
      newState.pop();
      return newState;
    }
  }
}
