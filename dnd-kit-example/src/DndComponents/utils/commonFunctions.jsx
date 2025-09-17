export const findItemById = (items, itemId) => {
    if (!itemId || !items) return null;

    for (const item of items) {
        if (item.id === itemId) {
            return item;
        }
        // Özyinelemeli çağrıyı, çocuk dizisi ile doğru şekilde yapar.
        if (item.children && item.children.length > 0) {
            const foundChild = findItemById(item.children, itemId);
            if (foundChild) {
                return foundChild;
            }
        }
    }
    return null;
};