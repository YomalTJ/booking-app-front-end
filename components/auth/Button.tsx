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
}) => {
  return (
    <button
      type={type}
      className={`${
        fullWidth ? "w-full" : "md:w-48"
      } p-4 mt-4 bg-[#5995fd] text-white rounded-full hover:bg-[#4d84e2] transition duration-300 cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
