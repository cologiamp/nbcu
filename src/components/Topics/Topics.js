import './Topics.scss';
import React from 'react';

import Topic from '../Topic/Topic';
import Translate  from 'react-translate-component';

export const Topics = ({ topics, ...props }) => {
  const isShowingAll = (props.selectedTopicsIds.length === 0 &&
    props.selectedSubtopicsIds.length === 0) || props.selectedTopicsIds.length === topics.length;

  return (
    <div className="Topics">
      <div className="Topics-header">
        <h2><Translate content="app.topics" /></h2>
        <span
          className="filter"
          onClick={() => props.showAll()}
        >
          <Translate
            content={isShowingAll ? 'common.showingAll' : 'common.showAll'}
            style={!isShowingAll ? { textDecoration: 'underline' } : {} }/>
        </span>
      </div>
      <ul className="List">
        {topics.map((topic, i) => (
          <Topic key={i}
                 topicIndex={i}
                 topicId={topic.id}
            { ...props } >
            {topic.name}
          </Topic>
        ))}
      </ul>
    </div>
  );
}
