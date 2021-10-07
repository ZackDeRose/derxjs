`**Note: This API is Subject to Change!**
_(@derxjs/view-model is stable however)_

# @derxjs/react

Because your state management code should be domain-agnostic.

<p align="center">
    <img src="https://github.com/ZackDeRose/derxjs/blob/main/derxjs-react-logo.png" height="400px"/>
</p>

## Installation

```bash
npm i @derxjs/react
```

## Usage

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/react-ts-j89fzs?file=List.tsx)

**App.tsx**

```tsx
import { customListImpl$ } from '@derxjs/examples/list-view-model-implementation';
import { List } from './List';

export const App = () => {
  return (
    <>
      <h1>@derxj/view-model React Usage Example</h1>
      <List initialValue={[]} />
      <hr />
      <List initialValue={[]} />
      <hr />
    </>
  );
};

export default App;
```

**List.tsx**

```tsx
import {
  ListViewModel,
  customListImpl$ as listViewModel$,
  ListViewModelInputs,
} from '@derxjs/examples/list-view-model-implementation';
// ^ import a view-model created with @derxjs/view-model
import { useRef } from 'react';
import { DeRxJSComponent } from '@derxjs/react';
// ^ import the DeRxJSComponent
// (think of it like a function that returns a Component)

export const List = ({ initialValue }: { initialValue: string[] }) => {
  return DeRxJSComponent<ListViewModelInputs, ListViewModel, ListProps<string>>(
    {
      component: ListView as any, // pass in a 'view'/'ui' component
      viewModel$: listViewModel$, // plug in your view model implementation
      initialValue, // give it an initial value
      triggerMap: {
        pop: 'pop$',
        push: 'push$',
      },
      // ^ give an object of how to link your trigger fns to
      // your input Observables
      // ++ type-safety!!
      inputs: { initialValue }, // pass in any other inputs (your non-Observables)
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
```

- More docs to come for 2.0.0 release

## Why @derxjs

### Domain-agnostic state-management

Your state management code should not depend on which framework or tools your project happens to be using at the time.

`@derxjs/view-model` is all about first-principles thinking and problem-solving. The pattern enforced by this package requires you to break down the inputs of your system - regardless of scope - to some set of inputs, represented as RxJS Observables, and

Future packages on the roadmap will provide utilities for implementing this pattern (`@derxjs/reducer` 👀), as well as ultilities for plugging this pattern into popular front-end frameworks (`@derxjs/react` 👀).

### Separation of concerns

We solved this a long time ago. Programming to interfaces allows us to put a joint in our wrokflows that allows for parallel work to be completed by multiple developers, and lets your team play to their strengths.

<p align="center">
    <img src="https://github.com/ZackDeRose/derxjs/blob/main/separation-of-tasks.png" />
</p>

This allows for easy transitions into other implementations, frameworks, as well as implementing the facade, adapter, and proxy patterns from the Gang of Four.

### Complimentary to all existing state-management libraries

We're not here to take a shot at the king ([👑](https://ngrx.io/)👀) - we're just here to help out where we can!

The `@derxjs/view-model` package is designed to work with with any other state management frameworks that can expose state or events as an Observable, making it a great compliment to any and all existing code in your codebase.

### Future-Proof Code

Domain-agnostic first-principles-based code will never go out of style 🌲.

As long as JavaScript is the language of the web, your state-management code will be valid.

Go ahead, change to that trendy new framework. Your @derxjs code will still work just fine :).

### Simplicity && Elegence

The `DeRxJSViewModel` type is the `E = mc^2` of state management.

Deceptively simple, but elegant enough to encompass any && all of your state management requirements.

<p align="center">
    <img src="https://github.com/ZackDeRose/derxjs/blob/main/the-derxjs-view-model-pattern.png" />
</p>

### TDD made awesome with timeline testing

Embrace TDD, using timeline testing to test your code with a whole new dimension of precision.

On the roadmap for `@derxjs` is a timeline test generation GUI tool that will take your Typescript interface code, and allow you to "draw" hypothetical timelines of events from your inputs - specifying what the output timeline for each hypothetical should look like.

This tool will generate `.spec.ts` files that you can paste directly into your repos for easy TDD, and coding the way we were meant to.

## @derxjs Roadmap

- @derxjs/view-model package ✅
- Article on TDD and implementing DeRxJS View Models (10/8/2021)
- Article on using DeRxJS View Models in different Frameworks (10/15/2021)
- @derxjs/reducer package (TBD; beta available now)
- Timeline Test Code Generation Tool (TBD)
- @derxjs/selector package (TBD)
- @derxjs/react package (TBD; beta available now)
- Ai-Driven DeRxJS Code Generation (TBD)
  `
