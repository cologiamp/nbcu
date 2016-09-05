import './Header.scss';
import refreshIcon from '../../assets/images/refresh-icon.png';
import worldIcon from '../../assets/images/world-icon.png'
import React from 'react';

import Translate  from 'react-translate-component';
import counterpart from 'counterpart';

import Select from 'react-select';

const options = [
  { value: 'es', label: 'ESP' },
  { value: 'en', label: 'ENG' }
];

const Header = (props) => {

  const handleChange = (option) => {
    if (option) {
      const value = option.value;
      counterpart.setLocale(value);
      props.updateAppState({ lang: value }, () => {
        props.updateTopics();
        props.updateChannels();
        props.updateNewsFeed({}, true);
      });
    }

  };

return (
  <div className="Header">
    <div className="Header-container">
      <div>
        <h2><Translate content="app.title"/></h2>
      </div>
      <div>
        <ul className={props.section ? props.section.toLowerCase() : null}>
          <li className="refresh-box">
            <a className="refresh" onClick={ (e) => ( props.updateNewsFeed({}, true) ) }>
              <img src={refreshIcon} />
              <span><Translate content="header.refresh" /></span>
            </a>
          </li>
          <li className="save-changes-box">
            <a onClick={() => (props.updateAppState({section: 'FEED' }))}><Translate content="common.saveChanges" /></a>
          </li>
          <li className="locale-box" >
              <Select
                name="form-field-name"
                defaultValue={counterpart.getLocale()}
                value={props.lang}
                options={options}
                onChange={handleChange}
                searchable={false}
                multi={false}
                clearable={false}/>
          </li>
        </ul>
      </div>
    </div>
  </div>);

};

export default Header;
