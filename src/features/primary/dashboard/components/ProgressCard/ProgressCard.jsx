import React from 'react';

const ProgressCard = (props) => {
  return (
    <div className="progresscard">
      {props.children}
    </div>
  );
};

export default ProgressCard;

