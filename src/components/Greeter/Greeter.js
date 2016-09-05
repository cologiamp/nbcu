import cookie from 'react-cookie';
import  ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import './Greeter.scss';

import React, { Component } from 'react';

import Translate  from 'react-translate-component';

import Button from '../Button/Button';
import nbcuLogo from '../../assets/images/nbcu-logo.png';

class Greeter extends Component {
  constructor(props) {
    super(props);
    const greeterOff = parseInt(cookie.load('NBCU-GreeterOff'), 10);

    this.state = {
      show: greeterOff !== 1
    };

    this._handleClick = this._handleClick.bind(this);
    this._handleCookie = this._handleCookie.bind(this);
  }

  _handleClick(e){
    const { updateAppState } = this.props;
    updateAppState({ section: 'FEED' });

    this.setState({
      show: 0
    });
  }

  _handleCookie() {
    cookie.save('NBCU-GreeterOff', 1, { path: '/', maxAge: 31536000});
    this._handleClick();
    
  }

  render() {

    const greeterContent = (
      <div className="Greeter-content">
        <div className="Greeter-box">
          <div className="Greeter-container">
            <h3 className="logo"><img src={nbcuLogo} />
              <i className="presents"><Translate content="greeter.presents" /></i>
            </h3>
            <h1 className="title"><Translate content="greeter.title" /></h1>
            <p><Translate content="greeter.line_1" /></p>
            <p><Translate content="greeter.line_2" /></p>
              <p><Translate content="greeter.title_2" /></p>
              <ul>
                <li>• <Translate content="greeter.item_1" /></li>
                <li>• <Translate content="greeter.item_2" /></li>
                <li>• <Translate content="greeter.item_3" /></li>
              </ul>
              <div className="actions">
                <Button onClick={(e) => this._handleClick(e)}><Translate content="greeter.button" /></Button>
                <span className="dont" onClick={(e) => this._handleCookie()}><Translate content="greeter.sub" /></span>
              </div>
              <div className="map"></div>
            </div>
          </div>
        </div>
      );

    return (
      <div className="Greeter">
        <ReactCSSTransitionGroup transitionLeaveTimeout={300} transitionName="fadeOut">
          {this.state.show ? greeterContent: null}
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

export default Greeter;
