import { restrictToWindowEdges } from '@dnd-kit/modifiers';

export const createSnapToGridModifier = (gridSize) => {
    return (transform) => {
        const newTransform = {
            ...transform,
            x: Math.round(transform.x / gridSize) * gridSize,
            y: Math.round(transform.y / gridSize) * gridSize,
        };
        return newTransform;
    };
};