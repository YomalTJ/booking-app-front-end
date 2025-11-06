"use client";

import React, { useState } from "react";
import { FaExclamationTriangle, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth-service";
import { toast } from "react-hot-toast";

const DeleteAccountSection = () => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you absolutely sure? This action cannot be undone. All your bookings will be permanently deleted."
    );

    if (!confirmed) return;

    const doubleConfirmed = window.confirm(
      "Type 'DELETE' to confirm permanent account deletion."
    );

    if (!doubleConfirmed) return;

    setIsDeleting(true);
    try {
      await authService.deleteAccount();
      // Redirect to login after deletion
      setTimeout(() => {
        router.push("/auth/login");
      }, 1000);
    } catch (error) {
      console.error("Failed to delete account:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mt-16 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Delete Account</h2>
      <p className="text-gray-600 mb-6">
        Delete your account and all of its resources permanently
      </p>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center mb-3">
          <FaExclamationTriangle className="mr-2 text-red-600" />
          <h3 className="font-bold text-red-600">Warning</h3>
        </div>
        <p className="text-red-700 mb-4">
          Please proceed with caution. This action is permanent and cannot be
          undone:
        </p>
        <ul className="list-disc list-inside text-red-700 mb-4 space-y-1">
          <li>Your account will be deleted</li>
          <li>All your bookings will be permanently removed</li>
          <li>Your data cannot be recovered</li>
        </ul>
        <button
          onClick={handleDeleteAccount}
          disabled={isDeleting}
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 cursor-pointer disabled:cursor-not-allowed"
        >
          <FaTrash />
          {isDeleting ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </div>
  );
};

export default DeleteAccountSection;
