// src/components/DraggableCanvasItem.js
import React from 'react';
import {useDraggable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';
// restrictToParent artık kullanılmayacak

// Şekil component'i dışa aktarılıyor
export const Shape = ({ type, scale}) => {
    const itemStyle = {
        transform: `scale(${scale})`
    }
    console.log(scale);
    return <div className={`shape shape-${type}`} style={itemStyle} />;
};

export const DraggableCanvasItem = ({ id, type, position, isOverlay = false, currentScale, pointerOffset }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        data: {
            isCanvasItem: true,
        }
    });

    const scaledTransform = transform
        ? {
            ...transform,
            x: transform.x * currentScale, // veya * currentScale ihtiyacına göre
            y: transform.y * currentScale,
        } : null;

    const style = {
        position: isOverlay ? 'relative' : 'absolute',
        left: isOverlay ? undefined : `${position?.x + (transform?.x || 0)}px`,
        top: isOverlay ? undefined : `${position?.y + (transform?.y || 0)}px`,
        transformOrigin: `${pointerOffset.x}px ${pointerOffset.y}px`,
        // transform: transform ? `${CSS.Translate.toString(scaledTransform)} scale(${currentScale})` : `scale(${currentScale})`,
        transform: `scale(${currentScale})`,
        opacity: isDragging ? 0 : 1,
        zIndex: isDragging ? -1 : 'auto',
    };

    console.log("draggableCanvasItems scale değeri : " + currentScale);
    return (
        // <div
        //     ref={setNodeRef}
        //     style={style}
        //     {...listeners}
        //     {...attributes}
        //     className={isOverlay ? 'drag-overlay-item' : ''}
        // >
        //     <Shape type={type} scale={currentScale}/>
        // </div>
        <button ref={setNodeRef}
                style={style}
                {...listeners}
                {...attributes}
                className={`shape shape-${type}`}
                > DENEME</button>
    );
};

export default DraggableCanvasItem;