import React, { Component } from 'react';
import './Channel.scss';

class Channel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: false
    };

    this._toggleSelected = this._toggleSelected.bind(this);
    this._handleClick = this._handleClick.bind(this);
  }
  _toggleSelected() {
    this.setState({
      selected: !this.state.selected
    })
  }
  _handleClick(e, channelId) {
    e.preventDefault();
    this._toggleSelected();

    const { updateAppState, updateNewsFeed, selectedChannelsIds } = this.props;

    let match = selectedChannelsIds.indexOf(channelId);

    let channelsIds = selectedChannelsIds;

    if ( match === -1 ) {
      channelsIds.push(channelId);
    } else {
      channelsIds.splice(match, 1);
    }

    updateAppState({
      selectedChannelsIds: channelsIds
    }, () => {
      updateNewsFeed({});
    });

  }
  render(){
    const { channelId, selectedChannelsIds } = this.props;
    return (
      <li
        className={`Item SocialChannel ${ selectedChannelsIds.indexOf(channelId) !== -1 ? 'selected' : '' }`}
        onClick={ (e)=> (this._handleClick(e, channelId))}>
        {this.props.children}
      </li>
    );
  }
}

export default Channel;