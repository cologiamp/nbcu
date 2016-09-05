import './Chart.scss';
import React  from 'react';

import video from '../../assets/map_video_081616.mp4';
import video_2 from '../../assets/map_video_081616.webm';
import poster from '../../assets/map.gif';
import Map from '../Map/Map';

export const Chart = (props) => (
  <div className={`${props.hasContent}`}>
    <Map/>
  </div>
);
