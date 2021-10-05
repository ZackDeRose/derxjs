import { Observable } from 'rxjs';

export type DeRxJSViewModel<InputType, ViewModelType> = (
  inputs: InputType
) => Observable<ViewModelType>;
