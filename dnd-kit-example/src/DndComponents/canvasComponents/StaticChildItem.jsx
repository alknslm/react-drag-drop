//resize yok - child componenti

// src/components/canvas/StaticChildItem.jsx
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useDispatch } from 'react-redux';
import { selectItem } from '../reducers/canvasSlice.jsx';

const StaticChildItem = ({ item, parentId }) => {
    const dispatch = useDispatch();

    const {attributes, listeners, setNodeRef, isDragging} = useDraggable({
        id: item.id,
        data: {
            type: item.data.type,
            parentId: parentId,
        }
    });

    const handleClick = (e) => {
        e.stopPropagation();
        dispatch(selectItem(item.id));
    };


    const style = {
        width: item.size?.width || 30,
        height: item.size?.height || 30,
        backgroundColor: '#ff9800',
        margin: '2px',
        cursor: 'grab',
        borderRadius: '4px',
        opacity: isDragging ? 0.7 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '10px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    };

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onClick={handleClick}
            className={`shape shape-${item.data.typeForCss}`}
        >
            {item.typeForCss?.substring(0, 1).toUpperCase()}
        </div>
    );
};

export default StaticChildItem;