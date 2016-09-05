import ES6Promise from 'es6-promise';
ES6Promise.polyfill();

import './../polyfills/ArrayFromPolyfill';

import 'video.js';

import React, { Component } from 'react';
import qs from 'query-string';
import moment from 'moment';
import Scroll from 'react-scroll';
import cookie from 'react-cookie';
import 'whatwg-fetch';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Overlay from './components/Overlay/Overlay';

import { Chart } from './components/Chart/Chart';
import MapTest from './components/Map/Map';

import MainContainer from './components/Main/MainContainer';
import { PanelContainer } from './components/Panel/PanelContainer';

import Greeter from './components/Greeter/Greeter';

import counterpart from 'counterpart';

import es from './locales/es';
import en from './locales/en';

counterpart.registerTranslations('en', en);
counterpart.registerTranslations('es', es);

import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appName: 'Nation Pulse',
      lastUpdated: moment(Date.now()).format('LLL'),
      topics: [],
      subtopics: [],
      selectedSubtopicsIds: [],
      selectedChannelsIds: [],
      selectedTopicsIds: [],
      feed: [],
      socialChannels: [],
      query: {},
      offset: 0,
      bottom: false,
      limit: 10,
      overlayDisplay: false,
      item: { channel: '', images: [], extra_author_attributes: {}},
      searchableItems: [],
      searchableNames: [],
      lang: 'en',
      channels: [],
      scrollPosition: 0,
      scrollAction: 'up',
      mapAnimation: null,
      section: 'greeter',
      subtopicsF: []
    };

    this.updateAppState = this.updateAppState.bind(this);
    this.updateNewsFeed = this.updateNewsFeed.bind(this);
    this.showAll = this.showAll.bind(this);
    this._handleScroll = this._handleScroll.bind(this);
    this._handlePanelScroll = this._handlePanelScroll.bind(this);
    this.updateChannels = this.updateChannels.bind(this);
    this.updateTopics = this.updateTopics.bind(this);
    this._onScrollPositionChange = this._onScrollPositionChange.bind(this);

    this.loadMore = this.loadMore.bind(this);
    this.getDocHeight = this.getDocHeight.bind(this);
  }

  componentDidMount() {
    const { _handleScroll } = this;
    const greeterOff = parseInt(cookie.load('NBCU-GreeterOff'), 10);

    window.addEventListener('scroll', _handleScroll);

    this.setState({
      section: greeterOff === 1 ? 'FEED' : 'greeter'
    });

    // Videos
    // let video = document.querySelector('video');
    // console.log("video = ", video);    //TODO (bc) remove log
    // makeVideoPlayableInline(video);
  }

  componentWillMount() {
    const scroll = Scroll.animateScroll;
    scroll.scrollToTop();

    if (window.location.host === 'yodecido.nationpulse.com') {
      counterpart.setLocale("es");
      this.setState({
        lang: "es"
      }, () => {
        this.updateTopics();
        this.updateChannels();
        this.updateNewsFeed({}, true);
      });
    }

    if (this.props.params.lang === 'es' || this.props.params.lang === 'en') {
      counterpart.setLocale(this.props.params.lang);
      this.setState({
        lang: this.props.params.lang
      }, () => {
        this.updateTopics();
        this.updateChannels();
        this.updateNewsFeed({}, true);
      });
    }

    if (this.props.location.query.lang === 'es' || this.props.location.query.lang === 'en') {
      counterpart.setLocale(this.props.location.query.lang);
      this.setState({
        lang: this.props.location.query.lang
      }, () => {
        this.updateTopics();
        this.updateChannels();
        this.updateNewsFeed({}, true);
      });
    }

    this.updateChannels();
    this.updateTopics();
    this.updateNewsFeed({},false);

  }

  updateAppState(update, cb) {
    console.log('Updating App State');
    this.setState(update, cb);
  }

  showAll() {
    this.updateAppState({
      selectedTopicsIds: [],
      selectedSubtopicsIds: []
    }, () => {
      this.updateNewsFeed({});
    });
  }

  updateTopics() {
    console.log('calling updateTopics');
    fetch(`http://nbcu.shoshkey.com/be/api/public/topics?lang=${this.state.lang}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(response => {
        let searchableNames = [];
        let subtopicsF = [];

        let topics = (response.data).reduce((pre, item, i, arr) => {
          searchableNames.push(item.name);
          return pre.concat([{ name: item.name, id: item.id }]
          )
        }, []);

        let subtopics = (response.data).reduce((pre, item, i, arr) => {
          return pre.concat([item.subtopics])
        }, []);

        subtopics = subtopics.map((item) => {
          return item.reduce((pre, item, i, arr) => {
            const { name, id, topic_id } = item;
            searchableNames.push(name);
            subtopicsF.push({ name, id, topic_id });
            return pre.concat([{ name, id, topic_id }]);
          }, [])
        });

        this.updateAppState({
          topics,
          subtopics,
          searchableNames,
          subtopicsF
        });

      });
  }

  updateChannels() {
    fetch(`http://nbcu.shoshkey.com/be/api/public/channels?lang=${this.state.lang}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(response => {

        this.updateAppState({
          channels: response
        });

      });
  }

  updateNewsFeed(queryObj, scrollToTop) {
    console.log(' ----------- Update News Feed ------------- ');
    const { selectedTopicsIds, selectedSubtopicsIds,
      selectedChannelsIds } = this.state;

    let defaultQuery = {
      'topics[]': selectedTopicsIds,
      'subtopics[]': selectedSubtopicsIds,
      'channels[]': selectedChannelsIds
    };

    let query = Object.assign(defaultQuery, queryObj);
    query = qs.stringify(query);

    let scroll = Scroll.animateScroll;
    let hasContent;

    let updateFeed = (response) => {

      // Parse content
      response.map((item, i) => {

        if ( item.images.length ) {

          var img = new Image();
          img.onerror = function () {
            item.images.splice(0, 1);
          };
          img.src = item.images[0].url;         
        }

        item.content = item.content.replace(/(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim, '<a href="$1" target="_blank">$1</a>')

        if( item.channel == "twitter" ) {
          item.content = item.content
            .replace(/(^|[^@\w])@(\w{1,15})\b/g, '$1<a href="https://twitter.com/$2" target="_blank">@$2</a>')
            .replace(/(^|)#(\w{1,140})\b/g, '$1<a href="https://twitter.com/hashtag/$2" target="_blank">#$2</a>');
          return item;
        }

        if( item.channel == "instagram" ) {
          item.content = item.content
            .replace(/(^|[^@\w])@(\w{1,15})\b/g, '$1<a href="https://www.instagram.com/$2" target="_blank">@$2</a>')
            .replace(/(^|)#(\w{1,250})\b/g, '$1<a href="https://www.instagram.com/explore/tags/$2" target="_blank">#$2</a>');
          return item;
        }
  
        if( item.channel == "facebook" ) {
          item.content = item.content
            .replace(/(^|)#(\w{1,250})\b/g, '$1<a href="https://www.facebook.com/hashtag/$2" target="_blank">#$2</a>');
          return item;
        }

      });


      // Save Feed
      if ((queryObj).hasOwnProperty('from_id')) {
        this.updateAppState({
          feed: [...this.state.feed, ...response]
        });
      } else {

        if (response.length > 0) hasContent = "has-content";
        else hasContent = "no-content";

        this.updateAppState({
          feed: response,
          hasContent: hasContent
        });
      }
    };

    fetch(`http://nbcu.shoshkey.com/be/api/public/feed?lang=${this.state.lang}&limit=${this.state.limit}&${query}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(response => {

        //console.log( response, " -- feed contents" );

        this.updateAppState({
          lastUpdated: moment(Date.now()).format('LLL')
        });

        updateFeed(response);
        if (scrollToTop) {
          scroll.scrollToTop();
        }

      });
  }

  _onScrollPositionChange(prop, value) {
    this.setState({
      [prop]: value,
    });
  }

  _handleScroll() {
    const { _onScrollPositionChange, getDocHeight, loadMore } = this;
    const { mapAnimation, scrollAction } = this.state;
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;

    const isOnTop = () => (
      scrollPosition === 0
    );

    const isAnimationActive = () => (
      mapAnimation === 'active'
    );

    const isInPositionRange = (y1, y2) => (
      scrollPosition >= y1 && scrollPosition <= y2
    );

    const range = (n1, n2) => {
      let res = [];

      for (let i = n1; i <= n2; i++) {
        res.push(i);
      }

      return res;
    };

    const isInRange = (n) => {
      return function() {
        const values = range(arguments[0], arguments[1]);
        return values.indexOf(n) !== -1;
      };
    };

    if (isOnTop()) _onScrollPositionChange('scrollAction', 'up');

    if (!isOnTop() && scrollAction === 'up') {
      // Set position to down
      _onScrollPositionChange('scrollAction', 'down')
    }

    if (!isInPositionRange(-100, 10) && !isAnimationActive()) {
      // Set animation to start
      _onScrollPositionChange('mapAnimation', 'active')
    }

    if (isOnTop() && isAnimationActive()) {
      // Set animation to stop
      _onScrollPositionChange('mapAnimation', null)
    }
    
    const innerHeight = scrollPosition + window.innerHeight;
    const docTotalHeight = isInRange(getDocHeight());

    // Checks if the position of the scroll is in the total height of the document
    // by 20 pixels more or less
    const scrollIsInDocTotalHeight = docTotalHeight(innerHeight - 20, innerHeight + 20);

    if (scrollIsInDocTotalHeight) {
      loadMore();
    }
  }

  _handlePanelScroll() {
    console.log('calling _handlePanelScroll');
    this.setState({
      scrollAction: 'down'
    });
  }

  getDocHeight() {
    let D = document;
    return Math.max(
      D.body.scrollHeight, D.documentElement.scrollHeight,
      D.body.offsetHeight, D.documentElement.offsetHeight,
      D.body.clientHeight, D.documentElement.clientHeight
    );
  }

  loadMore() {
    this.setState({
      offset: this.state.offset + 10
    }, () => {
      this.updateNewsFeed({
        'from_id': this.state.feed[0].id,
        offset: this.state.offset
      });
    });
  }

  componentWillUnmount() {
    // const panelElement = this.refs.AppContainer.querySelector('.Panel');

    // window.removeEventListener('scroll', this._handleScroll);

    // if (panelElement !== null) {
    //   panelElement.removeEventListener('scroll', this._handlePanelScroll);
    // }
  }

  render() {
    const { state } = this;

    const { section } = this.state;
    
    return (
      <div className="App">
        <Greeter updateAppState={ this.updateAppState }/>

        <Overlay updateAppState={ this.updateAppState }
          { ...state } />

        <Header { ...state } updateNewsFeed={ this.updateNewsFeed }
          updateAppState={ this.updateAppState }
          updateChannels={ this.updateChannels }
          updateTopics={ this.updateTopics} />

        <div className={`map ${state.mapAnimation} ${state.hasContent}`} style={{ left: this.state.chartOffsetLeft }}>
          <div className="map-wrapper">
          </div>
        </div>

        <div ref="AppContainer" className={`App-container grid ${state.hasContent}`}>

          <PanelContainer
            {...this}
            { ...state }
            showAll={ this.showAll }
            updateNewsFeed={ this.updateNewsFeed }
            updateAppState={ this.updateAppState }
            updateChannels={ this.updateChannels}/>

          <MainContainer
            { ...state }
            showAll={ this.showAll }
            updateNewsFeed={ this.updateNewsFeed }
            updateAppState={ this.updateAppState }
            updateChannels={ this.updateChannels } />
        </div>
        <Footer
          scrollAction={this.state.scrollAction}
          scrollPosition={this.state.scrollPosition}
          lang={this.state.lang}
          section={section} />
      </div>
    );
  }
}

export default App;


