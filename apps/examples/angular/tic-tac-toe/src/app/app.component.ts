import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ticTacToeViewModel$,
  randomAi,
  SpaceCoordinates,
  BoardIndex,
} from '@derxjs/examples/tic-tac-toe-view-model-implementation';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'derxjs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  userResetClickObserver!: Observer<void>;
  userResetClickEvents$ = new Observable<void>(
    (observer) => (this.userResetClickObserver = observer)
  );
  userSpaceClickObserver!: Observer<SpaceCoordinates>;
  userSpaceClickEvents$ = new Observable<SpaceCoordinates>(
    (observer) => (this.userSpaceClickObserver = observer)
  );
  vm$ = ticTacToeViewModel$({
    ai: randomAi,
    userSpaceClickEvents$: this.userSpaceClickEvents$,
    userResetClickEvents$: this.userResetClickEvents$,
  });
  rows: BoardIndex[] = [0, 1, 2];

  handleSpaceClick(coordinates: SpaceCoordinates) {
    this.userSpaceClickObserver.next(coordinates);
  }

  handleResetClick() {
    console.log('reset clicked!');
    this.userResetClickObserver.next();
  }
}
