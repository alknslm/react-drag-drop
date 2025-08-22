import React from "react";

export default function LShape({ draggable, onDragStart, style }) {

    return (
        <div
            draggable={draggable}
            onDragStart={onDragStart}
            style={{
                width: "75px",
                height: "75px",
                background: "#3498db",
                clipPath: "polygon(0 0, 40% 0, 40% 60%, 100% 60%, 100% 100%, 0 100%)",
                cursor: "grab",
                ...style
            }}
        >
            <div style={{ background: "blue", gridColumn: "1", gridRow: "1" }} />
            <div style={{ background: "blue", gridColumn: "1", gridRow: "2" }} />
            <div style={{ background: "blue", gridColumn: "1", gridRow: "3" }} />
            <div style={{ background: "blue", gridColumn: "2", gridRow: "3" }} />
            <div style={{ background: "blue", gridColumn: "3", gridRow: "3" }} />
        </div>
    );
}
