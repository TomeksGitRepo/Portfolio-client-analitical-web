import React, { Component } from 'react';
import ButtonExample from './components/theme/Button';
import MainMenuExample from './components/theme/typicalWebComponents/MainMenu';

import axios from 'axios';
//Just for testing on main page
import LineChartAjax from './components/diagrams/LineChartAjax';
import FetchDiagramDataContainer from './components/diagrams/FetchDiagramDataContainer';
import _ from 'lodash';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux'

import Header from './components/theme/typicalWebComponents/Header'
import Footer from './components/theme/typicalWebComponents/Footer'

class App extends Component<{ data: any, loading?: boolean }, { data: any, loading?: boolean }> {

  constructor(props: any) {
    super(props);
    this.state = {
      data: ''
    };
  }


  render() {
    return (

      <Router >
        <div className="App cointeiner">
          <Header />
          <header className="App-header">
            <MainMenuExample />
          </header>
          <Switch>
            <Route exact path="/tabele" >
              <React.Fragment key={2}>
                <FetchDiagramDataContainer />
              </React.Fragment>
            </Route>
            <Route exact path="/wykresy" >
              <React.Fragment key={3}>
                <FetchDiagramDataContainer />
              </React.Fragment>
            </Route>
            <Route exact path="/mapy" >
              <React.Fragment key={4}>
                <FetchDiagramDataContainer />
              </React.Fragment>
            </Route>
            <Route exact path="/" >
              <React.Fragment key={1}>
                <FetchDiagramDataContainer />
              </React.Fragment>
            </Route>
          </Switch>

          <Footer />
        </div>
      </Router>

    );
  }
}

function mapStateToProps(state: any, ownProps: any) {
  return {
    loading: state.loading
  }
}

export default connect(mapStateToProps)(App);
