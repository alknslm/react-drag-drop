// src/App.js
import React, { useRef, useState } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { useSelector, useDispatch } from "react-redux";

import './App.css';
import Canvas from './CanvasDnd.jsx';
import Sidebar from './SidebarDnd.jsx';
import PropertiesPanel from "./PropertiesPanel.jsx";

import ResizableContainerItem from './canvasComponents/ResizableContainerItem.jsx';
import WallItem from './canvasComponents/ResizableItem.jsx';
import StaticChildItem from './canvasComponents/StaticChildItem.jsx';

import {
    addItem,
    updateItemPosition,
    moveChildBetweenItems,
    addChildToItem,
    selectItem,
    sortChildrenInItem
} from "./reducers/canvasSlice.jsx";

import { selectItems, selectSelectedItem, selectScale } from "./reducers/canvasSlice.jsx";
import { findItemById } from "./utils/commonFunctions.jsx";

function App() {
    const dispatch = useDispatch();
    const canvasItems = useSelector(selectItems);
    const scale = useSelector(selectScale);
    const selectedItem = useSelector(selectSelectedItem);

    const [activeItem, setActiveItem] = useState(null);
    const canvasRef = useRef(null);
    const gridSize = 10;
    const [initialPointerOffset, setInitialPointerOffset] = useState(null);

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: { distance: 8 },
    }));

    const findContainer = (id) => {
        for (const container of canvasItems) {
            if (container.id === id) return container;
            if (container.children?.find(item => item.id === id)) return container;
        }
        return null;
    };

    const handleDragStart = (event) => {
        const { active, activatorEvent } = event;
        const { isSidebarItem } = active.data.current || {};

        if (activatorEvent) {
            setInitialPointerOffset({
                x: activatorEvent.offsetX,
                y: activatorEvent.offsetY,
            });
        }

        if (isSidebarItem) {
            const activeData = active.data.current;
            setActiveItem({
                id: active.id,
                data:{
                    type: activeData.type,
                    typeForCss: activeData.typeForCss,
                    size: { width: 100, height: 100 },
                    position: { x: 0, y: 0, rotation: 0 },
                    children: [],
                }
            });
        } else {
            const item = findItemById(canvasItems, active.id);
            if (item) {
                setActiveItem(item);
            }
        }
    };

    const handleDragEnd = (event) => {
        const { active, over, delta } = event;
        setActiveItem(null);

        if (!over) return;

        const canvasRect = canvasRef.current?.getBoundingClientRect();
        if (!canvasRect) return;

        const dragStartRect = active.rect.current.initial;
        if (!dragStartRect) return;

        const dropX_absolute = dragStartRect.left + delta.x;
        const dropY_absolute = dragStartRect.top + delta.y;

        const newItemX = (dropX_absolute - canvasRect.left) / scale;
        const newItemY = (dropY_absolute - canvasRect.top) / scale;

        const snappedX = Math.round(newItemX / gridSize) * gridSize;
        const snappedY = Math.round(newItemY / gridSize) * gridSize;

        const activeData = active.data.current;
        const overData = over.data.current;

        if (activeData?.isSidebarItem) {
            if (overData?.accepts?.includes(activeData.type)) {
                if (overData.type === 'CANVAS') {
                    const newItem = {
                        id: `${activeData.type}-${Date.now()}`,
                        data:{
                            type: activeData.type,
                            typeForCss: activeData.typeForCss,
                            size: { width: 100, height: 100 },
                            position: { x: snappedX, y: snappedY, rotation: 0 },
                            children: activeData.type === 'canvas-item' ? [] : undefined,
                        }
                    };
                    dispatch(addItem(newItem));
                }
            }

            if (overData.type === 'canvas-item' && activeData.type === 'static-child') {
                const child = {
                    id: `${activeData.type}-${Date.now()}`,
                    data:{
                        type: activeData.type,
                        typeForCss: activeData.typeForCss,
                        size: { width: 30, height: 30 },
                    }
                };
                dispatch(addChildToItem({ parentId: over.id, child }));
            }
        } else {
            const activeContainer = findContainer(activeData.parentId);
            const overContainer = findContainer(over.id);

            if (activeContainer && overContainer && activeContainer.id === overContainer.id) {
                const container = canvasItems.find(c => c.id === activeContainer.id);
                if (container && container.data.children) {
                    const oldIndex = container.data.children.findIndex(item => item.id === active.id);
                    const newIndex = container.data.children.findIndex(item => item.id === over.id);
                    if (oldIndex !== -1 && newIndex !== -1) {
                        dispatch(sortChildrenInItem({
                            parentId: activeContainer.id,
                            oldIndex,
                            newIndex
                        }));
                    }
                }
            } else if (activeContainer && overContainer) {
                dispatch(moveChildBetweenItems({
                    sourceParentId: activeContainer.id,
                    destParentId: overContainer.id,
                    itemToMoveId: active.id,
                    destIndex: 0,
                }));
            } else {
                dispatch(updateItemPosition({
                    id: active.id,
                    newPosition: { x: snappedX, y: snappedY }
                }));
            }
        }

        setInitialPointerOffset(null);
    };

    const handleDragCancel = () => {
        setActiveItem(null);
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <div className="app-container">
                <Sidebar />
                <Canvas ref={canvasRef} />
                {selectedItem && <PropertiesPanel />}
            </div>

            <DragOverlay modifiers={[restrictToWindowEdges]}>
                {activeItem && initialPointerOffset ? (
                    <div style={{ transform: `scale(${scale})` }}>
                        {activeItem.data.type === 'canvas-item' && (
                            <ResizableContainerItem item={activeItem} isOverlay={true} />
                        )}
                        {activeItem.data.type === 'wall-item' && (
                            <WallItem item={activeItem} isOverlay={true} />
                        )}
                        {activeItem.data.type === 'static-child' && (
                            <StaticChildItem item={activeItem} />
                        )}
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

export default App;