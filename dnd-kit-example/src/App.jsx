// App.jsx (Tek dosya içinde tam örnek)

import React from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import AppDnd from "./DndComponents/AppDnd.jsx";

function App() {
    return (
            <div >
                {/*<CanvasApp />*/}
                <AppDnd />
            </div>
    );
}

export default App;