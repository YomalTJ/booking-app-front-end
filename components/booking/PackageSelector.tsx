"use client";

import React from "react";

interface PackageSelectorProps {
  selectedPackage: string;
  setSelectedPackage: (value: string) => void;
}

const PackageSelector: React.FC<PackageSelectorProps> = ({
  selectedPackage,
  setSelectedPackage,
}) => {
  // Sample packages
  const packages = [
    { id: 1, name: "Basic Workspace" },
    { id: 2, name: "Premium Workspace" },
    { id: 3, name: "Executive Suite" },
    { id: 4, name: "Meeting Room" },
    { id: 5, name: "Conference Hall" },
  ];

  return (
    <div className="mb-6">
      <label className="block text-white text-lg mb-2">Select Package</label>
      <select
        value={selectedPackage}
        onChange={(e) => setSelectedPackage(e.target.value)}
        className="w-full p-3 bg-gray-600 bg-opacity-50 text-white border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5995fd] appearance-none cursor-pointer"
        required
      >
        <option value="">-- Select Package --</option>
        {packages.map((pkg) => (
          <option key={pkg.id} value={pkg.id}>
            {pkg.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PackageSelector;
