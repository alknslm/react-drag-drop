// src/App.js
import React, {useRef, useState} from 'react';
import {DndContext, DragOverlay, PointerSensor, useSensor, useSensors,} from '@dnd-kit/core';
import {restrictToWindowEdges} from "@dnd-kit/modifiers";
import {useSelector, useDispatch} from "react-redux";

import './App.css';
import Canvas from './CanvasDnd.jsx';
import Sidebar from './SidebarDnd.jsx';
import {DraggableCanvasItem} from './DraggableCanvasItem'; // <-- Sürükleme önizlemesi için eklendi
import PropertiesPanel from "./PropertiesPanel.jsx";
import {
    addItem,
    updateItemPosition,
    moveChildBetweenItems,
    addChildToItem,
    selectItem,
    sortChildrenInItem
} from "./reducers/canvasSlice.jsx";
import {
    selectItems,
    selectSelectedItem,
    selectScale
} from "./reducers/canvasSlice.jsx";
import {findItemById} from "./utils/commonFunctions.jsx";

function App() {

    const dispatch = useDispatch();
    const canvasItems = useSelector(selectItems);
    const scale = useSelector(selectScale);

    // const [canvasItems, setCanvasItems] = useState([]); // store'a konulacak
    const [activeItem, setActiveItem] = useState(null); // <-- Sürüklenen elemanı tutmak için state eklendi (store'a konulacak)
    // const [selectedItemId, setSelectedItemId] = useState(null); // store'a konulacak
    const canvasRef = useRef(null);
    const gridSize = 10;
    const [initialPointerOffset, setInitialPointerOffset] = useState(null)
    const selectedItem = useSelector(selectSelectedItem);
    const sensors = useSensors(useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }));

    // const findItemById = (items, itemId) => {
    //     for (const item of items) {
    //         if (item.id === itemId) return item;
    //         if (item.children) {
    //             const foundChild = findItemById(item.children, itemId);
    //             if (foundChild) return foundChild;
    //         }
    //     }
    //     return null;
    // };

    const findContainer = (id) => {
        for (const container of canvasItems) {
            if (container.id === id) {
                return container;
            }
            if (container.children.find(item => item.id === id)) {
                return container;
            }
        }
        return null;
    };

    //Üstteki nmethodlar hariç reduxtan gelecek

    // const handleUpdateRotation = (itemId, newRotation) => {
    //     setCanvasItems(currentItems => currentItems.map(
    //         item => {
    //             if(item.id === itemId){
    //                 return{
    //                     ...item,
    //                     position: {
    //                         ...item.position,
    //                         rotation: newRotation,
    //                     }
    //                 }
    //             }
    //             return item;
    //         }
    //     ));
    // }

    // const handleSelectItem = (itemId) => {
    //     setSelectedItemId(itemId);
    // };
    //
    // const handleDeselect = () => {
    //     setSelectedItemId(null);
    // };


    // Sürükleme başladığında çalışır
    const handleDragStart = (event) => {
        const { active, activatorEvent } = event;
        const { isSidebarItem } = active.data.current || {};

        const activeData = active.data.current;

        if (activatorEvent) {
            const newOffset = {
                x: activatorEvent.offsetX,
                y: activatorEvent.offsetY,
            };
            setInitialPointerOffset(newOffset);
        }

        if (isSidebarItem) {
            // Sidebar'dan sürükleniyorsa, tipini al
            setActiveItem({
                id: active.id,
                type: activeData.type,
                isSidebarItem: true,
                typeForCss: activeData.typeForCss,
                position: {
                    // x ve y burada anlamsız, çünkü DragOverlay pozisyonu kendi yönetiyor.
                    // Ama yapısal tutarlılık için eklemek iyidir.
                    x: 0,
                    y: 0,
                    rotation: 0 // <-- EKSİK OLAN VE HATAYI ÇÖZEN ANAHTAR!
                }
            });
        } else {
            const item = findItemById(canvasItems,active.id);

            switch (activeData.type) {
                case 'canvas-item': {
                    const canvasRect = canvasRef.current?.getBoundingClientRect();

                    if (!item || !canvasRect) {
                        // Eğer eleman veya kanvas bulunamazsa, varsayılan ofseti kullan
                        const fallbackOffset = {
                            x: activatorEvent.offsetX,
                            y: activatorEvent.offsetY,
                        };
                        setInitialPointerOffset(fallbackOffset);
                        dispatch(selectItem(item.id));
                        return;
                    }
                    // 2. Elemanın döndürmeden bağımsız, mantıksal sol üst köşesinin
                    //    ekrandaki mutlak (absolute) pozisyonunu hesapla.
                    //    (Kanvasın Pozisyonu) + (Elemanın Kanvas İçi Pozisyonu * Ölçek)
                    const itemAbsoluteX = canvasRect.left + (item.position.x * scale);
                    const itemAbsoluteY = canvasRect.top + (item.position.y * scale);

                    // 3. Farenin mutlak ekran pozisyonunu al.
                    const pointerAbsoluteX = activatorEvent.clientX;
                    const pointerAbsoluteY = activatorEvent.clientY;

                    // 4. İki mutlak pozisyon arasındaki farkı bularak doğru ofseti hesapla.
                    //    Bu hesaplama, elemanın `transform: rotate()` özelliğinden etkilenmez.
                    const newOffset = {
                        x: pointerAbsoluteX - itemAbsoluteX,
                        y: pointerAbsoluteY - itemAbsoluteY,
                    };

                    // 5. Hesaplanan yeni ofseti ve aktif elemanı state'e kaydet.
                    setInitialPointerOffset(newOffset);
                    setActiveItem(item);
                    break;
                }
            }
        }
    };

    const handleDragEnd = (event) => {
        const { active, over, delta } = event;
        setActiveItem(null); // Sürükleme bitince aktif elemanı temizle

        if (!over) {
            return;
        }

        // 2. Adım: Canvas'ın pozisyonunu ve boyutlarını al
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        const activeData = active.data.current;
        const overData = over.data.current;

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

        const activeContainer = findContainer(activeData.parentId);
        const overContainer = findContainer(over.id);

        if (activeData?.isSidebarItem) {
            if (overData?.accepts?.includes(activeData.type)) {
                if (overData.type === 'CANVAS') {
                    const newItem = {
                        id: `${activeData.type}-${Date.now()}`,
                        type: activeData.type,
                        accepts: ['table-items'],
                        typeForCss: activeData.typeForCss,
                        position: {
                            x: snappedX,
                            y: snappedY,
                            rotation: 0,
                        },
                        children: [],
                    };
                    dispatch(addItem(newItem));
                }
            }

            if (overData.type === 'canvas-item' && activeData.type === 'table-items') {
                //addChildToItem-> sidebardan gelmiş hedef canvas-item, taşınan table-items
                const child = {
                    id: `${activeData.type}-${Date.now()}`,
                    type: activeData.type,
                    typeForCss: activeData.typeForCss,
                }
                dispatch(addChildToItem({parentId: over.id, child: child}));
            }
        } else {
                if (activeContainer && overContainer) {
                    // Senaryo 2: Aynı konteyner içinde sıralama
                    if (activeContainer.id === overContainer.id) {
                        //sortChildrenInItem
                        const container = canvasItems.find(c => c.id === activeContainer.id);
                        if(container && container.children) {
                            const oldIndex = container.children.findIndex(item => item.id === active.id);
                            const newIndex = container.children.findIndex(item => item.id === over.id);

                            if(oldIndex !== -1 && newIndex !== -1){
                                dispatch(sortChildrenInItem({
                                    parentId: activeContainer.id,
                                    oldIndex: oldIndex,
                                    newIndex: newIndex
                                }))
                            }
                        }
                    }
                    // Senaryo 3: Konteynerlar arası taşıma
                    else {
                        //movechildBetweenItems
                        const destContainerIndex = canvasItems.findIndex(c => c.id === overContainer.id);

                        dispatch(moveChildBetweenItems({sourceParentId:activeContainer.id , destParentId: overContainer.id, itemToMoveId: active.id, destIndex:destContainerIndex}))
                    }
                } else {
                    //updateItemPosition
                    const newPosition = {
                        x: snappedX,
                        y: snappedY,
                    }
                    dispatch(updateItemPosition({id: active.id, newPosition: newPosition}));
                }
        }
        setInitialPointerOffset(null); // Sürükleme bitince tutma noktasını sıfırla
    };

    // Sürükleme iptal edilirse de aktif elemanı temizle
    const handleDragCancel = () => {
        setActiveItem(null);
    };


    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}>

            <div className="app-container">
                <Sidebar/>
                <Canvas ref={canvasRef}/>

                {selectedItem && (
                    <PropertiesPanel/>
                )}
            </div>

            {/* DragOverlay, sürüklenen elemanı en üste taşır */}
            <DragOverlay modifiers={[ restrictToWindowEdges]}>
                {activeItem && initialPointerOffset ? (
                    <div style={{transform: `scale(${scale})`}}>
                        <DraggableCanvasItem
                            item={activeItem}
                            isOverlay={true}
                            pointerOffset={initialPointerOffset}
                        />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

export default App;