import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Canvas from "./Canvas";

export default function CanvasApp() {
    const [draggedShape, setDraggedShape] = useState(null);

    return (
        <div style={{ display: "flex" }}>
            <Sidebar onDragStart={(e, type) => setDraggedShape(type)} />
            <Canvas draggedShape={draggedShape} />
        </div>
    );
}
