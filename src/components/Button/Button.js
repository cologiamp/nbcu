import './Button.scss';
import React from 'react';

const Button = (props) => {
  const buttonClassName = 'Button ' + props.className;
  return (
    <a {...props} className={buttonClassName}>
      {props.children}
    </a>
  )
};

export default Button;
