import React from "react";

const Button = ({ children, visible = true, ...rest }) => {
  if (!visible) return null;

  return (
    <button
      {...rest}
      className="text-white tw-py-2 tw-px-8 tw-bg-gray-800 tw-text-lg tw-uppercase tw-borde tw-inline-block"
    >
      {children}
    </button>
  );
};

export default Button;
