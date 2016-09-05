import './Search.scss';
import React from 'react';
import { Typeahead } from 'react-typeahead';

import Translate  from 'react-translate-component';

const Search = (props) => (
  <div className="Search">
  <form>
    <div className="form-field">
      <Typeahead
        options={props.searchableNames}
        value={props.selectedItemId}
        placeholder={props.lang === 'en' ? 'Search by Topic' : 'Buscar por Tema'}
        maxVisible={2}
        onOptionSelected={props._onSearchValueClick}
      />
    </div>
    <div className="form-field right">
      <button
        onClick={(e) => {
          props._onSearchButtonClick(e)
        }}
      >
        <Translate content="common.apply" />
      </button>
    </div>
  </form>
  </div>
);


export default Search;
