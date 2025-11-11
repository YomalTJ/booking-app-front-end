import React, { ReactNode } from "react";

interface FormContainerProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const FormContainer: React.FC<FormContainerProps> = ({
  title,
  children,
  className = "",
}) => {
  return (
    <div
      className={`w-full md:w-1/2 p-6 md:p-12 lg:p-20 flex flex-col justify-center items-center bg-gradient-to-b from-white to-orange-50 ${className}`}
    >
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-center">
        {title}
      </h1>
      <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-8"></div>
      {children}
    </div>
  );
};

export default FormContainer;
