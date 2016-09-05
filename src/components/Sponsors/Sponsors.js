import './Sponsors.scss';
import React from 'react';

import List from '../List/List';

const Sponsors = () => {

    const sponsors = [
      'NBC',
      'CNBC',
      'Telemundo'
    ];

    return (
      <div className="Sponsors">
        <h2>Sponsors</h2>
        <List type="Sponsor" items={sponsors} disable={1}/>
      </div>
    )
};

export default Sponsors;
