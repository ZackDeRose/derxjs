import { Component } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import {
  customListImpl$ as listViewModel$,
  // reducerListImpl$ as listViewModel$,
  ListViewModel,
} from '@derxjs/examples/list-view-model-implementation';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'derxjs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  textInputFormControl = new UntypedFormControl();
  private _pushObserver!: Observer<string>;
  private _popObserver!: Observer<void>;
  viewModel$: Observable<ListViewModel>;

  constructor() {
    const push$ = new Observable<string>(
      (observer) => (this._pushObserver = observer)
    );
    const pop$ = new Observable<void>(
      (observer) => (this._popObserver = observer)
    );
    this.viewModel$ = listViewModel$({ push$, pop$, initialValue: [] }) as any;
  }

  push() {
    this._pushObserver.next(this.textInputFormControl.value);
    this.textInputFormControl.reset();
  }

  pop() {
    this._popObserver.next();
  }
}
