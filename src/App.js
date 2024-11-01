//App.js
import Grid from './components/Grid';
import Navbar from './components/Navbar'
import {Provider} from './context/RowColContext'
function App() {
  return (
    <Provider>
    <div className="App">
             <Navbar />
             <Grid/>
    </div>
    </Provider>
  );
}

export default App;
