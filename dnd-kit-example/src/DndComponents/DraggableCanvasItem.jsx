import React from 'react';
import {useDraggable, useDroppable} from '@dnd-kit/core';
import {horizontalListSortingStrategy, SortableContext} from "@dnd-kit/sortable";
import TableItem from "./TableItem.jsx";
import { CSS } from '@dnd-kit/utilities'

/** Masaların üzerine sürüklenebilir elemanlar*/
export const DraggableCanvasItem = ({
                                        id, type, typeForCss, position, isOverlay = false,
                                        currentScale,onSelectItem, isSelected,selectedItemId, onUpdateRotation, accepts, children=[]
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

    // Tıklandığında seçimi tetikle ve event'in canvas'a yayılmasını engelle
    const handleClick = (e) => {
        e.stopPropagation(); // Bu çok önemli! Yoksa canvas'a tıklama olayı da tetiklenir.
        onSelectItem(id);
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

    const scaledTransform = transform
        ? {
            ...transform,
            x: transform.x * currentScale,
            y: transform.y * currentScale
        }
        : null;

    const wrapperStyle = {
        position: isOverlay ? 'relative' : 'absolute',
        left: isOverlay ? undefined : `${position?.x}px`,
        top: isOverlay ? undefined : `${position?.y}px`,
        transformOrigin: "center center",
        transform: `${transform ? CSS.Translate.toString(scaledTransform) + ' ' : ''}scale(${currentScale})`,
        opacity: isDragging ? 0 : 1,
        zIndex: isDragging ? -1 : 'auto',
    };


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
        <div ref={setNodeRef} style={wrapperStyle} {...listeners} {...attributes} onClick={handleClick} className="shape-wrapper">
            <SortableContext items={childIds} strategy={horizontalListSortingStrategy}>
                <div style={{transform : `rotate(${position.rotation}deg)`, transition: "transform 0.2s ease-in-out"}}
                     className={`shape shape-${typeForCss}`}>
                    {typeForCss === "l-shape" && (
                        <div style={{
                            borderStyle: "solid",
                            borderWidth: "0 0",
                            position: "relative",
                            float: "right",
                            clear: "none",
                            width: "60%",
                            height: "60%",
                        }}></div>
                    )}
                    {children.map(table => (
                        <TableItem
                            key={table.id}
                            id={table.id}
                            parentId={id}
                            typeForCss={table.typeForCss}
                            onSelectItem={onSelectItem} // onSelectItem fonksiyonunu TableItem'a aktar
                            isSelected={table.id === selectedItemId}
                        />
                    ))}
                </div>
            </SortableContext>

            {/* Döndürme butonu rotation'dan bağımsız */}
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