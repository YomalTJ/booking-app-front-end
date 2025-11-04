import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  fullWidth?: boolean;
  type?: "submit" | "button" | "reset";
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  fullWidth = false,
  type = "submit",
  className = "",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${
        fullWidth ? "w-full" : "md:w-48"
      } p-4 mt-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition duration-300 font-medium shadow-md hover:shadow-lg ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
