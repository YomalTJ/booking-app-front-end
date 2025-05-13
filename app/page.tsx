import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

const Home = () => {
  return (
    <div className="w-full bg-navy-900">
      <div className="container mx-auto px-4 md:px-10 py-16 md:py-14">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-gray-400 mb-4">
          <Link href="/" className="hover:text-blue-400 transition-colors">
            <span className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </span>
          </Link>
          <span>/</span>
          <Link
            href="/calendar-view"
            className="hover:text-blue-400 transition-colors"
          >
            <span className="text-gray-400 hover:text-blue-400">
              ROOM BOOKING
            </span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-6">
              Make better use of your space with meeting room booking
            </h1>
            <p className="text-xl md:text-2xl mb-10">
              Simplify scheduling and book the ideal room for any meeting.
            </p>
          </div>

          {/* Right Content - Image */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="w-full h-full overflow-hidden rounded-full border-4 border-white">
                <Image
                  src="/Home/bg.jpg"
                  alt="Meeting room with people discussing"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
