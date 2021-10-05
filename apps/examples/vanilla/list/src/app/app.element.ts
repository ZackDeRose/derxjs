import { fromEvent } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import './app.element.css';
import { reducerListImpl$ as listViewModel$ } from '@derxjs/examples/list-view-model-implementation';
// import { customListImpl$ as listViewModel$ } from '@derxjs/examples/list-view-model-implementation';

const appDiv: HTMLElement = document.getElementById('app');
const formId = `push-form`;
const textInputId = `text-input`;
const pushButtonId = `push-button`;
const popButtonId = `pop-button`;
const listId = `list`;
appDiv.innerHTML = `<h1>@derxjs/view-model Usage Example</h1>

<form id="${formId}">
  <input type="text" id="${textInputId}"/>
  <button id="${pushButtonId}">Push</button>
</form>

<ul id="${listId}"></ul>

<button id="${popButtonId}">Pop</button>
`;

const listTarget = document.getElementById(listId);
const pushForm = document.getElementById(formId) as HTMLFormElement;
const textInput = document.getElementById(textInputId) as HTMLInputElement;
const pushButton = document.getElementById(pushButtonId);
const popButton = document.getElementById(popButtonId);

pushForm.onsubmit = (event) => {
  event.preventDefault();
};

const push$ = fromEvent(pushButton, 'click').pipe(
  map(() => textInput.value),
  tap(() => (textInput.value = ''))
);
const pop$ = fromEvent(popButton, 'click').pipe(map(() => undefined));

listViewModel$({
  push$,
  pop$,
  initialValue: [],
}).subscribe((list) => {
  listTarget.innerHTML = list.map((item) => `<li>${item}</li>`).join('');
});
