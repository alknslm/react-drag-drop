// src/components/DraggableSidebarItem.js
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

/** Kenar çubuğundaki her ögeyi temsil eder*/
const DraggableSidebarItem = ({ id, type, children, typeForCss }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `sidebar-${id}`,
        data: {
            type: type,
            isSidebarItem: true,
            typeForCss: typeForCss,
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        // Sürüklenirken orijinal elemanı biraz soluklaştır
        opacity: isDragging ? 0 : 1,
    };

    return (
        <div
            className={`sidebar-item sidebar-item-${typeForCss}`}
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