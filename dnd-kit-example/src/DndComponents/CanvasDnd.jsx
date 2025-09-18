// src/components/Canvas.js
import React from 'react';
import {useDroppable} from '@dnd-kit/core';
import DraggableCanvasItem from './DraggableCanvasItem';
import '@xyflow/react/dist/style.css';
import './Canvas.css';
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import Controls from "./Controls.jsx";
import {useDispatch, useSelector} from "react-redux";
import {setScale} from "./reducers/canvasSlice.jsx";

// App.js'ten gelen ref'i kullanabilmek için forwardRef kullanıyoruz.
const CanvasDnd = ({ref}) => {
    const {setNodeRef} = useDroppable({
        id: 'canvas-droppable',
        data: {
            type: 'CANVAS',
            accepts: ['canvas-item'],
        },
    });
    const dispatch = useDispatch();
    const scale = useSelector(state => state.canvas.scale);
    const items = useSelector(state => state.canvas.items);


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
        <TransformWrapper
            initialScale={1}
            minScale={1}
            maxScale={5}
            panning={{allowRightClickPan: false, allowLeftClickPan: false}}
            onTransformed={({state}) => dispatch(setScale(state.scale))} // scale her değiştiğinde kaydediyoruz
        >
            <>
                <Controls/>
                <TransformComponent
                    wrapperStyle={{width: '100%', height: '100%'}}
                    contentStyle={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div ref={combinedRef} className="canvas">
                        <div
                            className="canvas-grid"
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
                                    item={item}
                                    accepts={item.accepts}
                                    isOverlay={item.isOverlay}
                                >
                                    {item.children}
                                </DraggableCanvasItem>
                            ))}
                        </div>
                    </div>
                </TransformComponent>

            </>
        </TransformWrapper>
    );
};

export default CanvasDnd;