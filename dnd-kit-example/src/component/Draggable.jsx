// Draggable.jsx

import React from 'react';
import { useDraggable } from '@dnd-kit/core';

export function Draggable({ id, coordinates }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
    });

    const style = {
        // Sürükleme sırasında: Son bilinen pozisyon + anlık sürükleme mesafesi (delta)
        // Sürükleme yokken: Sadece son bilinen pozisyon
        transform: `translate3d(
      ${coordinates.x + (transform?.x || 0)}px, 
      ${coordinates.y + (transform?.y || 0)}px, 0)`,
        // Sürükleme bittiğinde yumuşak geçiş için
        transition: isDragging ? 'none' : 'transform 250ms ease',
        // Diğer görsel stiller
        position: 'absolute',
        width: 120,
        height: 120,
        backgroundColor: 'tomato',
        borderRadius: '8px',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        cursor: 'grab',
        zIndex: isDragging ? 999 : 1,
    };
    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <p> {coordinates.x + " " + coordinates.y}</p>
        </div>
    );
}