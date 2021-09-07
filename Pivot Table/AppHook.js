import React, { useState } from 'react'
import './stylesheet.css'
import ItemBox from './components/ItemBox'
/* import Type from './components/Type' */
import InsertTable from './components/InsertTable/InsertTable'

function App() {
  /*constructor(props) {
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
  } */

  // Create a state for the main web page
  const [state, setState] = useState({
    FileInserted: false,
    dataRead: false,
    ItemBoxes: [],
    IndBox: [],
    header: [],
    Data: []
  });

  // Parse through the files and call setArr once parsing is complete inorder to 
  // set the Data double array in the state variable
  function readItemBoxes(fileId) {
    const Parser = require('papaparse');
    if(!state.dataRead) {
      Parser.parse(fileId.files[0], {
        skipEmptyLines: true,
        complete: setArr
      });
    }
  }

  // Checks if the given row is a header; meaning that it only contains strings 
  // and no numerical data. The given row is expeted to be an array
  function checkHeader(elem) {
    for(let i = 0; i < elem.length; i++) {
        // If the row has a single item that is an empty string or a string
        // that can be parsed into a number, then it is assumed not to be a header 
        if((!(isNaN(parseInt(elem[i])))) || (elem[i] === '')) {
            return false;
        }
    }
    return true;
  }

  // Find the header of the table in the given csv file. Once the header is found, 
  // the beginning of the table will also be found.
  function findHeader(data) {
    for(let i = 0; i < data.length; i++) {
      if(checkHeader(data[i])) {
        return i;
      }
    }
  }

  // Split the header column names into either characterizable data that will
  // have its own item box component with all of the values or numerical data
  // that will be summed in the table (i.e. total profit, unit cost, etc.)
  function partitionData() {
    const arr = state.header.slice();
    var numData = [];

    // First row of actual data (i.e. row after the header)
    const firstRow = state.Data[0];

    //let isnum = /^\d+$/.test(val);
    const specData = arr.reduce((result, elem) => {
      // To check is the header column name contains numerical data in its respective
      // column, we check if the string can be parsed into an integer (because everything is read in 
      // as a string) and we check if the parsed integer is identicalto the original string.  
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

    setState( state => ({...state, ItemBoxes: specData, IndBox: numData
    }));

    console.log('Set state successful');
  }

  // Change the data double array once the header of the table is found so that the 
  // rows can be accessed by index and the columns in every row can be accessed by 
  // their corresponding column name in the header. 
  // Takes in initailly parsed data from the csv file. 
  function changeInd(data) {
    const header = data[0];

    // The Data double array stored in our state will not store the header
    // row
    const arr = data.slice(1).map((elem) => {
        let e = [];
        for(let i = 0; i < elem.length; i++) {
            e[header[i]] = elem[i];
        }

        return e;
    });
    
    setState(state => ({...state, header: data[0], Data: arr}));
}

  function setArr(result) {
    const data = result.data;
    var ind = findHeader(data);
    
    console.log('found header');
    // We conly want to look at the data at an d below the header
    // row, so we pass a slice of the data to change Ind
    changeInd(data.slice(ind));
    console.log('partitioning data');
    console.log(state);
    partitionData(data.slice(ind+1, ind+2));
    console.log('Back in setArr function');
    setState({ dataRead: true });
    console.log('Data Read');
  }

  // Returns the row index of an ItemBoxes element in the header
  // given the index of the element in the ItemBoxes array 
  /* function getInd(index) {
    const categName = state.ItemBoxes[index];

    for(let i = 0; i < state.header.length; i++) {
      if(state.header[i] === categName) {
        return i;
      }
    }
  } */

  function uniqueItems(index) {
    const name = state.ItemBoxes[index];
    let items = state.Data.map((e) => {
      return e[name];
    });

    return [...new Set(items)];
  }

  function renderItemBoxes() {
    if(state.dataRead) {
      return state.ItemBoxes.map((categ, index) => {
        //console.log(categ + ': ' + uniqueItems(index).length)
        return (
          <ItemBox id={categ} className='itemBox' key={index} type={categ} items={uniqueItems(index)}>
            <p>{categ}</p>
          </ItemBox>
        );
      });
    }
  }

  function renderOther() {
    if(state.dataRead) {
      return (
        <ItemBox id='Values' className='itemBox' key={-1} type='values' items={state.IndBox}>
          <p>Values</p>
        </ItemBox>
      );
    }
  }

  const handleClick = () => {
    const fileId = document.getElementById('file');
    readItemBoxes(fileId);
    setState({FileInserted: true});
  };

    return (
      <div className='App'>
        {state.dataRead && 
          <>
            <div className="flexContainer">
              {renderItemBoxes()}
              {renderOther()}
            </div>

            <InsertTable 
              id='ins' 
              className='insertTable' 
              dataAvail={state.FileInserted}
              accTypes={state.ItemBoxes}
              data={state.Data}
            > 
            </InsertTable>
      
          </>
        }
        {!state.dataRead && 
          <>
            <label>Upload csv file<input type="file" id='file' accept=".csv"></input></label>
            <button id='upload' onClick={handleClick}>Create Table</button>
          </>
        }
      </div> 
    );
}

export default App;
