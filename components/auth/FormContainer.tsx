import React, { ReactNode } from "react";

interface FormContainerProps {
  title: string;
  children: ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({ title, children }) => {
  return (
    <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-20 flex flex-col justify-center items-center">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
        {title}
      </h1>
      {children}
    </div>
  );
};

export default FormContainer;
