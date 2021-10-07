import {
  ListViewModel,
  customListImpl$ as listViewModel$,
  ListViewModelInputs,
} from '@derxjs/examples/list-view-model-implementation';
import { useRef } from 'react';
import { DeRxJSComponent } from '@derxjs/react';

export const List = ({ initialValue }: { initialValue: string[] }) => {
  return DeRxJSComponent<ListViewModelInputs, ListViewModel, ListProps<string>>(
    {
      component: ListView as any,
      viewModel$: listViewModel$,
      initialValue,
      triggerMap: {
        pop: 'pop$',
        push: 'push$',
      },
      inputs: { initialValue },
    }
  );
};

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
  const textInputElement = useRef<HTMLInputElement>(null);
  const handlePush = (e: any) => {
    e.preventDefault();
    const textInput = textInputElement.current!;
    const formValue = textInput.value;
    triggers.push(formValue);
    textInput.value = '';
  };
  return (
    <>
      <form>
        <input type="text" ref={textInputElement} />
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
