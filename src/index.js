import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.scss';
import { browserHistory, Router, Route } from 'react-router';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="/:lang" component={App} />
    </Route>
  </Router>,
  document.getElementById('root')
);
