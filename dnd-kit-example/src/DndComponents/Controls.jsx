import {useControls} from "react-zoom-pan-pinch";
import React from "react";

const Controls = () => {
    const {zoomIn, zoomOut, resetTransform} = useControls();
    const buttonStyle = {
        margin: '5px',
        padding: '10px 15px',
        fontSize: '16px',
        cursor: 'pointer'
    };

    return (
        <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
            <button style={buttonStyle} onClick={() => zoomIn()}>Zoom In</button>
            <button style={buttonStyle} onClick={() => zoomOut()}>Zoom Out</button>
            <button style={buttonStyle} onClick={() => resetTransform()}>Reset</button>
        </div>
    );
};
export default Controls;