import React, { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

interface BlueContainerProps {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  imageSrc: string;
}

const BlueContainer: React.FC<BlueContainerProps> = ({
  title,
  subtitle,
  buttonText,
  buttonLink,
  imageSrc,
}) => {
  return (
    <div
      className="w-full md:w-1/2 text-white flex flex-col items-center justify-center p-6 md:p-12 relative"
      style={{
        background: "linear-gradient(-45deg, #4481eb 0%, #04befe 100%)",
      }}
    >
      <div className="max-w-md text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
        {subtitle && <p className="text-sm md:text-base">{subtitle}</p>}
      </div>

      <Link href={buttonLink}>
        <button className="px-8 py-3 rounded-full border-2 border-white text-white hover:bg-white hover:text-blue-500 transition duration-300 cursor-pointer">
          {buttonText}
        </button>
      </Link>

      <div className="mt-8 w-full max-w-md">
        <Image
          src={imageSrc}
          alt="Auth illustration"
          width={500}
          height={400}
          className="w-full"
          priority
        />
      </div>
    </div>
  );
};

export default BlueContainer;
