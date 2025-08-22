// Sidebar.jsx
import React from 'react';
import LShape from "../shapes/LShape.jsx";
import SquareShape from "../shapes/SquareShape.jsx";

export default function Sidebar({ onDragStart }) {

    return (
        <div
            style={{
                width: "170px",
                background: "#f0f0f0",
                padding: "10px",
                display: "flex",
                flexDirection: "row-reverse",
                gap: "10px",
            }}
        >
            <LShape draggable onDragStart={(e) => onDragStart(e, "LShape")} />
            <SquareShape draggable onDragStart={(e) => onDragStart(e, "SquareShape")} />

            <SquareShape draggable onDragStart={(e) => onDragStart(e, "SquareShape")} />
        </div>
    );
}

