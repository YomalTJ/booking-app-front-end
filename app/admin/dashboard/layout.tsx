"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminService } from "@/services/adminService";
import { LogOut, Shield, User } from "lucide-react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [admin, setAdmin] = useState<{ name: string; username: string } | null>(
    null
  );

  useEffect(() => {
    if (!adminService.isAuthenticated()) {
      router.push("/admin/login");
      return;
    }

    const adminData = localStorage.getItem("admin");
    if (adminData) {
      setAdmin(JSON.parse(adminData));
    }
  }, [router]);

  const handleLogout = () => {
    adminService.logout();
    router.push("/admin/login");
  };

  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-xs text-gray-500">Meeting Room Management</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{admin.name}</p>
                  <p className="text-xs text-gray-500">@{admin.username}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
