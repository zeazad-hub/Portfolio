import React, {useCallback, useState} from 'react'
import { useDrop } from 'react-dnd'
import Item from './Item'

function ItemBox(props) {
    const [Items, setItems] = useState(props.items);

    const [, drop] = useDrop({
        // The extra "ins" at the beginning shows that the item is coming
        // from the insert box
        accept: 'ins'+ props.type,
        drop: (item, monitor) => {
            addItem(item);
        },
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    }, [Items]);
    
    function addItem(item, ignore) {
        var list = Items.slice();
        list.push(item.id);
        setItems(list);
    }

    const removeItem = useCallback((item, ignore) => {
        var list = Items.slice();
        var ind = list.indexOf(item.id);
        list.splice(ind, 1);
        setItems(list);
    }, [Items]);
    
    return (
        <div
            id={props.id}
            ref={drop}
            className={props.className}
            type={props.type}
        >
            {props.children}
            {Items.map((elem) => {
                return (
                <Item id={elem} key={elem} className='item' type={props.type} char={props.char} dragFunc={removeItem}>
                    {elem}
                </Item>
                    );
            })}
        </div> 
    );
}

export default ItemBox;