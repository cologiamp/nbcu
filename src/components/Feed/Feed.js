import './Feed.scss';
import React, { Component } from 'react';
import moment from 'moment';

import Button from '../Button/Button';
import Translate  from 'react-translate-component';
import Masonry from 'react-masonry-component';

import placeholderMap from '../../assets/images/map-poster-video.png';

import { Chart } from '../Chart/Chart';

class Feed extends Component {
  constructor(props){
    super(props);

    this.state = {
      masonryOptions: {
        gutter: 15
      }
    };

    this.handleLoad = this.handleLoad.bind(this);
    this._handleClick = this._handleClick.bind(this);
  }

  handleLoad() {
    const { updateAppState, updateNewsFeed } = this.props;
    updateAppState({
      offset: this.props.offset + 10
    }, () => {
      updateNewsFeed({
        'from_id': this.props.feed[0].id,
        offset: this.props.offset
      });
    });
  }

  _handleClick(e, item) {
    e.preventDefault();
    const { updateAppState, updateNewsFeed } = this.props;

    updateAppState({
      overlayDisplay: true,
      item: item
    })
  }
  render() {

    const { feed } = this.props;
    const { masonryOptions } = this.state;

    const mainImage = (image, item) => {
      return (
        <div className="grid-item-main-image" style={{height: 160}}>
          <img src={image} onClick={(e) => (this._handleClick(e, item))} />
        </div>
        )
    };

    const renderHeader = (item) => {
      const author = item.extra_author_attributes;
      const channel = item.channel;

      const avatar = (channel === "twitter") ? author.profile_image_url : author.image_url;

      return (
        <div className="grid-item-header">
         <div className={`grid-item-header-container ${ (avatar) ? "" : "no-avatar"}`}>
                      
            { (avatar) ? <a onClick={(e) => (this._handleClick(e, item))} className="picture" style={{backgroundImage:`url(${avatar})`, backgroundSize: '100%'}}></a> : null}

            <h3 className="name">
              <a onClick={(e) => (this._handleClick(e, item))}>{author.name}</a>
            </h3>
            { channel === "twitter" ? (<a href={"https://www.twitter.com/" + author.screen_name} target="_blank" className="user-name">@{author.screen_name}</a>) : null }
            
          </div>
        </div>
      );

    };

    const items = feed.map((item, i) => {
        return (
        <li className="Feed-grid-item" key={item.id}>
           { item.channel ? <div className={`social-channel ${item.channel} `}></div> : null }
           { item.images.length ? mainImage(item.images[0].url, item) : null }
          { (item.extra_author_attributes) ? renderHeader(item) : null }

           <div className="grid-item-content">
              <h2><a onClick={(e) => (this._handleClick(e, item))}> {item.title}</a></h2>
              <div dangerouslySetInnerHTML={{__html: item.content}} />
           </div>
           <div className="grid-item-footer">
            <div className="published">
              Published on {moment(item.published).format('LLL')}
            </div>

            <div className="network">
              <a target="_blank" href={item.url}> {item.domain_url} </a>
            </div>
           </div>
        </li>
      )});

    const { mapAnimation } = this.props;

    return (
      <div className={`Feed ${mapAnimation}`}>
        <div className="map-container">
          <Chart />
        </div>
        <Masonry
          className={'ui-grid'}
          elementType={'ul'}
          options={masonryOptions}
          disableImagesLoaded={false}
          updateOnEachImageLoad={false}
        >
          {items}
        </Masonry>
        <div className="load-more">
          <Button onClick={ () => this.handleLoad() }>
            <Translate content="common.loadMore" />
          </Button>
        </div>
        <div className="no-conversations">
          <h3><Translate content="common.noConversationsTitle" /></h3>
          <p><Translate content="common.noConversationsText" /></p>
          <div className="show-all">
            <Button onClick={ () => this.props.showAll() }>
              <Translate content="common.showAllTopics" />
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default Feed;
