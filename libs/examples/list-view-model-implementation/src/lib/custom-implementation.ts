import { DeRxJSViewModel } from '@derxjs/view-model';
import { merge } from 'rxjs';
import { map, scan, startWith } from 'rxjs/operators';
import { ListAction, ListViewModel, ListViewModelInputs } from './types';

export const listViewModel$: DeRxJSViewModel<
  ListViewModelInputs,
  ListViewModel
> = ({ push$, pop$, initialValue }) => {
  return merge(
    push$.pipe(map((item) => ({ type: 'push' as const, item }))),
    pop$.pipe(map(() => ({ type: 'pop' as const })))
  ).pipe(scan(reducer, initialValue), startWith(initialValue));
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
