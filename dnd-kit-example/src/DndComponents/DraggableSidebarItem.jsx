// src/components/DraggableSidebarItem.jsx
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

/**
 * Sidebar'daki sürüklenebilir öğeler.
 * type: 'canvas-item' | 'static-child' | 'wall-item'
 * typeForCss: CSS sınıfı ve görünüm için (ör: "square", "curved-monitor")
 * children: Gösterilecek içerik (etiket, ikon, vs.)
 */
const DraggableSidebarItem = ({ id, type, typeForCss, children }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `sidebar-${id}`, // Benzersiz değil, her sürüklemeye yeni ID vermek istersen App.js'te yönet
    data:{
        type,
        isSidebarItem: true,
        typeForCss,
        accepts: type === 'canvas-item' ? ['static-child'] : undefined,
    },
});

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1, // Sürüklenirken soluk görünsün
        cursor: 'grab',
        userSelect: 'none',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`sidebar-item sidebar-item-${typeForCss}`}
        >
            {children}
        </div>
    );
};

export default DraggableSidebarItem;