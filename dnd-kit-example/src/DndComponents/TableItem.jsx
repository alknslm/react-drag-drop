import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

export const TableItem  =  ({id , typeForCss, content, parentId,onSelectItem}) => {
    const { attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging } = useSortable({
            id: id,
            data: {
                type: 'table-items',
                parentId: parentId
            }
        });

    const style ={
        transform: CSS.Transform.toString(transform),
        transition: transition,
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
    }

    const handleItemClick = (e) => {
        // 1. Olayın üst component'lere (DraggableCanvasItem'a) yayılmasını engelle.
        // BU ADIM ÇOK KRİTİK!
        e.stopPropagation();

        // 2. App.js'teki state'i güncellemek için kendi ID'n ile onSelectItem'ı çağır.
        onSelectItem(id);
    };

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
            className={`shape shape-${typeForCss}`}
            onClick={handleItemClick}
        >
            {content}
        </div>
    );
};

export default TableItem;