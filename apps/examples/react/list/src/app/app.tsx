import { customListImpl$ } from '@derxjs/examples/list-view-model-implementation';
import { CustomListImpl, ListView } from './CustomListImpl';
import { List } from './List';

export const App = () => {
  return (
    <>
      <h1>@derxj/view-model React Usage Example</h1>
      <List initialValue={[]} />
      <hr />
      <List initialValue={[]} />
      <hr />
      {CustomListImpl(customListImpl$, ListView)}
    </>
  );
};

export default App;
