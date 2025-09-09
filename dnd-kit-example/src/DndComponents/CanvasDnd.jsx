// src/components/Canvas.js
import React, {forwardRef} from 'react';
import {useDroppable} from '@dnd-kit/core';
import DraggableCanvasItem from './DraggableCanvasItem';
import '@xyflow/react/dist/style.css';
import './Canvas.css';
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import Controls from "./Controls.jsx";

// App.js'ten gelen ref'i kullanabilmek için forwardRef kullanıyoruz.
const CanvasDnd = forwardRef(({items, onUpdateRotation, scale, onSelectItem, selectedItemId, setScale}, ref) => {
    const {setNodeRef} = useDroppable({
        id: 'canvas-droppable',
        data: {
            type: 'CANVAS',
            accepts: ['canvas-item'],
        },
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
        <TransformWrapper
            initialScale={1}
            minScale={1}
            maxScale={5}
            panning={{allowRightClickPan: false, allowLeftClickPan: false}}
            onTransformed={({state}) => setScale(state.scale)} // scale her değiştiğinde kaydediyoruz
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
                                    typeForCss={item.typeForCss}
                                    position={item.position}
                                    currentScale={item.currentScale}
                                    accepts={item.accepts}
                                    onUpdateRotation={onUpdateRotation}
                                    isOverlay={item.isOverlay}
                                    pointerOffset={item.pointerOffset}
                                    onSelectItem={onSelectItem} // Tıklama fonksiyonunu iletiyoruz
                                    isSelected={item.id === selectedItemId}
                                    selectedItemId={selectedItemId}// Seçili olup olmadığını iletiyoruz
                                >
                                    {item.children}
                                </DraggableCanvasItem>
                            ))}
                        </div>
                    </div>
                </TransformComponent>

            </>
        </TransformWrapper>


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