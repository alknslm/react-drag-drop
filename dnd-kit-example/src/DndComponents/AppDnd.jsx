// src/App.js
import React, {useRef, useState} from 'react';
import {DndContext, DragOverlay, PointerSensor, useSensor, useSensors,} from '@dnd-kit/core';

import Canvas from './CanvasDnd.jsx';
import Sidebar from './SidebarDnd.jsx';
import {DraggableCanvasItem} from './DraggableCanvasItem'; // <-- Sürükleme önizlemesi için eklendi
import './App.css';
import {restrictToWindowEdges} from "@dnd-kit/modifiers";
import {arrayMove} from "@dnd-kit/sortable";
import PropertiesPanel from "./PropertiesPanel.jsx";

function App() {
    const [canvasItems, setCanvasItems] = useState([]); // store'a konulacak
    const [activeItem, setActiveItem] = useState(null); // <-- Sürüklenen elemanı tutmak için state eklendi (store'a konulacak)
    const [selectedItemId, setSelectedItemId] = useState(null); // store'a konulacak
    const canvasRef = useRef(null);
    const gridSize = 10;
    const [scale, setScale] = useState(1); // store'a konulacak
    const [initialPointerOffset, setInitialPointerOffset] = useState(null);

    const sensors = useSensors(useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }));

    const findItemById = (items, itemId) => {
        for (const item of items) {
            if (item.id === itemId) return item;
            if (item.children) {
                const foundChild = findItemById(item.children, itemId);
                if (foundChild) return foundChild;
            }
        }
        return null;
    };

    const selectedItem = findItemById(canvasItems,selectedItemId);

    const handleSelectItem = (itemId) => {
        setSelectedItemId(itemId);
    };

    const handleDeselect = () => {
        setSelectedItemId(null);
    };

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
            // Kanvastan sürükleniyorsa, tam elemanı bul
            const item = canvasItems.find((i) => i.id === active.id);
            const canvasRect = canvasRef.current?.getBoundingClientRect();

            if (!item || !canvasRect) {
                // Eğer eleman veya kanvas bulunamazsa, varsayılan ofseti kullan
                const fallbackOffset = {
                    x: activatorEvent.offsetX,
                    y: activatorEvent.offsetY,
                };
                setInitialPointerOffset(fallbackOffset);
                setActiveItem(item);
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
                    setCanvasItems((items) => [
                        ...items,
                        {
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
                            pointerOffset: initialPointerOffset,
                        },
                    ]);
                }
            }

            if (overData.type === 'canvas-item' && activeData.type === 'table-items') {
                setCanvasItems(items => items.map(item => {
                    if (item.id === over.id) {
                        return {
                            ...item,
                            children: [
                                ...item.children,
                                { id: `${activeData.type}-${Date.now()}`, type: activeData.type, typeForCss : activeData.typeForCss },
                            ],
                        };
                    }
                    return item;
                }));
            }
        } else {
            if (activeContainer && overContainer) {
                // Senaryo 2: Aynı konteyner içinde sıralama
                if (activeContainer.id === overContainer.id) {
                    setCanvasItems(prev => {
                        const newItems = [...prev];
                        const containerIndex = newItems.findIndex(c => c.id === activeContainer.id);
                        if(containerIndex !== -1) {
                            const oldIndex = newItems[containerIndex].children.findIndex(item => item.id === active.id);
                            const newIndex = newItems[containerIndex].children.findIndex(item => item.id === over.id);
                            // Bırakılan yer bir öğe değil de konteynerın kendisi ise sona ekle
                            if (newIndex !== -1) {
                                newItems[containerIndex].children = arrayMove(newItems[containerIndex].children, oldIndex, newIndex);
                            }
                        }
                        return newItems;
                    });
                }
                // Senaryo 3: Konteynerlar arası taşıma
                else {
                    setCanvasItems(prev => {
                        const newItems = [...prev];
                        const sourceContainerIndex = newItems.findIndex(c => c.id === activeContainer.id);
                        const destContainerIndex = newItems.findIndex(c => c.id === overContainer.id);

                        if (sourceContainerIndex !== -1 && destContainerIndex !== -1) {
                            const sourceChildren = newItems[sourceContainerIndex].children;
                            const destChildren = newItems[destContainerIndex].children;

                            const itemIndex = sourceChildren.findIndex(item => item.id === active.id);
                            const [movedItem] = sourceChildren.splice(itemIndex, 1);

                            // Bırakılan yer bir öğenin üstü mü yoksa konteynerın kendisi mi?
                            const overItemIndex = destChildren.findIndex(item => item.id === over.id);
                            if (overItemIndex !== -1) {
                                destChildren.splice(overItemIndex, 0, movedItem);
                            } else {
                                destChildren.push(movedItem); // Konteyner boşsa veya sona bırakıldıysa
                            }
                        }
                        return newItems;
                    });
                }
            }
            else{
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


    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}>

            <div className="app-container">
                <Sidebar/>
                <Canvas ref={canvasRef}
                        items={canvasItems}
                        onUpdateRotation={handleUpdateRotation}
                        selectedItemId={selectedItemId}
                        onSelectItem={handleSelectItem}
                        setScale={setScale}/>

                {selectedItem && (
                    <PropertiesPanel
                        item={selectedItem}
                        onClose={handleDeselect}
                    />
                )}
            </div>

            {/* DragOverlay, sürüklenen elemanı en üste taşır */}
            <DragOverlay modifiers={[ restrictToWindowEdges]}>
                {activeItem && initialPointerOffset ? (
                    <DraggableCanvasItem
                        id={activeItem.id}
                        type={activeItem.type}
                        typeForCss={activeItem.typeForCss}
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