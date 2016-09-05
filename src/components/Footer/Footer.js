import './Footer.scss';
import React from 'react';

import sponsor_1 from '../../assets/images/sponsor-1-1.png';
import sponsor_2 from '../../assets/images/sponsor-2-2.png';

import Translate  from 'react-translate-component';


const Footer = (props) => (
  <div className={`Footer ${props.section.toLowerCase()} ${props.scrollAction} ${props.lang}  `}>
    <div className="bg" />
    <div className="Footer-container">

      <div>
        <ul>
          <li><a href="http://www.nbcnews.com/politics/2016-election" target="_blank"> <img src={sponsor_1} alt=""/></a></li>
          <li><a href="http://www.telemundo.com/noticias/yo-decido-2016" target="_blank"> <img src={sponsor_2} alt=""/></a></li>
        </ul>
      </div>

      <div>
        <ul className="terms-and-policy">
          {props.lang === 'es' ? <li><a href="http://www.nbcuniversal.com/privacy-spanish" target="_blank"><Translate content="footer.privacy"/></a></li> : null}
          {props.lang === 'en' ? <li><a href="http://www.nbcuniversal.com/privacy" target="_blank"><Translate content="footer.privacy"/></a></li> : null}
          <li><a href="http://www.nbcuniversal.com/terms" target="_blank"><Translate content="footer.terms"/></a></li>
        </ul>
      </div>

    </div>
  </div>
);

export default Footer;
