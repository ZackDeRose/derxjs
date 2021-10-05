import { TestScheduler } from 'rxjs/testing';
import { listViewModel$ as customImpl$ } from './custom-implementation';
import { listViewModel$ as reducerPackageImpl$ } from './implementation-using-reducer-package';
import { DeRxJSListViewModel } from './types';

const implementations: DeRxJSListViewModel[] = [
  customImpl$,
  reducerPackageImpl$,
];

const testSuite = (impl$: DeRxJSListViewModel) => {
  describe('viewModel', () => {
    let testScheduler: TestScheduler;

    beforeEach(() => {
      testScheduler = new TestScheduler((actual, expected) =>
        expect(actual).toEqual(expected)
      );
    });

    test('with no user events, the list stays empty', () => {
      const initialValue = [];
      testScheduler.run(({ cold, expectObservable }) => {
        const push$ = cold<string>('------');
        const pop$ = cold<void>('------');
        const expected = cold('a-----', { a: [] });
        const result = impl$({
          push$,
          pop$,
          initialValue,
        });
        expectObservable(result).toEqual(expected);
      });
    });

    test('push pop push push pop push push pop pop pop pop pop', () => {
      const initialValue = [];
      testScheduler.run(({ cold, expectObservable }) => {
        const push$ = cold<string>('--a-----b-c----d-e-f', {
          a: 'a',
          b: 'b',
          c: 'c',
          d: 'd',
          e: 'e',
          f: 'f',
        });
        const pop$ = cold<void>('   -----z------z--------z-z-z-z');
        const expected = cold('     a-b--c--d-e-f--g-h-i-j-k-l-m', {
          a: [],
          b: ['a'],
          c: [],
          d: ['b'],
          e: ['b', 'c'],
          f: ['b'],
          g: ['b', 'd'],
          h: ['b', 'd', 'e'],
          i: ['b', 'd', 'e', 'f'],
          j: ['b', 'd', 'e'],
          k: ['b', 'd'],
          l: ['b'],
          m: [],
        });
        const result = impl$({
          push$,
          pop$,
          initialValue,
        });
        expectObservable(result).toEqual(expected);
      });
    });
  });
};

// note: the DeRxJSViewModel pattern allows us to use the same exact
// test suite to test either implementation
implementations.forEach(testSuite);
