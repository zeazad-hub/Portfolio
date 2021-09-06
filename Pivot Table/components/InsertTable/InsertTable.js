import React from 'react'
import InsBox from './InsBox'
import Table from './Table'
import './insertStyle.css'

class InsertTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            cols: [],
            vals: [],
            rowTypes: this.props.accTypes,
            colTypes: this.props.accTypes,
            currColTypes: [],
            currRowTypes: [],
            colMat: [],
            rowMat:[],
            timeLength: 0,
            numRows: 0,
            shouldRem: true
        };

        console.log('We started rendering inserTable component');
        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
    }

    // Called when an item has been removed from the rows array
    updateColTypes(type) {
        var rows = this.state.rows.slice();

        var rFilt = rows.filter((elem) =>  elem.type === type );

        if(rFilt.length === 0) {
            var cTypes = this.state.colTypes.slice();
            cTypes.push(type);
            this.setState({ colTypes: cTypes });
        }
    }

    // Called when an item has been removed from the cols array
    updateRowTypes(type) {
        var cols = this.state.cols.slice();

        var cFilt = cols.filter((elem) => elem.type === type );

        if(cFilt.length === 0) {
            var rTypes = this.state.rowTypes.slice();
            rTypes.push(type);
            this.setState({ rowTypes: rTypes });
        }
    }

    addCurrColTypes(type) {
        if(!(this.state.currColTypes.includes(type))) {
            var list = this.state.currColTypes.slice();
            list.push(type);
            this.setState({ currColTypes: list });
        }
    }

    addCurrRowTypes(type) {
        if(!(this.state.currRowTypes.includes(type))) {
            var list = this.state.currRowTypes.slice();
            list.push(type);
            this.setState({ currRowTypes: list });
        }
    }

    remCurrColTypes(type) {
        var cols = this.state.cols.slice();
        var filtered = cols.filter((elem) => elem.type === type);

        console.log(filtered.length);
        if(filtered.length === 0) {
            var list = this.state.currColTypes.slice();
            list = list.filter((elem) => elem !== type);
            this.setState({ currColTypes: list });
        }

        console.log(this.state.currColTypes);
    }

    remCurrRowTypes(type) {
        var rows = this.state.rows.slice();
        var filtered = rows.filter((elem) => elem.type === type);

        if(filtered.length === 0) {
            var list = this.state.currRowTypes.slice();
            list = list.filter((elem) => elem !== type);
            this.setState({ currRowTypes: list });
        }
    }

    // Called after addColTypes
    addColMat(item) {
        const ind = this.state.currColTypes.indexOf(item.type);

        var arr = this.state.colMat.slice();
        console.log(ind + ' arr length: ' +  arr.length);
        if(ind >= arr.length) {
            arr[ind] = [];
        }

        arr[ind].push(item.id);

        this.setState({ colMat: arr });
    }

    // Called after addRowTypes
    addRowMat(item) {
        const ind = this.state.currRowTypes.indexOf(item.type);

        var arr = this.state.rowMat.slice();

        if(ind >= arr.length) {
            arr[ind] = [];
        }

        arr[ind].push(item.id);

        this.setState({ rowMat: arr });
    }

    // Called before remColTypes
    remColMat(item) {
        const ind = this.state.currColTypes.indexOf(item.type);
        console.log(ind);

        var arr = this.state.colMat.slice();

        arr[ind] = arr[ind].filter((elem) => elem !== item.id);

        if(arr[ind].length === 0) {
            arr.splice(ind, 1);
        }

        console.log(arr);

        this.setState({ colMat: arr });
    }

    // Called before remRowTypes
    remRowMat(item) {
        const ind = this.state.currRowTypes.indexOf(item.type);

        var arr = this.state.rowMat.slice();
        arr[ind] = arr[ind].filter((elem) => elem !== item.id);

        if(arr[ind].length === 0) {
            arr.splice(ind, 1);
        }

        this.setState({ rowMat: arr });
    }

    calcTimeLength() {
        var res = 1;
        this.state.colMat.forEach((elem) => {
            res = res * elem.length;
        });

        this.setState({ timeLength: res });
    }

    calcNumRows() {
        var res = 1;
        this.state.rowMat.forEach((elem) => {
            res = res * elem.length;
        });

        this.setState({ numRows: res });
    }

    // Checks if the given item is in the given array
    contains(list, item) {
        for(let i = 0; i < list.length; i++) {
            if((list[i].id === item.id) && (list[i].type === item.type)) {
                return true;
            }
        }
        return false;
    }

    addItem(item, char) {
        if(char === 'r') {
            var rlist = this.state.rows.slice();
            if(this.contains(rlist, item)) {
                this.setState({shouldRem: false});
            }
            else {
                rlist.push(item);
                var carr = this.state.colTypes.slice();
                this.setState({
                    colTypes: carr.filter((elem) => elem !== item.type)
                });

                this.addCurrRowTypes(item.type);
                this.addRowMat(item);
                this.calcNumRows();
            }

            this.setState({rows: rlist});
        }
        else if (char === 'c') {
            var clist = this.state.cols.slice();
            if(this.contains(clist, item)) {
                this.setState({shouldRem: false});
            }
            else {
                clist.push(item);
                var rarr = this.state.rowTypes.slice();
                this.setState({
                    rowTypes: rarr.filter((elem) => elem !== item.type)
                });

                this.addCurrColTypes(item.type);
                this.addColMat(item);
                this.calcTimeLength();
            }
            this.setState({cols: clist});
        }
        else {
            var vlist = this.state.vals.slice();
            if(vlist.includes(item.id)) {
                this.setState({shouldRem: false});
            }
            else {
                vlist.push(item.id);
            }
            this.setState({vals: vlist});
        }
    }

    removeItem(item, char) {
        if(this.state.shouldRem) {
            if(char === 'r') {
                var rlist = this.state.rows.slice();
                rlist = rlist.filter((elem) => (elem.id !== item.id) || (elem.type !== item.type));
                this.setState({rows: rlist});
                
                this.updateColTypes(item.type);
                this.remRowMat(item);
                this.remCurrRowTypes(item.type);
                this.calcNumRows();
            }
            else if (char === 'c') {
                var clist = this.state.cols.slice();
                clist = clist.filter((elem) => (elem.id !== item.id) || (elem.type !== item.type));
                this.setState({cols: clist});

                this.updateRowTypes(item.type);
                this.remColMat(item);
                this.remCurrColTypes(item.type);
                this.calcTimeLength();
            }
            else {
                var vlist = this.state.vals.slice();
                var vind = vlist.indexOf(item.id);
                vlist.splice(vind, 1);
                this.setState({vals: vlist});
                console.log(this.state.vals.length);
            }
        }
        else {
            this.setState({shouldRem: true});
        }
    }

    render() {
        return (
            <div>
                <div>
                    <div id='box' className="flexbox">
                        <InsBox 
                            id={this.props.id}
                            key={this.state.rowTypes + 'h'}
                            className={this.props.className}
                            typeList={this.state.rowTypes}
                            char='r'
                            dropFunc={this.addItem}
                            dragFunc={this.removeItem} 
                            items={this.state.rows}
                        >
                            <p>Rows</p>
                        </InsBox>

                        <InsBox 
                            id={this.props.id}
                            key={this.state.colTypes}
                            className={this.props.className}
                            typeList={this.state.colTypes}
                            char='c'
                            dropFunc={this.addItem}
                            dragFunc={this.removeItem}
                            items={this.state.cols}
                        >
                            <p>Columns</p>
                        </InsBox>

                        <InsBox 
                            id={this.props.id}
                            key={'values'} 
                            className={this.props.className}
                            typeList='values'
                            char='v'
                            dropFunc={this.addItem}
                            dragFunc={this.removeItem}
                            items={this.state.vals}
                        >
                            <p>Values</p>
                        </InsBox>
                    </div>
    
                    <Table
                        rowTypes={this.state.currRowTypes}
                        colTypes={this.state.currColTypes}
                        colMat={this.state.colMat}
                        rowMat={this.state.rowMat}
                        timeLength={this.state.timeLength}
                        numRows={this.state.numRows}
                        vals={this.state.vals}
                        data={this.props.data}
                    >
                    </Table>
                </div>
            </div>
            )
    }
}

export default InsertTable;