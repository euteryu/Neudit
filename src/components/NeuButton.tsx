// @ts-nocheck
import React from 'react';
import classNames from 'classnames';

export const NeuButton = ({ children, onClick, active, className, title }) => {
  return (
    <button
      onClick={onClick}
      title={title}
      className={classNames(
        "p-3 rounded-xl transition-all duration-200 ease-in-out flex items-center justify-center text-neu-text font-medium outline-none",
        active ? "shadow-neu-pressed text-blue-600" : "shadow-neu-flat hover:translate-y-[-2px]",
        className
      )}
    >
      {children}
    </button>
  );
};