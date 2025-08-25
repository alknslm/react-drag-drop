// src/components/Canvas.js
import React, {forwardRef} from 'react';
import {useDroppable} from '@dnd-kit/core';
import DraggableCanvasItem from './DraggableCanvasItem';
import '@xyflow/react/dist/style.css';
import './Canvas.css';

// App.js'ten gelen ref'i kullanabilmek için forwardRef kullanıyoruz.
const CanvasDnd = forwardRef(({items, onUpdateRotation, scale}, ref) => {
    const {setNodeRef} = useDroppable({
        id: 'canvas-droppable',
    });


    // Gelen ref'i ve droppable'dan gelen ref'i birleştiriyoruz.
    const combinedRef = (node) => {
        setNodeRef(node);
        if (typeof ref === 'function') {
            ref(node);
        } else if (ref) {
            ref.current = node;
        }
    };

    return (
        <div ref={combinedRef} className="canvas">
            <div
                className="canvas-grid"
                style={{transform: `scale(${scale})`}}
            />
            <div className="canvas-content">
                {items.length === 0 && (
                    <div className="canvas-placeholder">
                        Bileşenleri buraya sürükleyin
                    </div>
                )}
                {/*{items.map(({id, type, position, currentScale, isOverlay, pointerOffset}) => (*/}
                {items.map((item) => (
                    <DraggableCanvasItem
                        key={item.id}
                        id={item.id}
                        type={item.type}
                        position={item.position}
                        currentScale={item.currentScale}
                        onUpdateRotation={onUpdateRotation}
                        isOverlay={item.isOverlay}
                        pointerOffset={item.pointerOffset}
                    />
                ))}
            </div>
        </div>


        // <TransformWrapper initialScale={1}
        //                   minScale={0.5}
        //                   maxScale={7}
        //                   initialPositionX={200}
        //                   initialPositionY={100}>
        //         <Controls/>
        //         <TransformComponent wrapperStyle={{width: "100%", height: "100%",}}
        //                             contentStyle={{width: "100%", height: "100%"}}>
        //
        //
        //         </TransformComponent>
        // </TransformWrapper>

    );
});

export default CanvasDnd;