import React from 'react';
import {useDraggable, useDroppable} from '@dnd-kit/core';
import {horizontalListSortingStrategy, SortableContext} from "@dnd-kit/sortable";
import TableItem from "./TableItem.jsx";

// Şekil component'i dışa aktarılıyor
export const Shape = ({type, scale}) => {
    const itemStyle = {
        transform: `scale(${scale})`
    }
    console.log(scale);
    return <div className={`shape shape-${type}`} style={itemStyle}/>;
};

/** Masaların üzerine sürüklenebilir elemanlar*/
export const DraggableCanvasItem = ({
                                        id, type, typeForCss, position, isOverlay = false,
                                        currentScale,pointerOffset, onUpdateRotation, accepts, children=[]
                                    }) => {
    const {attributes, listeners, setNodeRef: setDraggableRef, transform, isDragging} = useDraggable({
        id: id,
        data: {
            type: type,
            isCanvasItem: true,
        }
    });

    const {setNodeRef: setDroppableRef} = useDroppable({
        id: id,
        data: {
            type: type,
            accepts: accepts,
        },
    });

    const setNodeRef = (node) => {
        setDraggableRef(node);
        setDroppableRef(node);
    };


    const handleRotateClick = (event) => {
        // setNewRotation(prevRotation => prevRotation === 270 ? 0 : prevRotation + 90);
        event.stopPropagation();
        let newRotation = (position.rotation || 0) + 90;
        if (newRotation === 360) {
            newRotation = 0;
        }
        onUpdateRotation(id, newRotation);
    };

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
    };

    const buttonStyle = {
        transform: `rotate(${position.rotation}deg)`,
        transition: "transform 0.2s ease-in-out"
    }

    const childIds = children.map(child => child.id);

    return (
        /**
         *  İki farklı style oluşturduk.
         *  Birisi dış div için (style) dnd-kit özelliklerini taşır
         *  Diğeri sadece rotasyon için (buttonStyle) shape dönme efekti alsın diye verdik.
         *  className={`shape shape-${typeForCss}`}
         *  {
         *                     typeForCss == "l-shape" ?  <div style={{borderStyle: "solid", borderWidth : "0 0",
         *                         position: "relative", float:"right", clear :"none",
         *                         width: "60%", height : "60%", backgroundColor :"red"}}></div> : null
         *                 }
         */
        <div style={style} className="shape-wrapper">
            <SortableContext items={childIds} strategy={horizontalListSortingStrategy}>
            <div ref={setNodeRef}
                 {...listeners}
                 {...attributes}
                 style={buttonStyle}
                 className={`shape shape-${typeForCss}`}>
                {
                    typeForCss == "l-shape" ? <div style={{
                        borderStyle: "solid",
                        borderWidth: "0 0",
                        position: "relative",
                        float: "right",
                        clear: "none",
                        width: "60%",
                        height: "60%",
                    }}></div> : null
                }
                {children.map(table => (
                    <TableItem
                        key={table.id}
                        id={table.id}
                        parentId={id}
                        typeForCss={table.typeForCss}
                    />
                ))}
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
            </SortableContext>
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