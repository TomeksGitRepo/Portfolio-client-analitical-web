import React, { Component } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import axios from 'axios';
import _ from 'lodash';

interface componentState {
  diagramRecords: any[];
  tytul: string;
  options: any;
}

export default class LineChartAjax extends Component<
  { data: any },
  componentState
  > {
  //Function to get data and parse it so it can be display on graph
  parseDateToGraph(data: any) {
    let test: any = data as unknown;
    //console.log('Element at 0 ', test);
    // console.log('data ==> ', data);
    // _.forOwn(data, (value: any, key: any) => {
    //   const tempDiagramRecords = this.state.diagramRecords.
    //   this.setState({this.state.diagramRecords.push(value) })
    // }
    // this.setState({ diagramRecords: data });

    // diagramRecords.map(item => item.data);

    //Making object keys as category
    let diagramKeys = Object.keys(data);

    //console.log('diagramKeys === ', diagramKeys);

    //tytul value

    let diagramTitle = test['tytul'];
    let xAxisName = test['xAxisName'];
    let yAxisName = test['yAxisName'];
    // console.log('xAxisName: ', xAxisName, 'yAxisName:', yAxisName);
    // console.log('Diagram title ==>', diagramTitle);
    // this.setState({
    //   ...this.state.options,
    //   options: { title: { text: diagramTitle } }
    // });
    // console.log(
    //   'this.state.options.title.text after change: ',
    //   this.state.options.title.text,
    //   'and diagramTitle: ',
    //   diagramTitle
    // );
    let notCategoryArray = [
      '_id',
      'rodzaj',
      'tytul',
      'nazwa',
      'zrodlo',
      'xAxisName',
      'yAxisName',
      ''
    ];
    diagramKeys = diagramKeys.filter(item => {
      return notCategoryArray.indexOf(item) === -1;
    });
    this.objectDiagramKeys = diagramKeys;
    //Starting point value

    // console.log('diagramKeys after filter === ', diagramKeys);
    //DIAGRAM VALUES
    let tempObjectWithoutUnnecesseryFields = _.omit(test, notCategoryArray);
    let diagramValues = _.values(tempObjectWithoutUnnecesseryFields).map(
      item => {
        if (item === '') return '';
        return Number(item);
      }
    );
    //this.objectDiagramValues = diagramValues;

    let onlyNumbersInDiagramValues = diagramKeys.map(item => {
      let diagramKeysLenght = diagramKeys.length - 1;
      if (item === '') return Number(diagramKeys[diagramKeysLenght]); ///TODO make this magic number some
      return Number(item);
    });
    let minDiagramKey = Math.min(...onlyNumbersInDiagramValues) - 1;
    // console.log('minDiagramKey: ', minDiagramKey);

    // console.log('objectDiagramValues ==> ', this.objectDiagramValues);
    // console.log(
    //   'typeof objectDiagramValues ==> ',
    //   typeof this.objectDiagramValues
    // );
    var dataName: string = test['nazwa'];

    // console.log('dataName ===> ', dataName);

    // this.setState({
    //   options: {
    //     series: _.merge(_.cloneDeep(this.state.options.series), {
    //       name: dataName,
    //       data: this.objectDiagramValues
    //     })
    //   }
    // });

    if (this.state.options.series) {
      let tempArray = this.state.options.series;
      tempArray.push({
        name: dataName,
        data: diagramValues
      });
      // console.log('tempArray in constructor: ', tempArray);
      this.setState({
        options: {
          ...this.state.options,
          series: tempArray,
          title: { text: diagramTitle },
          plotOptions: {
            series: { pointStart: minDiagramKey || 0 }
          },
          yAxis: {
            title: {
              text: yAxisName
            }
          },
          xAxis: {
            categories: this.objectDiagramKeys,
            title: {
              text: xAxisName
            }
          }
        }
      });
    }
  }

  //TODO just for diagram creation need to place higher
  objectDiagramKeys: any;
  tytul: any;
  objectDiagramValues: any;
  constructor(props: any) {
    super(props);
    this.state = {
      tytul: '',
      diagramRecords: [],
      options: {
        title: {
          text: 'Diagram loading'
        },
        //TODO automaticly change starting point of diagram
        // plotOptions: {
        //   series: { pointStart: 1 }
        // },
        series: [
          // {
          //   name: 'Some series',
          //   data: [
          //     1,
          //     2,
          //     3,
          //     1,
          //     2,
          //     3,
          //     1,
          //     2,
          //     3,
          //     1,
          //     2,
          //     3,
          //     1,
          //     2,
          //     3,
          //     1,
          //     2,
          //     3,
          //     1,
          //     2,
          //     3,
          //     1,
          //     1,
          //     2,
          //     3,
          //     1,
          //     2,
          //     3,
          //     1,
          //     2,
          //     3,
          //     1,
          //     2,
          //     3,
          //     1,
          //     2,
          //     3,
          //     1,
          //     2,
          //     3,
          //     1,
          //     2,
          //     3
          //   ]
          // },
          // {
          //   name: 'Other series',
          //   data: [4, 5, 6]
          // }
        ],
        yAxis: {
          title: {
            text: 'Y axis title'
          }
        },
        xAxis: {
          categories: this.objectDiagramKeys,
          title: {
            text: 'Number of steps'
          }
        }
      }
    };

    // let data = axios
    //   .get('http://localhost:3000/data/allData')
    //   .then(response => {
    //     data = response.data[0].data[0];
    //      //
    //   });
    // console.log('props.data before parseDateToGraph:', props.data);
  } //     2,
  //     3,
  //     1,
  //     2,
  //     3,

  componentWillMount() {
    // console.log(
    //   'LineChartAjax  componentWillMount this.props.data',
    //   this.props.data
    // );
    
    if (this.props.data.length > 0) {
      this.props.data.map((item: any) => this.parseDateToGraph(item));
      // console.log('this.objectDiagramKeys:', this.objectDiagramKeys)
    }
  }

  // componentDidMount() {
  //   window.dispatchEvent(new Event('resize'));
  // }

  render() {
    return (
      <div className="lineChart">
        <HighchartsReact highcharts={Highcharts} options={this.state.options} style={{width: '100%'}} />
        </div>
    );
  }
}
