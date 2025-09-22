// src/components/canvas/ResizeHandle.jsx
import React, { useEffect, useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useDispatch, useSelector } from 'react-redux';

const ResizeHandle = ({ itemId, onResizeStart, onResizeMove, onResizeEnd }) => {
    const dispatch = useDispatch();
    const currentScale = useSelector((state) => state.canvas.scale);

    const {attributes, listeners, setNodeRef, isDragging} = useDraggable({
        id: `resize-${itemId}`,
        data: {
            type: 'resize',
            itemId,
        },
    });

    const handleRef = useRef(null);
    const startPositionRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (event) => {
            event.stopPropagation();
            // 🚨 HATA BURADAYDI: event.clientX'e göre değil, handle'ın pozisyonuna göre hesapla
            const handleRect = handleRef.current?.getBoundingClientRect();
            if (!handleRect) return;

            const deltaX = (event.clientX - startPositionRef.current.x) / currentScale;
            const deltaY = (event.clientY - startPositionRef.current.y) / currentScale;

            onResizeMove && onResizeMove({
                ...event,
                deltaX,
                deltaY,
            });
        };

        const handleMouseUp = () => {
            onResizeEnd && onResizeEnd();
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        const handleMouseDown = (event) => {
            console.log("çlaıştı")
            event.stopPropagation();
            const handleRect = handleRef.current?.getBoundingClientRect();
            if (handleRect) {
                // 🚨 HATA BURADAYDI: event.clientX/Y yerine handle'ın pozisyonunu baz al
                startPositionRef.current = {
                    x: handleRect.left + handleRect.width / 2, // Merkez noktası
                    y: handleRect.top + handleRect.height / 2,
                };
            } else {
                // Yedek: handleRect yoksa event'i kullan (nadiren gerekir)
                startPositionRef.current = { x: event.clientX, y: event.clientY };
            }
            onResizeStart && onResizeStart(event);
        };

        const node = handleRef.current;
        if (node) {
            node.addEventListener('mousedown', handleMouseDown, { once: true });
        }

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            if (node) {
                node.removeEventListener('mousedown', handleMouseDown);
            }
        };
    }, [isDragging, onResizeStart, onResizeMove, onResizeEnd, currentScale]);

    // 🚨 setNodeRef'i handleRef ile birleştir
    const combinedRef = (node) => {
        setNodeRef(node);
        handleRef.current = node;
    };

    return (
        <div
            ref={combinedRef} // 👈 handleRef burada atanıyor
            {...listeners}
            {...attributes}
            style={{
                position: 'absolute',
                bottom: -5,
                right: -5,
                width: 12,
                height: 12,
                backgroundColor: isDragging ? '#ff5555' : '#555',
                borderRadius: '50%',
                cursor: 'nwse-resize',
                zIndex: 10,
            }}
        />
    );
};

export default ResizeHandle;