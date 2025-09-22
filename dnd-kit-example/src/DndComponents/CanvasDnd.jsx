// src/components/CanvasDnd.jsx
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { useDispatch, useSelector } from "react-redux";
import { setScale } from "./reducers/canvasSlice.jsx";

// Yeni 3 bileşen
import ResizableContainerItem from './canvasComponents/ResizableContainerItem.jsx';
import WallItem from './canvasComponents/ResizableItem.jsx';

import Controls from "./Controls.jsx";
import './Canvas.css';

// forwardRef ile dışarıdan gelen ref'i destekle
const CanvasDnd = React.forwardRef((props, forwardedRef) => {
    const { setNodeRef: setDroppableRef } = useDroppable({
        id: 'canvas-droppable',
        data: {
            type: 'CANVAS',
            accepts: ['canvas-item', 'wall-item'], // Sadece container ve wall canvas'a direkt eklenebilir
        },
    });

    const dispatch = useDispatch();
    const scale = useSelector(state => state.canvas.scale);
    const items = useSelector(state => state.canvas.items);

    // Hem droppable hem forwardRef için
    const combinedRef = (node) => {
        setDroppableRef(node);
        if (typeof forwardedRef === 'function') {
            forwardedRef(node);
        } else if (forwardedRef) {
            forwardedRef.current = node;
        }
    };

    return (
        <TransformWrapper
            initialScale={1}
            minScale={1}
            maxScale={5}
            panning={{ allowRightClickPan: false, allowLeftClickPan: false }}
            onTransformed={({ state }) => dispatch(setScale(state.scale))}
        >
                <>
                    <Controls/>
                    <TransformComponent
                        wrapperStyle={{ width: '100%', height: '100%' }}
                        contentStyle={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <div ref={combinedRef} className="canvas">
                            <div className="canvas-grid"/>
                            <div className="canvas-content">
                                {items.length === 0 && (
                                    <div className="canvas-placeholder">
                                        Bileşenleri buraya sürükleyin
                                    </div>
                                )}

                                {items.map((item) => {
                                    switch (item.data.type) {
                                        case 'canvas-item':
                                            return (
                                                <ResizableContainerItem
                                                    key={item.id}
                                                    item={item}
                                                />
                                            );
                                        case 'wall-item':
                                            return (
                                                <WallItem
                                                    key={item.id}
                                                    item={item}
                                                />
                                            );
                                        // Eğer canvas dışına static child koymak istersen:
                                        // case 'static-child':
                                        //     return (
                                        //         <StaticChildItem
                                        //             key={item.id}
                                        //             item={item}
                                        //         />
                                        //     );
                                        default:
                                            return null;
                                    }
                                })}
                            </div>
                        </div>
                    </TransformComponent>
                </>
        </TransformWrapper>
    );
});

export default CanvasDnd;