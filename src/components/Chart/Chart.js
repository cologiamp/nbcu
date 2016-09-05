import './Chart.scss';
import React  from 'react';

import video from '../../assets/map_video_081616.mp4';
import video_2 from '../../assets/map_video_081616.webm';
import poster from '../../assets/map.gif';

export const Chart = (props) => (
  <div className={`Chart ${props.hasContent}`}>
    <video id="mainVideoMap"
           className="video-js vjs-default-skin"
           preload="auto"
           poster={poster}
           loop autoPlay>
      <source src={video} type="video/mp4" />
      <source src={video_2} type="video/webm" />
      <p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>
    </video>
  </div>
);
