import React from 'react'
import './stylesheet.css'
import ItemBox from './components/ItemBox'
/* import Type from './components/Type' */
import InsertTable from './components/InsertTable/InsertTable'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      FileInserted: false,
      dataRead: false,
      ItemBoxes: [],
      IndBox: [],
      header: [],
      Data: []
    }

    this.setArr = this.setArr.bind(this);
  }

  /*state = useState({
    FileInserted: false,
    dataRead: false,
    ItemBoxes: [],
    IndBox: [],
    header: [],
    Data: []
  }); */

  readItemBoxes(fileId) {
    const Parser = require('papaparse');
    if(!this.state.dataRead) {
      Parser.parse(fileId.files[0], {
        skipEmptyLines: true,
        complete: this.setArr
      });
    }
  }

  checkHeader(elem) {
    for(let i = 0; i < elem.length; i++) {
        if((!(isNaN(parseInt(elem[i])))) || (elem[i] === '')) {
            return false;
        }
    }
    return true;
  }

  findHeader(data) {
    for(let i = 0; i < data.length; i++) {
      if(this.checkHeader(data[i])) {
        return i;
      }
    }
  }

  partitionData() {
    const arr = this.state.header.slice();
    var numData = [];
    const firstRow = this.state.Data[0];
    console.log(firstRow)
    const specData = arr.reduce((result, elem) => {
      // Check if this header category describes the data
      console.log('In arr.reduce loop');
      console.log(elem);
      let firstDatS = firstRow[elem];
      let firstDatI = parseFloat(firstDatS);
      if((isNaN(firstDatI)) || (firstDatI.toString() !==  firstDatS) || (elem === 'Fiscal Year')) {
        result.push(elem);
      }
      else {
        numData.push(elem);
      }

      return result;
    }, []);

    console.log('Loop finished');

    console.log(specData.length);
    console.log(numData.length);

    this.setState({
      ItemBoxes: specData,
      IndBox: numData
    });

    console.log('Set state successful');
  }

  changeInd(data) {
    this.setState({header: data[0]});

    const arr = data.slice(1).map((elem) => {
        let e = [];
        for(let i = 0; i < elem.length; i++) {
            e[this.state.header[i]] = elem[i];
        }

        return e;
    });
    
    this.setState({ Data: arr });
}

  setArr(result) {
    const data = result.data;
    var ind = this.findHeader(data);
    /* this.setState({ Data: data.slice(ind) });
    this.partitionData();
    this.changeInd(); */
    console.log('found header');
    this.changeInd(data.slice(ind));
    console.log('partitioning data');
    this.partitionData(data.slice(ind+1, ind+2));
    console.log('Back in setArr function');
    this.setState({ dataRead: true });
    console.log('Data Read');
  }

  // Returns the row index of an ItemBoxes element in the header
  // given the index of the element in the ItemBoxes array 
  getInd(index) {
    const categName = this.state.ItemBoxes[index];

    for(let i = 0; i < this.state.header.length; i++) {
      if(this.state.header[i] === categName) {
        return i;
      }
    }
  }

  uniqueItems(index) {
    const name = this.state.ItemBoxes[index];
    let items = this.state.Data.map((e) => {
      return e[name];
    });

    return [...new Set(items)];
  }

  renderItemBoxes() {
    if(this.state.dataRead) {
      return this.state.ItemBoxes.map((categ, index) => {
        console.log(categ + ': ' + this.uniqueItems(index).length)
        return (
          <ItemBox id={categ} className='itemBox' key={index} type={categ} items={this.uniqueItems(index)}>
            <p>{categ}</p>
          </ItemBox>
        );
      });
    }
  }

  renderOther() {
    if(this.state.dataRead) {
      return (
        <ItemBox id='Values' className='itemBox' key={-1} type='values' items={this.state.IndBox}>
          <p>Values</p>
        </ItemBox>
      );
    }
  }

  render() {

    const handleClick = () => {
      const fileId = document.getElementById('file');
      this.readItemBoxes(fileId);
      this.setState({FileInserted: true});
    };

    if(this.state.dataRead) {
      return (
        <div className='App'>
          
          <div className="flexContainer">
            {this.renderItemBoxes()}
            {this.renderOther()}
          </div>
  
          <InsertTable 
            id='ins' 
            className='insertTable' 
            dataAvail={this.state.FileInserted}
            accTypes={this.state.ItemBoxes}
            data={this.state.Data}
          > 
          </InsertTable>
    
        </div>
      );
    }
    else {
      return (
        <div className='App'>
          <label>Upload csv file<input type="file" id='file' accept=".csv"></input></label>
          <button id='upload' onClick={handleClick}>Create Table</button>
        </div>
      );
    } 
  }
}

export default App;