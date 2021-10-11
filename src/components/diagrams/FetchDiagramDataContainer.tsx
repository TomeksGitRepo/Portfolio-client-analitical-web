import React, { Component } from 'react';
import TableDiagram from './TableDiagram';
import CustomMap from './MapDiagram';

import axios from 'axios';
import _ from 'lodash';
import { connect } from 'react-redux';
import LineChartAjax from './LineChartAjax';
import SearchBar from '../theme/typicalWebComponents/SearchBar';
import ReturningUserBanner from '../theme/mainPageComponents/ReturningUserBanner';
import { Button } from 'semantic-ui-react';
import store from '../../state/store/Store';
import { startLoading, endedLoading } from '../../state/actions/loading'
import BounceLoader from 'react-spinners/BounceLoader'
import PieChartDiagram from './PieChartDiagram';
import WorldMapDiagram from './WorldMapDiagram';


class FetchDiagramDataContainer extends Component<
  { loading: boolean },
  {
    allData: any,
    urlRoot: string
  }
  > {
  allData: any = {};
  async fetchDataFromURL(url: string) {
    //console.log('Fetching data from fetchDataFromURL');
    store.dispatch(startLoading());
    await axios.get(url, { headers: { 'Access-Control-Allow-Credentials': true } }).then(response => {
      store.dispatch(endedLoading());
      this.setState({ allData: response });

    });
  }
  async fetchSearchQueryData(query: string) {
    store.dispatch(startLoading());
   var response =  await axios.post(`${this.getUrlRoot()}data/getTitle`, { "query": query }, { headers: { 'Access-Control-Allow-Credentials': true } });
      store.dispatch(endedLoading());
      this.setState({ allData: [] });
      this.setState({ allData: response });
  }

  constructor(props: any) {
    super(props);
    this.state = {
      allData: this.allData,
      urlRoot: this.getUrlRoot()
    };

    this.fetchSearchQueryData = this.fetchSearchQueryData.bind(this);
    this.getUrlRoot = this.getUrlRoot.bind(this);

  }

  getUrlRoot(): string {
    return `${window.location.protocol}//${window.location.hostname}/`
  }


  componentWillMount() {
    // this.fetchDataFromURL('http://localhost:3000/data/allData');
    //console.log('in FetchDiagramDataContainer constructor <----->')
    if (window.location.href.includes('/tabele')) {
      //console.log("in FetchDiagramDataContainer componentWillMount table route!!!")
      this.fetchDataFromURL(`${this.state.urlRoot}data/allTables`);
    } else if (window.location.href.includes('/wykresy')) {
      //console.log("in FetchDiagramDataContainer componentWillMount diagram route!!!")
      this.fetchDataFromURL(`${this.state.urlRoot}data/allDiagrams`);
    } else if (window.location.href.includes('/mapy')) {
      //console.log("in FetchDiagramDataContainer componentWillMount mapy route!!!")
      this.fetchDataFromURL(`${this.state.urlRoot}data/allMapsPoland`);
    } else if (window.location.origin + '/' === window.location.href) {
      //console.log("in FetchDiagramDataContainer componentWillMount root route!!!")
      this.fetchDataFromURL(`${this.state.urlRoot}data/allData`);
    }
  }

  componentWillUnmount() {
    console.log('Destroying FetchDiagramDataContainer')
  }


  render() {
    // console.log(
    //   'FetchDiagramDataContainer this.state.allData ==>',
    //   this.state.allData
    // );
    return (
      <div className="ui sixteen wide column">
        <div id="donutchart" css="width: 900px; height: 500px;"></div>
        <SearchBar queryFuntion={this.fetchSearchQueryData} />
        {this.props.loading ?
          <div className="one column centered row" style={{ height: '150px' }}>
            <div className="sixteen wide column" style={{ height: '150px' }}>
              <BounceLoader color={"#36d7b7"} size={150} css={"display: block; margin: 0 auto;"} />
            </div>
          </div> : null}
        {_.some(this.state.allData.data, { "searchedFromCookie": true }) ? <ReturningUserBanner lastQuery={this.state.allData.data[0].searchedQuery} /> : null}
        {_.isEmpty(this.state.allData) == false && this.state.allData.data.length > 0
          ? this.state.allData.data.map((record: any) => {
            if (record.rodzaj === 'wykres') {
              return <LineChartAjax data={record.data} />;
            } else if (record.rodzaj === 'tabela') {
              return <TableDiagram data={record.data} />;
            } else if (record.rodzaj === 'mapaPolski') {
              //console.log('in mapaPolski record.data:', record.data);
              return <CustomMap numberOfThisMap={record.data[0]._id} voievodeship={record.data} />;
            } else if (record.rodzaj === 'wykresKolowy') {
              return <PieChartDiagram data={record.data} />
            } else if (record.rodzaj === 'wykresMapaSwiata') {
              return <WorldMapDiagram data={record.data} />
            } else {
              return 'Nothing';
            }
          })
          : this.props.loading == true ? <div style={{ textAlign: 'center', fontSize: '2em' }}>Wczytywanie danych...</div> : <div style={{ textAlign: 'center', fontSize: '2em' }}>Brak danych spełniających podane kryteria</div>}
      </div>
    );
  }
}

function mapStateToProps(state: any, ownProps: any) {
  return {
    loading: state.loading
  }
}

export default connect(mapStateToProps)(FetchDiagramDataContainer);
