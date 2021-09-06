import React from 'react'
import './tableStyle.css'

class Table extends React.Component {
    /* constructor(props) {
        super(props);

    } */
    renderBlock() {
        const span = this.props.rowMat.length.toString();
        return (
            <td className='block' colSpan={span}>&nbsp;</td>
        );
    }

    renderRowHeader(index, times) {
        // Create an array that we can map through
        // and essentially render times number of times
        const span = (this.props.timeLength * this.props.vals.length)/ (this.props.colMat[index].length * times);
        const str = span.toString();
        var arr = [...Array(times)];
        return arr.map(() => {
            return this.props.colMat[index].map((col) => {
                return(
                    <th key={col} colspan={str}>{col}</th>
                );
            });
        });
    }

    renderHeader() {
        var times = 1;
        return this.props.colMat.map((elem, index) => {
            const befTime = times;
            times = times * elem.length;
            
            return (
                <tr key={index}>
                    {this.renderBlock()}
                    {this.renderRowHeader(index, befTime)}
                </tr>
            );
        });
    }

    renderValHeader() {
        if(this.props.vals.length > 0) {
            const span = 1;
            const str = span.toString();
            var arr = [...Array(this.props.timeLength)];
            return arr.map(() => {
                return this.props.vals.map((item) => {
                    return(
                        <th key={item} colSpan={str}>{item}</th>
                    );
                });
            });
        }
    }

    renderSideHead(rarr) {
        return this.props.rowMat.map((elem, ind) => {
            return (
                <th key={ind} colspan={'1'}>{elem[rarr[ind]]}</th>
            );
        });
    }

    renderRow(row) {
        if((this.props.rowMat.length > 0) && (this.props.colMat.length > 0) && (this.props.vals.length > 0)) {
            var rarr = [...Array(this.props.rowMat.length)];
            var rtimes = 1;
            for(let i = this.props.rowMat.length - 1; i >= 0; i = i - 1) {
                rarr[i] = Math.floor(row / rtimes) % this.props.rowMat[i].length;
                rtimes = rtimes * this.props.rowMat[i].length;
            }

            // Create an array of size timelength to map through when printing
            // the crossReff
            var tarr = [...Array(this.props.timeLength * this.props.vals.length)];

            return (
                <tr key={row}>
                    {this.renderSideHead(rarr)}
                    {tarr.map((e, ind) => {
                        return (
                            <td key={ind}>{this.crossRef(rarr, ind)}</td>
                        );
                    })}
                </tr>
            );
        }
    }

    dat(rarr, carr, val) {
        var doub = this.props.data.slice();
        rarr.forEach((elem, ind) => {
            doub = doub.filter((e) => e[this.props.rowTypes[ind]] === this.props.rowMat[ind][elem]);
        });

        carr.forEach((elem, ind) => {
            doub = doub.filter((e) => e[this.props.colTypes[ind]] === this.props.colMat[ind][elem]);
        });


        var ans = 0;
        doub.forEach((elem) => {
            ans = ans + parseFloat(elem[val]);
        });

        return Math.round(ans * 100) / 100;
    }

    crossRef(rarr, col) {
        var carr = [...Array(this.props.colMat.length)];
        var ctimes = this.props.vals.length;
        for(let i = this.props.colMat.length - 1; i >= 0; i = i - 1) {
            carr[i] = Math.floor(col / ctimes) % this.props.colMat[i].length;
            ctimes = ctimes * this.props.colMat[i].length;
        }

        const valInd = col  % this.props.vals.length;
        const val = this.props.vals[valInd];
        return this.dat(rarr, carr, val);
    }

    renderV() {
        if(this.props.vals.length > 0) {
            return (
                <tr>
                    {this.renderBlock()}
                    {this.renderValHeader()}
                </tr>
            );
        }
        else {
            return null;
        }
    }

    render() {
        var arr = [...Array(this.props.numRows)];

        return  (
            <table id='data'>
                <tbody>
                    {this.renderHeader()}
                    {this.renderV()}
                    {arr.map((e, ind) => {
                        return this.renderRow(ind);
                    })}
                </tbody>
            </table>
        );
    }
}

export default Table;