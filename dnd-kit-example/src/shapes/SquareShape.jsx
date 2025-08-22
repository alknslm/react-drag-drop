import React from "react";

export default function SquareShape({ draggable, onDragStart, style }) {
    return (
        <div
            draggable={draggable}
            onDragStart={onDragStart}
            style={{
                width: 75,
                height: 75,
                background: "red",
                cursor: "grab",
                ...style
            }}
        />
    );
}
