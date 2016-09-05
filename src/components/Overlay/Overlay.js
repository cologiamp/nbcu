import './Overlay.scss';
import React, { Component } from 'react';
import moment from 'moment';

class Overlay extends Component {
  constructor(props) {
    super(props);

    this.updateAppState = this.props.updateAppState.bind(this);
    this._closeOverlay = this._closeOverlay.bind(this);
  }
  _closeOverlay(e) {
    e.preventDefault();

    this.updateAppState({
      overlayDisplay: false
    })
  }
  render() {
    const { overlayDisplay, item } = this.props;

      const author = item.extra_author_attributes;
      const channel = item.channel;
      const avatar = (channel === "twitter") ? author.profile_image_url : author.image_url;

      return (
        <div className={`Overlay ${overlayDisplay ? 'active' : ''}`}>
          <div className="Overlay-box">
            <span className="cross" onClick={ (e) => (this._closeOverlay(e)) }></span>
            <div className="Overlay-box-wrapper">
              { item.images.length ? <div className="Overlay-header"><div className="image-container"><img src={item.images[0].url} /></div></div> : null }
              <div className="Overlay-profile">
                <div className={`social-channel ${item.channel} `}></div>
                <div className={`container ${ (avatar) ? "" : "no-avatar"}`}>
                  { (avatar) ? <div className="picture" style={{backgroundImage:`url(${avatar})`, backgroundSize: '100%'}}></div> : null }
                  <h3 className="name">
                    <a target="_blank" href={item.url}>{author.name}</a>
                    { channel === "twitter" ? (<span className="user-name"><a target="_blank" href={"https://www.twitter.com/" + author.screen_name}>@{author.screen_name}</a></span>) : null }
                  </h3>
                </div>
              </div>

              <div className="Overlay-content">
                <h2><a target="_blank" href={item.url}> {item.title}</a></h2>
                <p dangerouslySetInnerHTML={{__html: item.content}} />
              </div>

              <div className="Overlay-footer">
                <div>
                  <div className="published">
                    Published on {moment(item.published).format('LLL')}
                  </div>

                  <div className="network">
                    <a target="_blank" href={item.url}> {item.domain_url} </a>
                  </div>
                </div>
              </div>
              
            </div>
          </div>

        </div>
      );
  }
}

export default Overlay;