import React from 'react';
import {useDraggable} from '@dnd-kit/core';

// Şekil component'i dışa aktarılıyor
export const Shape = ({ type, scale}) => {
    const itemStyle = {
        transform: `scale(${scale})`
    }
    console.log(scale);
    return <div className={`shape shape-${type}`} style={itemStyle} />;
};

export const DraggableCanvasItem = ({ id, type, position, isOverlay = false, currentScale, onUpdateRotation }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        data: {
            isCanvasItem: true,
        }
    });
    // const [newRotation, setNewRotation] = useState(0);

    console.log(currentScale);

    const handleRotateClick  = (event) => {
        // setNewRotation(prevRotation => prevRotation === 270 ? 0 : prevRotation + 90);
        event.stopPropagation();
        let newRotation = (position.rotation || 0) + 90;
        if(newRotation === 360){
            newRotation = 0;
        }
        onUpdateRotation(id, newRotation);
    };

    console.log(isOverlay);
    const style = {
        position: isOverlay ? 'relative' : 'absolute',
        left: isOverlay ? undefined : `${position?.x + (transform?.x || 0)}px`,
        top: isOverlay ? undefined : `${position?.y + (transform?.y || 0)}px`,
        // transformOrigin: `${pointerOffset.x}px ${pointerOffset.y}px`,
        transformOrigin: "center center",
        // transform: transform ? `${CSS.Translate.toString(scaledTransform)} scale(${currentScale})` : `scale(${currentScale})`,
        transform: `scale(${currentScale})`,
        // rotate: `${newRotation}deg`,
        opacity: isDragging ? 0 : 1,
        zIndex: isDragging ? -1 : 'auto',
        backgroundColor: 'pink'
    };

    const buttonStyle = {
        transform: `rotate(${position.rotation}deg)`,
    }

    return (
        /**
         *  İki farklı style oluşturduk.
         *  Birisi dış div için (style) dnd-kit özelliklerini taşır
         *  Diğeri sadece rotasyon için (buttonStyle) shape dönme efekti alsın diye verdik.
         */
        <div style={style} className="shape-wrapper">

            <div ref={setNodeRef}
                 {...listeners}
                 {...attributes}
                style={buttonStyle}
                 className={`shape shape-${type}`}>
                {type}
            </div>

            {!isDragging && (
                <button
                    onClick={handleRotateClick}
                    aria-label="Döndür"
                    className="rotate-button"
                >
                    ↻
                </button>
            )}
        </div>
    );
};

// const scaledTransform = transform
//     ? {
//         ...transform,
//         x: transform.x * currentScale, // veya * currentScale ihtiyacına göre
//         y: transform.y * currentScale,
//     } : null;

export default DraggableCanvasItem;