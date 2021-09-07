import React from 'react'
import InsBox from './InsBox'
import Table from './Table'
import './insertStyle.css'


// This component was written as a class component because
// the implementation as a class component is more readable
// than the implementation as a function component 
class InsertTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // The items currently stored in the rows, columns, and values insert boxes,
            // respectively.
            rows: [],
            cols: [],
            vals: [],

            // The types (i.e. category/ header column) of items that 
            // the row insert box can accept currently. If an item of 
            // a certain type is dropped in the column inseert box, 
            // then, logically, all other items of that type can only 
            // be dropped in the column insert box
            rowTypes: this.props.accTypes,

            // colTypes is the types of items that the col insert box can
            // accept currently
            colTypes: this.props.accTypes,

            // The types of items that the column insert box currently has
            currColTypes: [],

            // The types of items that the row insert box currently has
            currRowTypes: [],

            // The colMat is used to form the column headers of the table.
            // It is a double array and there is an array for each item type
            // currently stored in the column insert box. Thus, the first 
            // dimension of colMat is equal to the length of colTypes. The
            // items within each specific type are stored in the array that
            // corresponds to their item type.
            colMat: [],

            // Similar to colMat; but for rows instead of columns.
            rowMat:[],

            // These are used to help format the table and will be passed to it as props.
            // timeLength is the number of columns the table will have and numRows is 
            // the number of rows
            timeLength: 0,
            numRows: 0,
        };

        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
    }

    // Called when an item has been removed from the rows array
    updateColTypes(type) {
        var rows = this.state.rows.slice();

        // If the type is not in 
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

        if(filtered.length === 0) {
            var list = this.state.currColTypes.slice();
            list = list.filter((elem) => elem !== type);
            this.setState({ currColTypes: list });
        }
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

        var arr = this.state.colMat.slice();

        arr[ind] = arr[ind].filter((elem) => elem !== item.id);

        if(arr[ind].length === 0) {
            arr.splice(ind, 1);
        }

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

    // Takes in item to insert and a char representing which insert box
    // (rows, cols, or vals) to insert into.
    addItem(item, char) {
        if(char === 'r') {
            var rlist = this.state.rows.slice();
            rlist.push(item);
            var carr = this.state.colTypes.slice();
            this.setState({
                colTypes: carr.filter((elem) => elem !== item.type)
            });

            // Update row matrix and row types
            this.addCurrRowTypes(item.type);
            this.addRowMat(item);
            this.calcNumRows();
            this.setState({rows: rlist});
        }
        else if (char === 'c') {
            var clist = this.state.cols.slice();
            clist.push(item);
            var rarr = this.state.rowTypes.slice();
            this.setState({
                rowTypes: rarr.filter((elem) => elem !== item.type)
            });

            // Update row matrix and row types
            this.addCurrColTypes(item.type);
            this.addColMat(item);
            this.calcTimeLength();
            this.setState({cols: clist});
        }
        else {
            var vlist = this.state.vals.slice();
            vlist.push(item.id);
            this.setState({vals: vlist});
        }
    }

    // Takes in item  to remove and a char representing which insert box
    // (rows, cols, or vals) to  remove from.
    removeItem(given_item, char) {
        // Remove the 'ins' from given_item.type
        var item = {...given_item, type: given_item.type.slice(3)};

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
        }
    }

    render() {
        return (
            <div>
                <div>
                    <div id='box' className="flexbox">
                        <InsBox 
                            id={this.props.id}
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