import {
  ListViewModel,
  customListImpl$ as listViewModel$,
  ListViewModelInputs,
} from '@derxjs/examples/list-view-model-implementation';
import { DeRxJSViewModelComponent } from './derxjs-view-model-component';

export function List({ initialValue }: { initialValue: string[] }) {
  return DeRxJSViewModelComponent<
    ListViewModelInputs,
    ListViewModel,
    ListProps<string>
  >({
    component: ListView as any,
    viewModel$: listViewModel$,
    initialValue,
    triggerMap: {
      pop: 'pop$',
      push: 'push$',
    },
    inputs: {},
  });
}

export interface ListProps<T> {
  initialState: T[];
  push: (toPush: T) => void;
  pop: () => void;
}

function ListView({
  state,
  triggers,
}: {
  state: ListViewModel;
  triggers: {
    push: (x: string) => void;
    pop: () => void;
  };
}) {
  console.log(triggers);
  const handlePush = (e: any) => {
    e.preventDefault();
    const textInput = document.getElementById('textInput')! as HTMLInputElement;
    const formValue = textInput.value;
    triggers.push(formValue);
    textInput.value = '';
  };
  return (
    <>
      <h1>@derxj/view-model React Usage Example</h1>
      <form>
        <input type="text" id="textInput" />
        <button onClick={handlePush}>Push</button>
      </form>
      <ul>
        {state.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <button onClick={triggers.pop}>Pop</button>
    </>
  );
}
