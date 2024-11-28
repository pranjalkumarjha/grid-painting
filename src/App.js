import React, { useState } from 'react';
import Grid from './components/Grid';
import Navbar from './components/Navbar';
import { Provider } from './context/RowColContext';
import Canvas from './components/Canvas';
import BootUpAnimation from './components/BootUpAnimation';

function App() {
    const [isBootUpComplete, setIsBootUpComplete] = useState(false);

    return (
        <Provider>
            <div className="App">
                {!isBootUpComplete && (
                    <BootUpAnimation onComplete={() => setIsBootUpComplete(true)} />
                )}
                {isBootUpComplete && (
                    <>
                        <Navbar />
                        <Canvas />
                        {/* <Grid /> */}
                    </>
                )}
            </div>
        </Provider>
    );
}

export default App;
