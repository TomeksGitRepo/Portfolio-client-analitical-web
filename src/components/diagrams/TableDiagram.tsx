import React, { Component } from 'react';

export default class TableDiagram extends Component<
  { data: any },
  { headers: string[] }
> {
  constructor(props: any) {
    super(props);

    // console.log('In TableDaigram this.props.data: ', this.props.data);
    this.parseTableDiagram(this.props.data);
    this.state = {
      headers: []
    };
  }

  printTableName() {
    return this.dataToParse[0]['tytul']
  }

  parseTableDiagram(data: any) {
    let dataCopy: any = data as unknown;
    // console.log('data in parseTableDiagram: ', data);
    // console.log('dataCopy in parseTableDiagram: ', dataCopy);
    let tableTitle = dataCopy[0]['tytul'];
    // console.log('Table title ==>', tableTitle);

    let notCategoryArray = [
      '_id',
      'rodzaj',
      'tytul',
      'nazwa',
      'zrodło',
      'xAxisName',
      'yAxisName',
      ''
    ];
    
    this.dataToParse = dataCopy;

    let diagramKeys = Object.keys(data[0]);
    diagramKeys = diagramKeys.filter(item => {
      return notCategoryArray.indexOf(item) === -1;
    });
    this.objectDiagramKeys = diagramKeys;

    // console.log('this.objectDiagramKeys: ', this.objectDiagramKeys);
    this.tableHeaders = this.sortTableHeaders(this.objectDiagramKeys);
    // console.log('this.tableHeaders in parseTableDiagram', this.tableHeaders);
  }

  objectDiagramKeys: any;
  tableHeaders: any;
  dataToParse: any;
  sortedDataForPrinting: any;


  sortTableHeaders(headers: [string]) {
    let sortedArray = headers.sort().reverse();
    return sortedArray;
  }

  sortTableDataForPrinting() {
    // console.log('this.dataToParse in sortTableDataForPrinting: ', this.dataToParse);
    let sortedData: any = [];
    this.dataToParse.map((item: any) => {
      let recordValues: any = [];

      // console.log('in dataToParse map  item:', item);
      this.tableHeaders.map((header:any) => recordValues.push(item[header]) )
      // console.log('recordValues in map function: ', recordValues);
      sortedData.push(recordValues)
      this.sortedDataForPrinting = sortedData;
    } )
    // console.log('sortedData in sortTableDataForPrinting: ', sortedData)
  }

  componentWillMount() {
    this.sortTableDataForPrinting()
  }

  printTable() {
    // console.log('this.tableHeaders in printTable function', this.state.headers);
    if (!this.tableHeaders) {
      return '';
    }
    return (
      <table className="ui unstackable table selectable ">
      <thead>
        <tr>
          {this.tableHeaders.map((item: any) => {
            // console.log('item in printTable');
            return <th>{item}</th>;
          })}
           
          </tr>
          </thead>
          {/* {this.sortTableDataForPrinting()} */}
          <tbody>
          {this.sortedDataForPrinting.map((item: any) => {
          return <tr>{item.map((record: any) => {
          return <td>{record}</td>
          })}</tr>
          })}
          </tbody>
        
     
      </table>
    );
  }
  render() {
    return (
      <div className="ui grid">
  <h1 className="table_header sixteen wide column">{this.printTableName()}</h1>
        <div className="ui unstackable table celled">{this.printTable()}</div>
      </div>
    );
  }
}
