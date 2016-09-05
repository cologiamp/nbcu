import './Panel.scss';
import React, { Component } from 'react';

import topicsIcon from '../../assets/images/icon-1.png';
import locationIcon from '../../assets/images/icon-2.png';
import channelsIcon from '../../assets/images/icon-3.png';
import FeedIcon from '../../assets/images/icon-4.png';

import SearchContainer from '../../components/Search/SearchContainer';
import  { TopicsContainer } from '../../components/Topics/TopicsContainer';
import { ChannelsContainer } from '../../components/Channels/ChannelsContainer';
import { MiniChart } from '../../components/MiniChart/MiniChart';

import Translate  from 'react-translate-component';

class Panel extends Component {
  constructor(props) {
    super(props);

    this._goTo = this._goTo.bind(this);
    this._isActive = this._isActive.bind(this);
  }

  _goTo(section) {
    window.scrollTo(0, 0);
    this.props.updateAppState({ section });
  }

  _isActive(_section) {
    let { section } = this.props;
    if (typeof section === 'undefined') {
      section = 'FEED';
    }

    return section === _section;
  }

  render() {

    const { props } = this;
    const { selectedTopicId, lang } = props;

    return (
      <div className={`col col-3-12 Panel  __${selectedTopicId} ${props.mapAnimation}`}>
        <MiniChart { ...props } />
        <SearchContainer { ...props }  />
        <TopicsContainer { ...props } />
        <ChannelsContainer { ...props }/>
        <div className={`Nav ${props.section.toLowerCase()}`}>
          <ul>
            <li className={this._isActive('TOPICS') ? 'active' : ''}>
              <a onClick={() => { this._goTo('TOPICS'); }}>
                <img src={topicsIcon}/>
                <span><Translate content="app.topics" /></span>
              </a>
            </li>
            <li className={this._isActive('LOCATION') ? 'active' : ''}>
              <a onClick={() => { this._goTo('LOCATION'); }}>
                <img src={locationIcon}/>
                <span><Translate content="app.location" /></span>
              </a>
            </li>
            <li className={this._isActive('CHANNELS') ? 'active' : ''}>
              <a onClick={() => { this._goTo('CHANNELS'); }}>
                <img src={channelsIcon}/>
                <span><Translate content="app.channels" /></span>
              </a>
            </li>
            <li className={this._isActive('FEED') ? 'active' : ''}>
              <a onClick={() => { this._goTo('FEED'); }}>
                <img src={FeedIcon}/>
                <span><Translate content="app.feed" /></span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}


export default Panel;
