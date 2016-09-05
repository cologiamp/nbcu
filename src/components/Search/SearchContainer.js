import './Search.scss';
import React, { Component } from 'react';

import Search from './Search';

class SearchContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      selectedItemId: '',
      active: false
    };

    this._onSearchValueClick = this._onSearchValueClick.bind(this);
    this._onSearchButtonClick = this._onSearchButtonClick.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._onChange = this._onChange.bind(this);
  }
  _onSearchButtonClick(e) {
    e.preventDefault();

    const { selectedItemId, selectedSubitemId } = this.state;
    const { updateAppState, updateNewsFeed } = this.props;

    
    updateAppState({
      selectedTopicsIds: [selectedItemId],
      selectedChannelsIds: [],
      selectedSubtopicsIds: [selectedSubitemId]
    }, () => {
      updateNewsFeed({});
    });

    this.setState({
      selectedItemId: ''
    });

  }

  _onSearchValueClick(e){
    const { topics, subtopicsF } = this.props;

    const topic = topics.filter(topic => (
      topic.name === arguments[0]
    ));

    if (!topic.length) {
      let subtopic = subtopicsF.filter(subtopic => {
        return subtopic.name === arguments[0];
      });

      return this.setState({
        selectedItemId: parseInt(subtopic[0].topic_id),
        selectedSubitemId: subtopic[0].id
      });
    }

    this.setState({
      selectedItemId: topic[0].id
    });
  }
  _onChange() {
    this.setState({
      active: true
    })
  }
  _onBlur(){
    this.setState({
      active: false
    })
  }

  render() {

    const { state, props } = this;

    return (
      <Search {...props} {...this} />
    )
  }
}

export default SearchContainer;
