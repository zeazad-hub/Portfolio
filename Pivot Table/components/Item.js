import React from 'react'
import { useDrag } from 'react-dnd'

function Item(props) {
    const [, drag] = useDrag({
        type: props.type,
        item: {
            type: props.type,
            id: props.id
        },
        end: (item, monitor) => {
            if(monitor.didDrop()) {
                props.dragFunc(item, props.char);
            }
        },
        collect: monitor => ({
            isDragging: !!monitor.isDragging()
          })
    },[]);


    /* const dragIt = e => {
        const target = e.target;

        e.dataTransfer.setData('item_id', target.id);
        e.dataTransfer.setData('item_type', props.type);
        e.dataTransfer.setData('name', props.id);
        
        setTimeout(() => {
            target.style.display = "none";
        }, 0);
    }

    const moveOver = e => {
        e.stopPropagation();
    } */

    return (
        <div
            id={props.id}
            className={props.className}
            ref={drag}
            type={props.type}
            draggable="true"
        >
            { props.children }
        </div>
    )
}

export default Item;
/* export default DragSource([Type.Country, Type.Product], )(Item); */