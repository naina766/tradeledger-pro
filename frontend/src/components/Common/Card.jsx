import React from 'react';

const Card = ({ children, className = '', title = '', action = null }) => {
  return (
    <div className={`glass-panel rounded-xl p-6 shadow-premium ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          {title && <h3 className="text-white font-semibold text-base">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
