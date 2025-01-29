import React from 'react';

const ProgressBar = ({ color, width ,totalwidth}) => {
  
  return (
    <div className={`relative w-${totalwidth} bg-gray-300 rounded-full h-2.5`}>
      <div
        className={`progressbar-wrapper absolute left-0 top-0 h-2.5 rounded-full bg-${color}`}
        style={{
          width: `${width}%`,
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;
