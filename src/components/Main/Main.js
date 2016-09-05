import React from 'react';
import './Main.scss';

import { FeedContainer } from '../../components/Feed/FeedContainer';
import { ChannelsContainer } from '../../components/Channels/ChannelsContainer';
import { TopicsContainer } from '../../components/Topics/TopicsContainer';
import { MiniChart } from '../../components/MiniChart/MiniChart';

import Translate  from 'react-translate-component';

const Main = (props) => {
  const render = () => {
    switch (props.section) {
      case 'TOPICS':
        return (<TopicsContainer { ...props } />);
      case 'FEED':
        return (<FeedContainer { ...props } />);
      case 'LOCATION':
        return (<div className="content">
          <h1><Translate content="app.location"/></h1>
          <MiniChart { ...props } />
        </div>);
      case 'CHANNELS':
        return (<ChannelsContainer { ...props } />);
      default:
        return (<FeedContainer { ...props } />);
    }
  };

  return (
    <div className="col col-9-12 Main">
      {render()}
    </div>
  );
}

export default Main;
