import React, { Component } from 'react';
import './Topic.scss';

import _ from 'underscore';
import Subtopic from '../Subtopic/Subtopic';

class Topic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: false
    };

    this._toggleSelected = this._toggleSelected.bind(this);
    this._handleClick = this._handleClick.bind(this);


  }
  shouldComponentUpdate(nextProps,nextState) {
    const { selected } = this.state;
    const { children, selectedTopicsIds } = this.props;
    return nextState.selected !== selected || children !== nextProps.children || !_.isEqual(selectedTopicsIds, nextProps.selectedTopicsIds) ;
  }
  _toggleSelected() {
    this.setState({
      selected: !this.state.selected
    })
  }
  _handleClick(e, topicId) {
    e.preventDefault();
    this._toggleSelected();

    let topicsIds = [];
    let subtopicsIds = [];
    const { selectedTopicsIds, selectedSubtopicsIds } = this.props;

    const subtopicsForSelectedTopic = this.props.subtopics[this.props.topicIndex].map((subtopic) => {
      return subtopic.id;
    });

    let match = selectedTopicsIds.indexOf(topicId);

    if (match === -1) {
      topicsIds = [
        ...selectedTopicsIds,
        topicId
      ];
      subtopicsIds = selectedSubtopicsIds.concat(subtopicsForSelectedTopic);
    } else {
      topicsIds = selectedTopicsIds;
      topicsIds.splice(match, 1);
      subtopicsIds = selectedSubtopicsIds;
      for (let i = 0, l = subtopicsForSelectedTopic.length; i < l; i += 1) {
        subtopicsIds.splice(subtopicsIds.indexOf(subtopicsForSelectedTopic[i]), 1);
      }
    }

    this.props.updateAppState({
      selectedTopicsIds: topicsIds,
      selectedSubtopicsIds: subtopicsIds
    }, () => {
      this.props.updateNewsFeed({});
    });

  }
  render(){
    const { subtopics, topicIndex, selectedTopicsIds, topicId } = this.props;
    return (
          <li className={`Topic-container ${ selectedTopicsIds.indexOf(topicId) !== -1 ? 'selected' : '' }`} >
            <div className="Item Topic"
                 onClick={ (e) => this._handleClick(e, topicId) }>
              { this.props.children }
              <span className="circle" />
            </div>
            <div className="Subtopics-container"
                 style={{
                  display: (selectedTopicsIds.indexOf(topicId) !== -1) ? 'block' : 'none'
                 }} >
              <ul className="Subtopics">
                {subtopics[topicIndex].map((subtopic, i) => {
                  return (<Subtopic key={i} subtopicId={subtopic.id} {...this.props} > { subtopic.name } </Subtopic>);
                })
                }
              </ul>
            </div>

          </li>
    );
  }
}

export default Topic;
