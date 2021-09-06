const fs = require('fs');
const Parser = require('papaparse');
/* var $; */
/* getData() {
        $.ajax({
            type: 'GET',
            url: '../pivot.csv',
            success: function (data) {
                var allTextLines = data.split(/\r\n|\n/);
                var headers = allTextLines[1].split(',');

                for (var i=1; i<15; i++) {
                    var data = allTextLines[i].split(',');
                    if (data.length == headers.length) {

                        var tarr = [];
                        for (var j=0; j<headers.length; j++) {
                            tarr.push(headers[j]+":"+data[j]);
                        }
                        this.pivotCost.push(tarr);
                    }
                }
            }
        })
    } */
/* $ = require("jquery")(window);
var deferred = $.Deferred(); */
/* jsdom.env("", function(err, window) {
    if (err) {
        console.error(err);
        return;
    }
    $ = require("jquery")(window);
    doSomething();
});

 function doSomething(){
    var deferred = $.Deferred();
 } */

/* var lines = [];
function run(lines) {
  $.ajax({
      type: "GET",
      url: "data.txt",
      dataType: "text",
      success: function(data) {processData(data, lines);}
   });
}

function processData(allText, lines) {
  var record_num = 5;  // or however many elements there are in each row
  var allTextLines = allText.split(/\r\n|\n/);
  var entries = allTextLines[0].split(',');

  var headings = entries.splice(0,record_num);
  while (entries.length>0) {
      var tarr = [];
      for (var j=0; j<record_num; j++) {
          tarr.push(headings[j]+":"+entries.shift());
      }
      lines.push(tarr);
  }
}

run(lines);

console.log(lines[0]['Row Labels']); */

/* import React, { useState, useEffect} from 'react'; */
/* import { csv } from 'd3';
const parser = require(csv-parse); 
const Parser = require('papaparse');
const fs = require('fs');

useEffect(() => {
  csv('pivot.csv').then(data => {
    console.log(data);
  });
}, []);

const parser = parse(csv, {
  from_line: 2,
  to_line: 15,
  columns: true
}); */

/* const path = require('path');

const processPC = async () => {
  const cost = [];
  const parser = fs.createReadStream(pivotFP)
  .pipe(parse({from_line: 2, to_line: 15, columns: true}));

  for await (const row of parser) {
    cost.push(row);
  }

  return cost;
}

const processPP = async () => {
  const profit = [];
  const parser = fs.createReadStream(pivotFP)
  .pipe(parse({from_line: 42, columns: true}));

  for await (const row of parser) {
    profit.push(row);
  }

  return profit;
}

var pivotCost = [];
(async () => {
  pivotCost = await processPC();
  const pivotProfit = await processPP();
})()

console.log(pivotCost); */

/* var pivot = new File(pivotFP);
pivot.createFromFileName(pivotFP); */
const pivotFP = './pivot.csv';
const pivot = fs.readFileSync(pivotFP, 'utf8');
const pivotCost = {};
const pivotProfit = {};
Parser.parse(pivot,
{
  /* downloadRequestHeaders: {
    'Product': 'Baby Food',
    'Asia': '5,0000',
    'Australia and Oceania': '5,0000',
    'Central America and the Caribbean': '5,000',
    'Europe': '5,000',
    'Middle East and North Africa': '5,000',
    'Sub-Saharan Africa': '5,000',
    'Grand Total': '5,000',
  }, */
  skipEmptyLines: true,
  complete: function(results) {
      pivotCost.data = results.data.slice(2, 15);
      pivotProfit.data = results.data.slice(42);
      pivotProfit.errors = results.errors;
      pivotCost.errors = results.errors;
      pivotCost.meta = results.meta;
      pivotProfit.meta = results.meta;
  }
});

/* const y = pivotCost.data.map((elem) => {
  const [lab, c1, c2, c3, c4, c5, c6, c7, c8] = elem;
  return {lab, c1, c2, c3, c4, c5, c6, c7, c8};
}); */

console.log(pivotCost.data);

/* const pivotCostArray = pivotCost.data.map((row) => {
  const { rowLab, a, b, c, d, e, f, g, h, i } = row;
  console.log(rowLab);
  if(rowLab == '') {
    return;
  }
  return row;
}) */