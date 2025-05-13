"use client";

import React from "react";
import { FaExclamationTriangle, FaTrash } from "react-icons/fa";

const DeleteAccountSection = () => {
  const handleDeleteAccount = () => {
    // Handle account deletion
    console.log("Account deletion requested");
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-2 text-white">Delete account</h2>
      <p className="text-gray-300 mb-6">
        Delete your account and all of its resources
      </p>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-600">
        <div className="flex items-center mb-3">
          <FaExclamationTriangle className="mr-2" />
          <h3 className="font-bold">Warning</h3>
        </div>
        <p className="mb-4">
          Please proceed with caution, this cannot be undone.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center cursor-pointer"
        >
          <FaTrash className="mr-2" />
          Delete account
        </button>
      </div>
    </div>
  );
};

export default DeleteAccountSection;
