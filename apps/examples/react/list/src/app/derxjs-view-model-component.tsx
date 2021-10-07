import { DeRxJSViewModel } from 'packages/view-model/src/lib/view-model';
import { useEffect, useState } from 'react';
import { Observable, Observer } from 'rxjs';

let pushObserver: Observer<string>;
let popObserver: Observer<void>;
const push$ = new Observable<string>((observer) => (pushObserver = observer));
const pop$ = new Observable<void>((observer) => (popObserver = observer));

/**
 * Some version of this higher-order componentexposed by our
 * ngrx/react package in an upcoming release!
 */
export const DeRxJSViewModelComponent = <InputType, ViewModelType, PropType>({
  viewModel$,
  component,
  triggerMap,
  initialValue,
  inputs,
}: DeRxJSViewModelComponentProps<InputType, ViewModelType, PropType>) => {
  const observers: Partial<Record<keyof PropType, Observer<any>>> = {};
  const observables: Partial<Record<keyof InputType, Observer<any>>> = {};
  const triggers: Partial<Record<keyof PropType, (x: any) => void>> = {};
  for (const [triggerKey, inputKey] of Object.entries(triggerMap)) {
    const inputName = inputKey as keyof InputType;
    const triggerName = triggerKey as keyof PropType;

    observables[inputName] = new Observable((observer) => {
      observers[triggerName] = observer;
      triggers[triggerName] = (x: any) => observer.next(x);
    }) as any;
  }
  //   const triggers = Object.keys(triggerMap).reduce((acc, key) => {
  //     acc[key] = (x: any) => observers[key].next(x);
  //     return acc;
  //   }, {} as any);
  const Component = () => {
    const [state, setState] = useState(initialValue);

    /** Subscribe */
    useEffect(() => {
      const subscription = viewModel$({
        ...inputs,
        ...observables,
      } as InputType).subscribe(setState);
      return () => subscription.unsubscribe();
    }, []);
    return component({
      state: state || initialValue,
      triggers,
    });
  };
  return Component();
};

export interface DeRxJSViewModelComponentProps<
  InputType,
  ViewModelType,
  PropType
> {
  viewModel$: DeRxJSViewModel<InputType, ViewModelType>;
  component: (x: {
    state: ViewModelType;
    triggers: Partial<Record<keyof PropType, (x: any) => void>>;
  }) => JSX.Element;
  triggerMap: Partial<Record<keyof PropType, keyof InputType>>;
  //   valueMap: Partial<Record<keyof PropType, any>>;
  initialValue: ViewModelType;
  inputs: Partial<InputType>;
}
