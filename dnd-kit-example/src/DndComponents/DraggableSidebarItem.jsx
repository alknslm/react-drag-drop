// src/components/DraggableSidebarItem.js
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const DraggableSidebarItem = ({ type, children }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: type,
        data: {
            isSidebarItem: true,
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        // Sürüklenirken orijinal elemanı biraz soluklaştır
        opacity: isDragging ? 0 : 1,
    };

    return (
        <div
            className={`sidebar-item sidebar-item-${type}`}
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
        >
            {children}
        </div>
    );
};

export default DraggableSidebarItem;