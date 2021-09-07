import React from 'react'
import { useDrop } from 'react-dnd'
import './insertStyle.css'
import Item from '../Item'

function InsBox(props) {
    const [, drop] = useDrop({
        accept: props.typeList,
        drop: (item, monitor) => {
            props.dropFunc(item, props.char)
        },
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    }, [props.typeList]);

    return (
        <div 
            id={props.id}
            className={props.className}
            ref={drop}
        >
            {props.children}
            {props.items.map((item) => {
                var itype = 'insvalues';
                var iId;

                if(props.char !== 'v') {
                    itype = 'ins' + item.type;
                    iId = item.id;
                }
                else {
                    iId = item;
                }

                return (
                    <Item id={iId} key={iId + itype} className='item' type={itype} dragFunc={props.dragFunc} char={props.char}>
                        {iId}
                    </Item>
                );
            })}

        </div>
    );
}
export default InsBox;