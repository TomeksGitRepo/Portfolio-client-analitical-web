import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const cookieApproved = "isCookieApproved";

export default class Header extends Component {
  state = {
    shouldHide: false
  }



  render() {

    return (
      <div>
        {localStorage.getItem(cookieApproved) != "true" ? <div style={{ display: this.state.shouldHide ? 'none' : 'flex' }} className="ui icon message">
          <i className="exclamation triangle icon"></i>
          <div className="content">
            <div className="header">
              Strona używa plików cookies w celu poprawienia jakości jej użytkowania.
    </div>

          </div>
          <button className="ui green button" onClick={() => {
            localStorage.setItem(cookieApproved, "true");
            this.setState(() => {
              return {
                shouldHide: true
              }
            })

          }}>Rozumiem</button>
        </div> : null}
        <div className="ui segment">
          <img className="ui fluid image" src="/images/bannerMain2021small.gif" />
        </div>
      </div>

    );
  }
}
