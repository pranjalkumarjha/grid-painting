//App.js
import Grid from './components/Grid';
import Navbar from './components/Navbar'
import {Provider} from './context/RowColContext'
import Canvas from './components/Canvas'
function App() {
  return (
    <Provider>
    <div className="App">
             <Navbar />
             {/* <Grid/> */}
             <Canvas/>
    </div>
    </Provider>
  );
}

export default App;
