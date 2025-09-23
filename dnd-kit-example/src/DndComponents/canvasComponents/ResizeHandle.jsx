// src/components/canvas/ResizeHandle.jsx
import React, { useEffect, useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useSelector } from 'react-redux';

const ResizeHandle = ({ itemId, onResizeStart, onResizeMove, onResizeEnd }) => {
    const currentScale = useSelector((state) => state.canvas.scale);

    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `resize-${itemId}`,
        data: {
            type: 'resize',
            itemId,
        },
    });

    const isResizing = useRef(false);
    const startPosition = useRef({ x: 0, y: 0 });
    const hasStarted = useRef(false); // 🆕 Start'ın sadece bir kere çağrılması için

    useEffect(() => {
        if (!isDragging) {
            isResizing.current = false;
            hasStarted.current = false; // Reset
            return;
        }

        const handleMouseMove = (event) => {
            if (!isResizing.current) return;

            // 🆕 Sadece ilk seferde start çağrılsın
            if (!hasStarted.current) {
                hasStarted.current = true;
                startPosition.current = {
                    x: event.clientX,
                    y: event.clientY
                };
                onResizeStart?.(event);
                return; // İlk hareketi atla
            }

            // Toplam delta hesapla (ilk pozisyona göre)
            const totalDeltaX = (event.clientX - startPosition.current.x) / currentScale;
            const totalDeltaY = (event.clientY - startPosition.current.y) / currentScale;

            onResizeMove?.({
                ...event,
                deltaX: totalDeltaX,
                deltaY: totalDeltaY,
            });
        };

        const handleMouseUp = () => {
            isResizing.current = false;
            hasStarted.current = false;
            onResizeEnd?.();
        };

        // Dragging başladığında
        if (!hasStarted.current) {
            isResizing.current = true;
        }

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, onResizeStart, onResizeMove, onResizeEnd, currentScale]);

    return (
        <div
            ref={setNodeRef}
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