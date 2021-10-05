# @derxjs/view-model

Because your state management code should be domain-agnostic.

<p align="center">
    <img src="../../images/derxjs-logo.jpg" height="400px"/>
</p>

## Installation

```bash
npm i @derxjs/view-model
```

## Usage

```ts
import { DeRxJSViewModel } from '@derxjs/view-model';
import { merge, Observable } from 'rxjs';
import { map, scan, startWith } from 'rxjs/operators';

export const listViewModel$: DeRxJSViewModel<
  ListViewModelInputs,
  ListViewModel
> = ({ push$, pop$, initialValue }) => {
  return merge(
    push$.pipe(map((item) => ({ type: 'push', item }))),
    pop$.pipe(map(() => ({ type: 'pop' })))
  ).pipe(scan(reducer, initialValue), startWith(initialValue));
};

interface ListViewModelInputs {
  push$: Observable<string>;
  pop$: Observable<void>;
  initialValue: string[];
}

type ListViewModel = string[];

type Action = { type: 'push'; item: string } | { type: 'pop' };

function reducer(state: ListViewModel, action: Action): ListViewModel {
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
```

See it in action on [StackBlitz](https://stackblitz.com/edit/typescript-ttcedi?embed=1&file=index.ts)

## Why @derxjs

### Domain-agnostic state-management

Your state management code should not depend on which framework or tools your project happens to be using at the time.

`@derxjs/view-model` is all about first-principles thinking and problem-solving. The pattern enforced by this package requires you to break down the your system - regardless of scope - to some set of inputs, (preferably represented as RxJS Observables!), and expose a single Observable of your ViewModel as an output.

Future packages on the roadmap will provide utilities for implementing this pattern (`@derxjs/reducer` 👀), as well as ultilities for plugging this pattern into popular front-end frameworks (`@derxjs/react` 👀).

### Separation of concerns

We solved this a long time ago. Programming to interfaces allows us to put a joint in our wrokflows that allows for parallel work to be completed by multiple developers, and lets your team play to their strengths.

<p align="center">
    <img src="../../images/separation-of-tasks.png" />
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
    <img src="../../images/the-derxjs-view-model-pattern.png" />
</p>

### TDD made awesome with timeline testing

Embrace TDD, using timeline testing to test your code with a whole new dimension of precision.

On the roadmap for `@derxjs` is a timeline test generation GUI tool that will take your Typescript interface code, and allow you to "draw" hypothetical timelines of events from your inputs - specifying what the output timeline for each hypothetical should look like.

This tool will generate `.spec.ts` files that you can paste directly into your repos for easy TDD, and coding the way we were meant to.

## @derxjs Roadmap

- @derxjs/view-model package ✅
- Article on TDD and implementing DeRxJS View Models (10/8/2021)
- Article on using DeRxJS View Models in different Frameworks (10/15/2021)
- @derxjs/reducer package (TBD; [beta available now](https://github.com/ZackDeRose/derxjs-reducer))
- Timeline Test Code Generation Tool (TBD)
- @derxjs/selector package (TBD)
- @derxjs/react package (TBD)
- Ai-Driven DeRxJS Code Generation (TBD)
