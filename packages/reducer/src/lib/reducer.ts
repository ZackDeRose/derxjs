import { merge, Observable, Subject, Subscription } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  scan,
  share,
  startWith,
} from 'rxjs/operators';

// export function createDeRxJSReducer<K, T>: DeRxJSViewModel<K, T>;
export function createDeRxJSReducer<ViewModelType, ActionsUnionType>({
  reducer,
  effects,
  sideEffects,
  incomingObservables,
  teardownFn,
  initialState,
}: DeRxJSReducerInputs<
  ViewModelType,
  ActionsUnionType
>): Observable<ViewModelType> {
  const actionsSubject = new Subject<ActionsUnionType>();
  const actions$ = merge(...Object.values(incomingObservables)).pipe(
    share({ connector: () => actionsSubject })
  );
  const state$ = actions$.pipe(
    scan(reducer, initialState),
    startWith<ViewModelType>(initialState),
    distinctUntilChanged()
  );
  const subscriptions = new Subscription();
  if (teardownFn) {
    const teardown = async () => {
      await teardownFn();
      subscriptions.unsubscribe();
    };
    teardown();
  }
  for (const effect of effects) {
    subscriptions.add(
      effect(state$, actionsSubject)
        .pipe(share({ connector: () => actionsSubject }))
        .subscribe()
    );
  }
  for (const sideEffect of sideEffects) {
    subscriptions.add(sideEffect(state$, actionsSubject).subscribe());
  }
  return state$;
}

export interface DeRxJSReducerInputs<ViewModelType, ActionsUnionType> {
  reducer: (a: ViewModelType, b: ActionsUnionType) => ViewModelType;
  effects: ((
    state$: Observable<ViewModelType>,
    actions: Observable<ActionsUnionType>
  ) => Observable<ActionsUnionType>)[];
  // | (() => ActionsUnionType)
  // | (() => Promise<ActionsUnionType>))[];
  sideEffects: ((
    state$: Observable<ViewModelType>,
    actions: Observable<ActionsUnionType>
  ) => Observable<any>)[];
  // | (() => any) | (() => Promise<any>);
  incomingObservables: {
    [x: string]: Observable<ActionsUnionType>;
  };
  teardownFn?: () => Promise<void>;
  initialState: ViewModelType;
}

export type Action<K extends string, T extends any> = {
  type: K;
} & T;

// export type ActionCreator<K extends string, T extends any> = (
//   data?: T
// ) => Action<K, T>;

// export function createAction<T extends any, K extends string>(
//   type: K
// ): ActionCreator<K, T> {
//   const actionCreatorComposer = (x: K) => (data?: T) => ({
//     type: x,
//     ...(data || {}),
//   });
//   const actionCreator = actionCreatorComposer(type);
//   return actionCreator;
// }

export function actionize<K extends string, T>(actionName: K) {
  return function (inc$: Observable<T>): Observable<{ type: K } & T> {
    return inc$.pipe(map((x) => ({ type: actionName, ...x })));
  };
}
