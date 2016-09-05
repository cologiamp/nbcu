import React, { Component } from 'react';

import Main from './Main';

class MainContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {};

  }
  render() {
    const { props } = this;
    return (
      <Main { ...props }/>
    )
  }
}

export default MainContainer;
