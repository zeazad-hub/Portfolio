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
    }, [props.dragFunc]);

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