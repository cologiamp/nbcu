import './Feed.scss';
import React from 'react';
import 'whatwg-fetch';

import Feed from './Feed';

export const FeedContainer = (props) => (
  <Feed { ...props } />
);
