import './Channels.scss';
import React from 'react';

import Channel from '../Channel/Channel';
import Translate  from 'react-translate-component';

export const Channels = ({ channels, ...props }) => (
  <div className="SocialChannels">
    <div className="SocialChannels-header">
      <h2><Translate content="app.channels"/></h2>
    </div>
    <ul>
      { channels.map((channel, i) => (
          <Channel channelId={channel.id} key={channel.id} {...props}> { channel.name } </Channel>
        )
      )}
    </ul>
  </div>
);
