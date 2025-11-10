import React from "react";
import Link from "next/link";
import { Users, Rocket, Building2, Sparkles } from "lucide-react";

interface BlueContainerProps {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  imageSrc: string; // Keeping for backward compatibility, but we'll use icon instead
  icon?: "users" | "rocket" | "building" | "sparkles"; // New prop for icon selection
}

const BlueContainer: React.FC<BlueContainerProps> = ({
  title,
  subtitle,
  buttonText,
  buttonLink,
  imageSrc,
  icon = "users", // Default icon
}) => {
  // Icon mapping
  const iconConfig = {
    users: {
      component: Users,
      color: "text-white",
      size: 120,
    },
    rocket: {
      component: Rocket,
      color: "text-white",
      size: 120,
    },
    building: {
      component: Building2,
      color: "text-white",
      size: 120,
    },
    sparkles: {
      component: Sparkles,
      color: "text-white",
      size: 120,
    },
  };

  const SelectedIcon = iconConfig[icon].component;
  const iconSize = iconConfig[icon].size;

  return (
    <div
      className="w-full md:w-1/2 text-white flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>

      <div className="max-w-md text-center mb-6 relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm md:text-base text-orange-100">{subtitle}</p>
        )}
      </div>

      <Link href={buttonLink}>
        <button className="px-8 py-3 rounded-full border-2 border-white text-white hover:bg-white hover:text-orange-600 transition duration-300 cursor-pointer font-medium shadow-lg hover:shadow-xl">
          {buttonText}
        </button>
      </Link>

      <div className="mt-12 w-full max-w-md relative z-10 flex justify-center">
        <div className="p-8 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
          <SelectedIcon
            size={iconSize}
            className={iconConfig[icon].color}
            strokeWidth={1.5}
          />
        </div>
      </div>
    </div>
  );
};

export default BlueContainer;
