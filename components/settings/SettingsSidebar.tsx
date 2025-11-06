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
      <nav className="space-y-2 bg-white rounded-lg shadow-md p-4">
        <Link href="/settings/profile" passHref>
          <button
            className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition ${
              activeTab === "profile"
                ? "bg-orange-100 text-orange-700 border-l-4 border-orange-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FaUser className="mr-3" />
            Profile
          </button>
        </Link>
        <Link href="/settings/password" passHref>
          <button
            className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition ${
              activeTab === "password"
                ? "bg-orange-100 text-orange-700 border-l-4 border-orange-600"
                : "text-gray-700 hover:bg-gray-100"
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
