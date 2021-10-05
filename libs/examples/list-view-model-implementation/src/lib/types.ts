import { DeRxJSViewModel } from 'packages/view-model/src/lib/view-model';
import { Observable } from 'rxjs';

export type DeRxJSListViewModel = DeRxJSViewModel<
  ListViewModelInputs,
  ListViewModel
>;

export interface ListViewModelInputs {
  push$: Observable<string>;
  pop$: Observable<void>;
  initialValue: string[];
}

export type ListViewModel = string[];

export type ListAction = { type: 'push'; item: string } | { type: 'pop' };
