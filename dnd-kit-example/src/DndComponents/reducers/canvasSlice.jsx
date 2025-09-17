import { createSlice } from '@reduxjs/toolkit';
import { arrayMove } from "@dnd-kit/sortable";

const findItemRecursive = (items, itemId) => {
    if (!itemId || !items) return null;
    for (const item of items) {
        if (item.id === itemId) return item;
        if (item.children && item.children.length > 0) {
            const foundChild = findItemRecursive(item.children, itemId);
            if (foundChild) return foundChild;
        }
    }
    return null;
};

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
        sortChildrenInItem: (state, action) => {
            const { parentId, oldIndex, newIndex } = action.payload;
            const parentItem = state.items.find(i => i.id === parentId);
            if (parentItem) {
                parentItem.children = arrayMove(parentItem.children, oldIndex, newIndex);
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
    },
    // -------- SELECTORLAR-----------
    selectors: {
        // Basit bir selector: sadece state'in bir parçasını döndürür
        selectItems: (state) => state.items,
        selectSelectedItemId: (state) => state.selectedItemId,
        selectScale: (state) => state.scale,

        // Parametre alan daha karmaşık bir selector
        // Bu selector, slice'ın state'ini (`state`) ve ek bir parametreyi (`itemId`) alır.
        selectItemById: (state, itemId) => {
            // Yukarıda tanımladığımız yardımcı özyinelemeli fonksiyonu kullanıyoruz.
            return findItemRecursive(state.items, itemId);
        },

        // Türetilmiş veri için başka bir örnek: seçili olan item'ı doğrudan döndüren selector
        selectSelectedItem: (state) => {
            // Diğer selector'ları veya yardımcı fonksiyonları burada kullanabiliriz.
            return findItemRecursive(state.items, state.selectedItemId);
        }
    }
});

export const {
    addItem, updateItemPosition,
    updateItemRotation, addChildToItem,
    selectItem, deselectItem,
    setScale, moveChildBetweenItems,
    sortChildrenInItem
} = canvasSlice.actions;

export const {
    selectItems,
    selectSelectedItemId,
    selectScale,
    selectItemById,
    selectSelectedItem
} = canvasSlice.selectors;

export default canvasSlice.reducer;