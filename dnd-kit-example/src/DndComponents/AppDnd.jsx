// src/App.js
import React, {useRef, useState} from 'react';
import {DndContext, DragOverlay, PointerSensor, useSensor, useSensors,} from '@dnd-kit/core';
import uuid from 'react-uuid';

import Canvas from './CanvasDnd.jsx';
import Sidebar from './SidebarDnd.jsx';
import {DraggableCanvasItem} from './DraggableCanvasItem'; // <-- Sürükleme önizlemesi için eklendi
import './App.css';
import {restrictToWindowEdges} from "@dnd-kit/modifiers";
import {TransformComponent, TransformWrapper, useControls} from "react-zoom-pan-pinch";
import {Controls} from "@xyflow/react";

function App() {
    const [canvasItems, setCanvasItems] = useState([]);
    const [activeItem, setActiveItem] = useState(null); // <-- Sürüklenen elemanı tutmak için state eklendi
    const canvasRef = useRef(null);
    const gridSize = 25;
    const [scale, setScale] = useState(1);
    const [initialPointerOffset, setInitialPointerOffset] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // Sürükleme başladığında çalışır
    const handleDragStart = (event) => {
        const { active, activatorEvent } = event;
        const { isSidebarItem } = active.data.current || {};

        if (activatorEvent) {
            const newOffset = {
                x: activatorEvent.offsetX,
                y: activatorEvent.offsetY,
            };
            setInitialPointerOffset(newOffset);
        }

        if (isSidebarItem) {
            // Sidebar'dan sürükleniyorsa, tipini al
            // setActiveItem({ id: active.id, type: active.id, isSidebarItem: true });
            setActiveItem({
                id: active.id,
                type: active.id,
                isSidebarItem: true,
                position: {
                    // x ve y burada anlamsız, çünkü DragOverlay pozisyonu kendi yönetiyor.
                    // Ama yapısal tutarlılık için eklemek iyidir.
                    x: 0,
                    y: 0,
                    rotation: 0 // <-- EKSİK OLAN VE HATAYI ÇÖZEN ANAHTAR!
                }
            });
        } else {
            // Kanvastan sürükleniyorsa, tam elemanı bul
            const item = canvasItems.find((i) => i.id === active.id);
            setActiveItem(item);
        }
    };

    const handleDragEnd = (event) => {
        const { active, over, delta } = event;
        setActiveItem(null); // Sürükleme bitince aktif elemanı temizle

        if (!over || over.id !== 'canvas-droppable') {
            return;
        }

        // 2. Adım: Canvas'ın pozisyonunu ve boyutlarını al
        const canvasRect = canvasRef.current?.getBoundingClientRect();

        // ÖNEMLİ: Bırakma anındaki Farenin MUTLAK Konumu
        // dnd-kit'te bu bilgi doğrudan event objesinde gelmez.
        // Genellikle başlangıç pozisyonu + delta ile bulunur.
        // active.rect.current.initial gibi bir yerden başlangıç pozisyonunu alabilirsiniz.
        // Varsayılan olarak sürüklenen elemanın başlangıçtaki sol üst köşesini alalım.
        const dragStartRect = active.rect.current.initial;
        if (!dragStartRect) return;

        const dropX_absolute = dragStartRect.left + delta.x;
        const dropY_absolute = dragStartRect.top + delta.y;

        // 3. Adım: Canvas'a göre GÖRECELİ konumu hesapla
        const newItemX = (dropX_absolute - canvasRect.left) / scale;
        const newItemY = (dropY_absolute - canvasRect.top) / scale;

        const snappedX = Math.round(newItemX / gridSize) * gridSize;
        const snappedY = Math.round(newItemY / gridSize) * gridSize;

        const isSidebarItem = active.data.current?.isSidebarItem;

        if (isSidebarItem) {
            setCanvasItems((items) => [
                ...items,
                {
                    id: uuid(),
                    type: active.id,
                    position: {
                        x: snappedX,
                        y: snappedY,
                        rotation : 0,
                    },
                    pointerOffset: initialPointerOffset,
                },
            ]);
        } else {
            setCanvasItems((items) =>
                items.map((item) => {
                    if (item.id === active.id) {
                        return {
                            ...item,
                            position: {
                                ...item.position,
                                x: snappedX,
                                y: snappedY}
                            ,
                            pointerOffset: initialPointerOffset,
                        };
                    }
                    return item;
                })
            );
        }
        setInitialPointerOffset(null); // Sürükleme bitince tutma noktasını sıfırla
    };

    // Sürükleme iptal edilirse de aktif elemanı temizle
    const handleDragCancel = () => {
        setActiveItem(null);
    };

    const handleUpdateRotation = (itemId, newRotation) => {
            setCanvasItems(currentItems => currentItems.map(
                item => {
                    if(item.id === itemId){
                        return{
                            ...item,
                            position: {
                                ...item.position,
                                rotation: newRotation,
                            }
                        }
                    }
                    return item;
                }
            ));
    }
    const Controls = () => {
        const {zoomIn, zoomOut, resetTransform} = useControls();
        const buttonStyle = {
            margin: '5px',
            padding: '10px 15px',
            fontSize: '16px',
            cursor: 'pointer'
        };

        return (
            <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
                <button style={buttonStyle} onClick={() => zoomIn()}>Zoom In</button>
                <button style={buttonStyle} onClick={() => zoomOut()}>Zoom Out</button>
                <button style={buttonStyle} onClick={() => resetTransform()}>Reset</button>
            </div>
        );
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <div className="app-container">
                <Sidebar/>
                <TransformWrapper
                    initialScale={1}
                    minScale={0.2}
                    maxScale={5}
                    panning={{disabled: true}}
                    onTransformed={({ state }) => setScale(state.scale)} // scale her değiştiğinde kaydediyoruz
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
                            <Canvas ref={canvasRef} items={canvasItems} onUpdateRotation={handleUpdateRotation}/>
                        </TransformComponent>
                    </>
                </TransformWrapper>
            </div>

            {/* DragOverlay, sürüklenen elemanı en üste taşır */}
            <DragOverlay modifiers={[ restrictToWindowEdges]}>
                {activeItem && initialPointerOffset ? (
                    <DraggableCanvasItem
                        id={activeItem.id}
                        type={activeItem.type}
                        position={activeItem.position} // Overlay pozisyonu kendisi ayarlar
                        isOverlay={true}
                        currentScale={scale}
                        pointerOffset={initialPointerOffset}
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

export default App;