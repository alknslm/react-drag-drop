// src/components/canvas/WallItem.jsx
import React, { useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useDispatch, useSelector } from "react-redux";
import ResizeHandle from "./ResizeHandle.jsx";
import {
    selectItem,
    updateItemSize,
    updateItemRotation
} from "../reducers/canvasSlice.jsx"; // <-- updateItemRotation eklendi

const WallItem = ({ item, isOverlay = false }) => {
    const dispatch = useDispatch();
    const currentScale = useSelector((state) => state.canvas.scale);

    const initialSize = useRef({ width: item.data.size?.width || 100, height: item.data.size?.height || 20 });
    const startPosition = useRef({ x: 0, y: 0 });

    // Sadece sürüklenebilir — içine çocuk alamaz
    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id: item.id,
        data: {
            type: item.data.type,
            isWall: true,
        }
    });

    // Resize işlemleri
    const handleResizeStart = (event) => {
        startPosition.current = { x: event.clientX, y: event.clientY };
        initialSize.current = { width: item.data.size?.width || 100, height: item.data.size?.height || 20 };
    };

    const handleResizeMove = (event) => {
        const deltaX = event.deltaX; // ZATEN scale'e göre normalize edilmiş!
        const deltaY = event.deltaY;

        const newWidth = Math.max(50, initialSize.current.width + deltaX);
        const newHeight = Math.max(10, initialSize.current.height + deltaY);

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

    // Döndürme işlemi
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
        height: item.data.size?.height || 20,
        transformOrigin: "center center",
        transform: `${transform ? CSS.Translate.toString(scaledTransform) + ' ' : ''}`,
        opacity: isDragging ? 0 : 1,
        zIndex: isDragging ? -1 : 'auto',
        backgroundColor: '#795548',
        borderRadius: '4px',
        border: '1px solid #5d4037',
        cursor: 'move',
    };

    return (
        <div
            ref={setNodeRef}
            style={wrapperStyle}
            {...listeners}
            {...attributes}
            onClick={handleClick}
            className="wall-item"
        >
            {/* İçerik — dönme transform'u burada uygulanmalı */}
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    transform: `rotate(${item.data.position.rotation || 0}deg)`,
                    transformOrigin: 'center',
                    transition: 'transform 0.2s ease-in-out',
                }}
            >
                🧱 {item.typeForCss}
            </div>

            {/* Döndürme butonu — sadece sürüklenmiyorken görünsün */}
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

            {/* Resize handle — sadece duvar için */}
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

export default WallItem;