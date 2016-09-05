import React, { Component } from 'react';
import './Subtopic.scss';


class Subtopic extends Component {
  constructor(props) {
    super(props);

    const { subtopics, topicIndex } = this.props;

    const subtopicsForSelectedTopic = subtopics[topicIndex].map((subtopic) => {
      return subtopic.id;
    });

    this.state = {
      selected: true,
      subtopicsForSelectedTopic
    };

    this._toggleSelected = this._toggleSelected.bind(this);
    this._handleClick = this._handleClick.bind(this);

  }
  _toggleSelected() {
    this.setState({
      selected: !this.state.selected
    })
  }
  _handleClick(e, subtopicId) {
    e.preventDefault();

    this._toggleSelected();

    const { updateAppState, updateNewsFeed, selectedSubtopicsIds} = this.props;

    let match = selectedSubtopicsIds.indexOf(subtopicId);

    let subtopicIds = selectedSubtopicsIds;
    
    if ( match === -1 ) {
      subtopicIds.push(subtopicId);
    } else {
      subtopicIds.splice(match, 1);
    }

    updateAppState({
      selectedSubtopicsIds: subtopicIds
    }, () => {
      updateNewsFeed({});
    });

  }
  render(){
    const { subtopicId, children } = this.props;
    const { selected } = this.state;

    return (
            <li className={`Item Subtopic ${(selected) ? 'selected' : ''}`}
                onClick={ (e) => (this._handleClick(e, subtopicId)) } >
            { children }
            </li>
            );
  }
}

export default Subtopic;