import React from 'react'
import './tableStyle.css'

function Table(props) {
    
    function renderBlock() {
        const span = props.rowMat.length.toString();
        return (
            <td className='block' colSpan={span}>&nbsp;</td>
        );
    }

    function renderRowHeader(index, times) {
        // Create an array that we can map through
        // and essentially render times number of times
        const span = (props.timeLength * props.vals.length)/ (props.colMat[index].length * times);
        const str = span.toString();
        var arr = [...Array(times)];
        return arr.map(() => {
            return props.colMat[index].map((col) => {
                return(
                    <th key={col} colspan={str}>{col}</th>
                );
            });
        });
    }

    function renderHeader() {
        var times = 1;
        return props.colMat.map((elem, index) => {
            const befTime = times;
            times = times * elem.length;
            
            return (
                <tr key={index}>
                    {renderBlock()}
                    {renderRowHeader(index, befTime)}
                </tr>
            );
        });
    }

    function renderValHeader() {
        if(props.vals.length > 0) {
            const span = 1;
            const str = span.toString();
            var arr = [...Array(props.timeLength)];
            return arr.map(() => {
                return props.vals.map((item) => {
                    return(
                        <th key={item} colSpan={str}>{item}</th>
                    );
                });
            });
        }
    }

    function renderSideHead(rarr) {
        return props.rowMat.map((elem, ind) => {
            return (
                <th key={ind} colspan={'1'}>{elem[rarr[ind]]}</th>
            );
        });
    }

    function renderRow(row) {
        if((props.rowMat.length > 0) && (props.colMat.length > 0) && (props.vals.length > 0)) {
            var rarr = [...Array(props.rowMat.length)];
            var rtimes = 1;
            for(let i = props.rowMat.length - 1; i >= 0; i = i - 1) {
                rarr[i] = Math.floor(row / rtimes) % props.rowMat[i].length;
                rtimes = rtimes * props.rowMat[i].length;
            }

            // Create an array of size timelength to map through when printing
            // the crossReff
            var tarr = [...Array(props.timeLength * props.vals.length)];

            return (
                <tr key={row}>
                    {renderSideHead(rarr)}
                    {tarr.map((e, ind) => {
                        return (
                            <td key={ind}>{crossRef(rarr, ind)}</td>
                        );
                    })}
                </tr>
            );
        }
    }

    function dat(rarr, carr, val) {
        var doub = props.data.slice();
        rarr.forEach((elem, ind) => {
            doub = doub.filter((e) => e[props.rowTypes[ind]] === props.rowMat[ind][elem]);
        });

        carr.forEach((elem, ind) => {
            doub = doub.filter((e) => e[props.colTypes[ind]] === props.colMat[ind][elem]);
        });


        var ans = 0;
        doub.forEach((elem) => {
            ans = ans + parseFloat(elem[val]);
        });

        return Math.round(ans * 100) / 100;
    }

    function crossRef(rarr, col) {
        var carr = [...Array(props.colMat.length)];
        var ctimes = props.vals.length;
        for(let i = props.colMat.length - 1; i >= 0; i = i - 1) {
            carr[i] = Math.floor(col / ctimes) % props.colMat[i].length;
            ctimes = ctimes * props.colMat[i].length;
        }

        const valInd = col  % props.vals.length;
        const val = props.vals[valInd];
        return dat(rarr, carr, val);
    }

    function renderV() {
        if(props.vals.length > 0) {
            return (
                <tr>
                    {renderBlock()}
                    {renderValHeader()}
                </tr>
            );
        }
        else {
            return null;
        }
    }

    return  (
        <table id='data'>
            <tbody>
                {renderHeader()}
                {renderV()}
                {[...Array(props.numRows)].map((e, ind) => {
                    return renderRow(ind);
                })}
            </tbody>
        </table>
    );
}

export default Table;