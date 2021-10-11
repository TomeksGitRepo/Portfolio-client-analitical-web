import React, { Component } from 'react';

import _ from 'lodash';

interface componentState {
  diagramRecords: any[];
  tytul: string;
  options: any;
  region?: any;
}

export default class WorldMapDiagram extends Component<
  { data: any },
  componentState
  > {
  //Function to get data and parse it so it can be display on graph
  parseDataToGraph(data: any) {
    let test: any = data as unknown;
    console.log('data ==> ', data);
    var result = [];
    var header = []
    header.push(test['nazwa'])
    header.push(test['wartosc'])
    result.push(header)
    for(let key in test) {
      var item = []
      if (key == "_id" || key == "zrodło" || key == "wartosc" || key == "tytul" || key == "rodzaj" || key == "nazwa" || key == "region" ||  key == "" ) {
        continue;
      }
     item.push(key)
     item.push(parseInt(test[key]) || test[key])
     result.push(item)
    }

    return result;

  }


  //TODO just for diagram creation need to place higher
  tytul: any;
  dataValues: any;
  google: any;
  id?: number;

  constructor(props: any) {
    super(props);
    this.state = {
    tytul: props.data[0]['tytul'],
      diagramRecords: [],
      options: {
        title: {
          text: 'Diagram loading'
        },
      }
    };
    console.log('props.data before parseDateToGraph:', props.data);
  }



  componentWillMount() {
    var elementID = Math.floor(Math.random() * 1000000)
    this.id = elementID;
    if (this.props.data.length > 0) {
      (window as any).google = (window as any)['google'];
      this.setState(
        {
          options: {
            title: this.props.data[0]['tytul']
          }
        }
      );
      var mapResult =  this.parseDataToGraph(this.props.data[0]); //Parse data here
      var region = this.props.data[0]['region']
      this.setState({
        diagramRecords: mapResult,
        region: region
      });
      (window as any).google.charts.load('current', { 'packages': ['geochart'] });

      (window as any).google.setOnLoadCallback(() => {
        var data = (window as any).google.visualization.arrayToDataTable(this.state.diagramRecords);
        var options: any = {}
        if (this.state.region != null) {
          options['region'] = this.state.region;
        }

        var elementToDraw = document.getElementById(`map_chart:${this.id}`)
        var chart = new (window as any).google.visualization.GeoChart(elementToDraw);

        chart.draw(data, options);
      });

    }
  }

  // componentDidMount() {
  //   window.dispatchEvent(new Event('resize'));
  // }

  render() {
    return (
      <div className="ui row">
      <div className="ui column">
      <hr style={{width : "100%", textAlign: 'left', marginLeft: 0} } />
      <h3 style={{textAlign : 'center'}}>{this.state.tytul}</h3>
      <div id={`map_chart:${this.id}`} style={{ height: '500px' }}>
      </div>
      </div>
      </div>
    );
  }
}
