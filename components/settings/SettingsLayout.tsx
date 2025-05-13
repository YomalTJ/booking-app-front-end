"use client";

import React, { ReactNode } from "react";
import SettingsSidebar from "./SettingsSidebar";

interface SettingsLayoutProps {
  children: ReactNode;
  activeTab: "profile" | "password";
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({
  children,
  activeTab,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-700 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
        {/* Settings Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-300 mt-2">
            Manage your profile and account settings
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <SettingsSidebar activeTab={activeTab} />

          {/* Content Area */}
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
