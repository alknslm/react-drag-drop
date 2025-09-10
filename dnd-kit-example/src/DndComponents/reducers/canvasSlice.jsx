import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    selectedItemId: null,
    scale: 1
}

const canvasSlice = createSlice({
    name: 'canvas',
    initialState,
    reducers:{
        addItem: (state, action) => {
            state.items.push(action.payload);
        },
        updateItemPosition: (state, action) => {
            const { id, newPosition } = action.payload;
            const item = state.items.find(i => i.id === id);
            if (item) {
                item.position.x = newPosition.x;
                item.position.y = newPosition.y;
            }
        },
        updateItemRotation: (state, action) => {
            const { id, newRotation } = action.payload;
            const item = state.items.find(i => i.id === id);
            if (item) {
                item.position.rotation = newRotation;
            }
        },
        addChildToItem: (state, action) => {
            const { parentId, child } = action.payload;
            const parentItem = state.items.find(i => i.id === parentId);
            if (parentItem) {
                if (!parentItem.children) {
                    parentItem.children = [];
                }
                parentItem.children.push(child);
            }
        },
        moveChildBetweenItems: (state, action) => {
            const { sourceParentId, destParentId, itemToMoveId, destIndex } = action.payload;
            const sourceParent = state.items.find(i => i.id === sourceParentId);
            const destParent = state.items.find(i => i.id === destParentId);

            if(sourceParent && destParent) {
                const itemIndex = sourceParent.children.findIndex(child => child.id === itemToMoveId);
                const [movedItem] = sourceParent.children.splice(itemIndex, 1);
                destParent.children.splice(destIndex, 0, movedItem);
            }
        },
        selectItem: (state, action) => {
            state.selectedItemId = action.payload;
        },
        deselectItem: (state) => {
            state.selectedItemId = null;
        },
        setScale: (state, action) => {
            state.scale = action.payload;
        },
    }
});

export const {
    addItem, updateItemPosition, updateItemRotation, addChildToItem,
    selectItem, deselectItem, setScale, moveChildBetweenItems
} = canvasSlice.actions;

export default canvasSlice.reducer;