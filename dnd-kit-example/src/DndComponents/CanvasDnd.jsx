// src/components/Canvas.js
import React, {forwardRef} from 'react';
import {useDroppable} from '@dnd-kit/core';
import DraggableCanvasItem from './DraggableCanvasItem';
import '@xyflow/react/dist/style.css';
import './Canvas.css';

// App.js'ten gelen ref'i kullanabilmek için forwardRef kullanıyoruz.
const CanvasDnd = forwardRef(({items}, ref) => {
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
            {items.length === 0 && (
                <div className="canvas-placeholder">
                    Bileşenleri buraya sürükleyin
                </div>
            )}
            {items.map(({id, type, position, currentScale, pointerOffset}) => (
                <DraggableCanvasItem
                    key={id}
                    id={id}
                    type={type}
                    position={position}
                    currentScale={currentScale}
                    pointerOffset={pointerOffset}
                />
            ))}
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