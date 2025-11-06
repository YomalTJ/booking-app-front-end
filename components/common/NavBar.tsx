"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import Image from "next/image";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileUserMenuOpen, setIsMobileUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    companyName: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsDropdownOpen(false);
    router.push("/auth/login");
  };

  if (pathname?.includes("/auth")) return null;

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
    setIsMobileUserMenuOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="w-full bg-white shadow-sm py-4 px-6 border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <div className="w-32 h-12 bg-orange-50 rounded flex items-center justify-center hover:bg-orange-100 transition-colors">
            <Image
              src="/NavBar/cropped-co-wrking-social-logo-copy.png"
              alt="Logo"
              width={120}
              height={40}
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
          <Link
            href="/dashboard"
            className={`text-sm font-medium transition-colors ${
              pathname === "/dashboard"
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-600 hover:text-orange-600"
            }`}
          >
            My Bookings
          </Link>
        </div>

        {/* Desktop CTA and User Menu */}
        <div className="hidden lg:flex items-center space-x-6">
          {!isLoading && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-orange-50 transition-colors focus:outline-none"
                aria-label="User menu"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {getInitials(user?.name || "User")}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || "User"}
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-lg shadow-lg py-1 z-50 border border-orange-100">
                  <div className="px-4 py-3 border-b border-orange-100 bg-orange-50">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {getInitials(user?.name || "User")}
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-800 font-medium text-sm">
                          {user?.name || "User"}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {user?.email || "user@user.com"}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          {user?.companyName || "Company"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/settings/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="px-4 py-3 text-gray-700 hover:bg-orange-50 flex items-center text-sm border-b border-gray-100 transition-colors"
                  >
                    <FaCog className="mr-3 text-orange-500" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-red-50 flex items-center text-sm transition-colors"
                  >
                    <FaSignOutAlt className="mr-3 text-red-500" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => router.push("/auth/login")}
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-full transition-colors shadow-sm"
            >
              Get Started
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <button
            className="text-gray-600 text-2xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-4 bg-gradient-to-b from-orange-50 to-white rounded-lg shadow-sm px-4 py-4 space-y-4">
          <Link
            href="/dashboard"
            onClick={handleMobileLinkClick}
            className={`block text-sm font-medium transition-colors ${
              pathname === "/dashboard"
                ? "text-orange-600"
                : "text-gray-600 hover:text-orange-600"
            }`}
          >
            Dashboard
          </Link>

          {/* User Menu for Mobile */}
          {!isLoading && user ? (
            <>
              <button
                onClick={() => setIsMobileUserMenuOpen(!isMobileUserMenuOpen)}
                className="w-full flex items-center text-gray-700 font-medium mt-3 pt-3 border-t border-orange-200"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {getInitials(user?.name || "User")}
                </div>
                <span className="ml-2">{user?.name || "User"}</span>
              </button>

              {isMobileUserMenuOpen && (
                <div className="ml-5 space-y-3 pb-3 bg-orange-50 rounded p-3">
                  <div className="text-xs text-gray-600">
                    <p className="font-medium">{user?.email}</p>
                    <p>{user?.companyName}</p>
                  </div>
                  <Link
                    href="/settings/profile"
                    onClick={handleMobileLinkClick}
                    className="flex items-center text-gray-600 text-sm hover:text-orange-600"
                  >
                    <FaCog className="mr-2 text-orange-500" /> Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      handleMobileLinkClick();
                    }}
                    className="flex items-center text-red-600 text-sm hover:text-red-700"
                  >
                    <FaSignOutAlt className="mr-2 text-red-500" /> Log out
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="mt-4 pt-4 border-t border-orange-200">
              <button
                onClick={() => {
                  router.push("/auth/login");
                  handleMobileLinkClick();
                }}
                className="w-full px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-full transition-colors"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
