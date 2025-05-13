"use client";

import React from "react";
import { FaUser, FaLock } from "react-icons/fa";
import Link from "next/link";

interface SettingsSidebarProps {
  activeTab: "profile" | "password";
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ activeTab }) => {
  return (
    <div className="w-full md:w-64 flex-shrink-0">
      <nav className="space-y-1">
        <Link href="/settings/profile" passHref>
          <button
            className={`w-full flex items-center px-4 py-3 rounded-md font-medium transition ${
              activeTab === "profile"
                ? "bg-white text-gray-800"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            <FaUser className="mr-3" />
            Profile
          </button>
        </Link>
        <Link href="/settings/password" passHref>
          <button
            className={`w-full flex items-center px-4 py-3 rounded-md font-medium transition ${
              activeTab === "password"
                ? "bg-white text-gray-800"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            <FaLock className="mr-3" />
            Password
          </button>
        </Link>
      </nav>
    </div>
  );
};

export default SettingsSidebar;
