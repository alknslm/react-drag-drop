// resize + child alabilir

// src/components/canvas/ResizableContainerItem.jsx
import React, { useRef } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import {horizontalListSortingStrategy, SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { useDispatch, useSelector } from "react-redux";
import StaticChildItem from "./StaticChildItem.jsx"; // Çocuklar için
import ResizeHandle from "./ResizeHandle.jsx";
import {
    selectItem,
    updateItemRotation,
    updateItemSize
} from "../reducers/canvasSlice.jsx";

const ResizableContainerItem = ({ item, isOverlay = false }) => {
    const dispatch = useDispatch();
    const currentScale = useSelector((state) => state.canvas.scale);

    const initialSize = useRef({ width: item.data.size?.width || 100, height: item.data.size?.height || 100 });
    const startPosition = useRef({ x: 0, y: 0 });

    // Sürüklemek için
    const {attributes, listeners, setNodeRef: setDraggableRef, transform, isDragging} = useDraggable({
        id: item.id,
        data: {
            type: item.data.type,
            isCanvasItem: true,
        }
    });

    // Üzerine StaticChildItem alabilsin diye
    const { setNodeRef: setDroppableRef } = useDroppable({
        id: item.id,
        data : {
        type: item.data.type,
        accepts: ['static-child'], // sadece static child kabul etsin
    },
});

    const setNodeRef = (node) => {
        setDraggableRef(node);
        setDroppableRef(node);
    };

    // Resize işlemleri
    const handleResizeStart = (event) => {
        startPosition.current = { x: event.clientX, y: event.clientY };
        initialSize.current = { width: item.data.size?.width || 100, height: item.data.size?.height || 100 };
    };

    const handleResizeMove = (event) => {
        // 🚨 Artık event.deltaX ve event.deltaY scale'e göre normalize edilmiş!
        const deltaX = event.deltaX; // ZATEN scale'e bölünmüş!
        const deltaY = event.deltaY;

        const newWidth = Math.max(50, initialSize.current.width + deltaX);
        const newHeight = Math.max(50, initialSize.current.height + deltaY);

        dispatch(updateItemSize({
            id: item.id,
            width: newWidth,
            height: newHeight,
        }));
    };

    const handleResizeEnd = () => {
        // İsteğe bağlı
    };

    // Tıklanınca seç
    const handleClick = (e) => {
        e.stopPropagation();
        dispatch(selectItem(item.id));
    };

    // Döndürme
    const handleRotateClick = (event) => {
        event.stopPropagation();
        let newRotation = (item.data.position.rotation || 0) + 90;
        if (newRotation >= 360) newRotation = 0;
        dispatch(updateItemRotation({ id: item.id, newRotation }));
    };

    // Stil hesaplamaları
    const scaledTransform = transform
        ? {
            ...transform,
            x: transform.x * currentScale,
            y: transform.y * currentScale,
        }
        : null;

    const wrapperStyle = {
        position: isOverlay ? 'relative' : 'absolute',
        left: isOverlay ? undefined : `${item.data.position?.x}px`,
        top: isOverlay ? undefined : `${item.data.position?.y}px`,
        width: item.data.size?.width || 100,
        height: item.data.size?.height || 100,
        transformOrigin: "center center",
        transform: `${transform ? CSS.Translate.toString(scaledTransform) + ' ' : ''}`,
        opacity: isDragging ? 0 : 1,
        zIndex: isDragging ? -1 : 'auto',
        borderRadius: item.typeForCss === 'round-table' ? '50%' : '8px',
        backgroundColor: 'red'
    };

    const childIds = item.data.children?.map(child => child.id) || [];

    return (
        <div
            ref={setNodeRef}
            style={wrapperStyle}
            {...listeners}
            {...attributes}
            onClick={handleClick}
            className="shape-wrapper"
        >
            <SortableContext items={childIds} strategy={horizontalListSortingStrategy}>
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        transform: `rotate(${item.data.position.rotation}deg)`,
                        transition: "transform 0.2s ease-in-out",
                        position: 'relative',
                        display: 'flex',
                    }}
                    className={`shape shape-${item.data.typeForCss}`}
                >
                    {/* Özel şekil render (L-shape vs.) */}
                    {item.typeForCss === "l-shape" && (
                        <div style={{
                            position: "absolute",
                            right: 0,
                            top: 0,
                            width: "60%",
                            height: "60%",
                            backgroundColor: "rgba(33, 150, 243, 0.2)",
                        }}></div>
                    )}

                    {/* Çocuk StaticChildItem’ları */}
                    {item.data.children?.map(child => (
                        <StaticChildItem
                            key={child.id}
                            item={child}
                            parentId={item.id}
                        />
                    ))}
                </div>
            </SortableContext>

            {/* Döndürme butonu */}
            {!isDragging && (
                <button
                    onClick={handleRotateClick}
                    aria-label="Döndür"
                    className="rotate-button"
                    style={{
                        position: 'absolute',
                        top: -20,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'lightskyblue',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        zIndex: 10,
                    }}
                >
                    ↻
                </button>
            )}

            {/* Resize handle — sadece container için */}
            {!isDragging && (
                <ResizeHandle
                    itemId={item.id}
                    onResizeStart={handleResizeStart}
                    onResizeMove={handleResizeMove}
                    onResizeEnd={handleResizeEnd}
                />
            )}
        </div>
    );
};

export default ResizableContainerItem;