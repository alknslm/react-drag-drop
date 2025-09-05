import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

export const TableItem  =  ({id , typeForCss, content, parentId}) => {
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

    const clickTableItems = () =>{
        console.log("Tıklandı");
    }

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
            className={`shape shape-${typeForCss}`}
            onClick={clickTableItems}
        >
            {content}
        </div>
    );
};

export default TableItem;