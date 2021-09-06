import React from 'react'
import { useDrop } from 'react-dnd'
import Item from './Item'

function Container(props) {
    const [, drop] = useDrop({
        accept: props.type,
        drop: (item, monitor) => props.dropFunc(item),
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    }, []);
    return(
        <div
            id={props.id}
            ref={drop}
            className={props.className}
            type={props.type}
        >
            {props.children}
            {props.items.map((elem) => {
                return (
                <Item id={elem} key={elem} className='item' type={props.type} char={props.char} dragFunc={props.dragFunc}>
                    {elem}
                </Item>
                    );
            })}
        </div>
    );
}
export default Container;