// App.jsx (Tek dosya içinde tam örnek)

import React from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import AppDnd from "./DndComponents/AppDnd.jsx";

function App() {
    return (
        <DndProvider backend={HTML5Backend}>
            <div >
                {/*<CanvasApp />*/}
                <AppDnd />
            </div>
        </DndProvider>
    );
}

export default App;