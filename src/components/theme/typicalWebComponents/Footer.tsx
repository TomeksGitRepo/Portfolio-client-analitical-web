import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import backgroundImage from '../../../images/stopa4-02.png';


export default class Footer extends Component {
  render() {

    return (
      <div className="ui sixteen wide container" style={{ position: "relative", marginTop: "20px" }}>
        <div style={{ position: "absolute", top: "15px", right: "15px", color: "white", zIndex: 9, fontSize: 16, fontWeight: "bold" }}>
          <a style={{ position: "absolute", top: "15px", right: "15px", color: "white", zIndex: 9, fontSize: 16, fontWeight: "bold" }} className="ui floated left" href="mailto:xxx@xxx.pl">XXX@XXXX.XX</a>
        </div>
        <img className="ui fluid image" src={backgroundImage} />
        <div className="ui sixteen wide column container">
          <br />
          <p style={{ textAlign: "center" }}>Administratorem strony jest <a href="#">XXXX <br /></a></p>
        </div>
      </div>
    );
  }
}
