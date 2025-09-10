import {configureStore} from "@reduxjs/toolkit";
import canvasReducer from "../reducers/canvasSlice.jsx";

export const store = configureStore({
    reducer:{
        canvas : canvasReducer,
        //başka slice eklenirse buraya geleecek
    },
});
