import React from "react";

const Badge = ({ children, variant = "default", className = "" }) => {
  const baseClasses =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

  const variantClasses = {
    default: "bg-blue-100 text-blue-800",
    outline: "border border-gray-500 text-gray-300 bg-transparent",
    secondary: "bg-gray-100 text-gray-800",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return <span className={classes}>{children}</span>;
};

export { Badge };
