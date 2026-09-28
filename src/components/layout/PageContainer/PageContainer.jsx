import React from 'react';

const PageContainer = (props) => {
  return (
    <div className="pagecontainer">
      {props.children}
    </div>
  );
};

export default PageContainer;

