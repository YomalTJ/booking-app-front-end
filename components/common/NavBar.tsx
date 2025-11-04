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
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

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
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  if (pathname?.includes("/auth")) return null;

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
    setIsMobileUserMenuOpen(false);
  };

  return (
    <nav className="w-full bg-white shadow-sm py-4 px-6 border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <div className="w-32 h-12 bg-gray-200 rounded flex items-center justify-center">
            <Image
              src="/NavBar/cropped-co-wrking-social-logo-copy.png"
              alt="Logo"
              width={120}
              height={40}
              className="object-contain"
            />
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
          {/* <Link
            href="/calendar-view"
            className={`text-sm font-medium transition-colors ${
              pathname === "/calendar-view"
                ? "text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Calendar View
          </Link> */}
          <Link
            href="/dashboard"
            className={`text-sm font-medium transition-colors ${
              pathname === "/dashboard"
                ? "text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            My Bookings
          </Link>
        </div>

        {/* Desktop CTA and User Menu */}
        <div className="hidden lg:flex items-center space-x-6">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-center focus:outline-none"
                aria-label="User menu"
              >
                <FaUserCircle className="text-gray-400 text-2xl hover:text-gray-600 transition-colors" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="bg-orange-100 rounded-full w-10 h-10 flex items-center justify-center">
                        <span className="font-medium text-orange-600">
                          {user?.name?.charAt(0) || "U"}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-800 font-medium text-sm">
                          {user?.name || "User"}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {user?.email || "user@user.com"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/settings/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="px-4 py-3 text-gray-700 hover:bg-gray-50 flex items-center text-sm border-b border-gray-100 transition-colors"
                  >
                    <FaCog className="mr-3 text-gray-400" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 flex items-center text-sm transition-colors"
                  >
                    <FaSignOutAlt className="mr-3 text-gray-400" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => router.push("/auth/login")}
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-full transition-colors"
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
        <div className="lg:hidden mt-4 bg-gray-50 rounded-lg shadow-sm px-4 py-4 space-y-4">
          {/* <Link
            href="/calendar-view"
            onClick={handleMobileLinkClick}
            className={`block text-sm font-medium transition-colors ${
              pathname === "/calendar-view"
                ? "text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Calendar View
          </Link> */}
          <Link
            href="/dashboard"
            onClick={handleMobileLinkClick}
            className={`block text-sm font-medium transition-colors ${
              pathname === "/dashboard"
                ? "text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Dashboard
          </Link>

          {/* User Menu for Mobile */}
          {user ? (
            <>
              <button
                onClick={() => setIsMobileUserMenuOpen(!isMobileUserMenuOpen)}
                className="w-full flex items-center text-gray-700 font-medium mt-3 pt-3 border-t border-gray-200"
              >
                <FaUserCircle className="mr-2 text-xl text-gray-400" />
                {user?.name || "User"}
              </button>

              {isMobileUserMenuOpen && (
                <div className="ml-5 space-y-3 pb-3">
                  <Link
                    href="/settings/profile"
                    onClick={handleMobileLinkClick}
                    className="flex items-center text-gray-600 text-sm"
                  >
                    <FaCog className="mr-2 text-gray-400" /> Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      handleMobileLinkClick();
                    }}
                    className="flex items-center text-gray-600 text-sm"
                  >
                    <FaSignOutAlt className="mr-2 text-gray-400" /> Log out
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  router.push("/auth/login");
                  handleMobileLinkClick();
                }}
                className="w-full px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-full transition-colors"
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
