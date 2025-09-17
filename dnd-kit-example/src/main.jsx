import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {store} from './DndComponents/store/store.jsx'
import {Provider} from "react-redux";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
            <App/>
        </DndProvider>
    </Provider>
)
