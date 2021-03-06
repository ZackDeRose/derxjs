import {
  ListViewModel,
  ListViewModelInputs,
} from '@derxjs/examples/list-view-model-implementation';
import { DeRxJSViewModel } from '@derxjs/view-model';
import { useEffect, useState } from 'react';
import { Observable, Observer } from 'rxjs';

let pushObserver: Observer<string>;
let popObserver: Observer<void>;
const push$ = new Observable<string>((observer) => (pushObserver = observer));
const pop$ = new Observable<void>((observer) => (popObserver = observer));

export const CustomListImpl = (
  viewModel: DeRxJSViewModel<ListViewModelInputs, ListViewModel>,
  component: ({
    viewModel,
    pushClick,
    popClick,
  }: {
    viewModel: ListViewModel;
    pushClick: (x: string) => void;
    popClick: () => void;
  }) => any
) => {
  const [viewModelValue, setViewModel] = useState([] as ListViewModel);
  const pushClick = (value: string) => pushObserver.next(value);
  const popClick = () => popObserver.next();
  useEffect(() => {
    const subscription = viewModel({ push$, pop$, initialValue: [] }).subscribe(
      (x) => setViewModel(x)
    );
    return () => subscription.unsubscribe();
  }, []);
  return component({ viewModel: viewModelValue, popClick, pushClick });
};

export function ListView({
  viewModel,
  pushClick,
  popClick,
}: {
  viewModel: ListViewModel;
  pushClick: (x: string) => void;
  popClick: () => void;
}) {
  const handlePush = (e: any) => {
    e.preventDefault();
    const textInput = document.getElementById('textInput')! as HTMLInputElement;
    const formValue = textInput.value;
    pushClick(formValue);
    textInput.value = '';
  };

  return (
    <div>
      <form>
        <input type="text" id="textInput" />
        <button onClick={handlePush}>Push</button>
      </form>
      <ul>
        {viewModel.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <button onClick={popClick}>Pop</button>
    </div>
  );
}
