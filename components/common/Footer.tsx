import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaFacebookF,
  FaYoutube,
  FaTiktok,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  const pathname = usePathname();

  if (pathname?.includes("/auth")) return null;

  return (
    <footer className="w-full bg-[#10375c] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-52">
          {/* Left Section - Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl lg:text-4xl font-bold">Coworking Cube</h2>
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Beta Version 1.0.0
              </span>
            </div>
            <p className="text-gray-300 text-sm lg:text-base leading-relaxed max-w-xl">
              Affordable coworking spaces near Colombo for startups,
              freelancers, and small businesses. Flexible coworking space Sri
              Lanka, meeting rooms, and private offices spaces – your top choice
              for coworking spaces near Colombo.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://www.facebook.com/profile.php?id=61560752141175"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF className="text-white text-lg" />
              </a>
              <a
                href="https://www.youtube.com/@coworkingcube"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube className="text-white text-lg" />
              </a>
              <a
                href="https://www.tiktok.com/@coworkingcube"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center transition-colors"
                aria-label="TikTok"
              >
                <FaTiktok className="text-white text-lg" />
              </a>
              <a
                href="https://www.instagram.com/coworkcub/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="text-white text-lg" />
              </a>
              <a
                href="https://www.linkedin.com/company/coworking-cube/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-700 hover:bg-blue-800 rounded flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="text-white text-lg" />
              </a>
            </div>
          </div>

          {/* Right Section - Contact Info */}
          <div className="space-y-6">
            <h3 className="text-2xl lg:text-3xl font-bold">Contact Us</h3>
            <div className="space-y-4 text-gray-300">
              <div>
                <p className="text-sm text-gray-400 mb-1">Email</p>
                <a
                  href="mailto:hello@coworkingcube.lk"
                  className="text-base lg:text-lg hover:text-orange-400 transition-colors"
                >
                  E: hello@coworkingcube.lk
                </a>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Address</p>
                <p className="text-base lg:text-lg">
                  A: No 26/4 Hospital Road, Pannipitiya 10230
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Phone</p>
                <a
                  href="tel:+94707989891"
                  className="text-base lg:text-lg hover:text-orange-400 transition-colors"
                >
                  P: +94 707 98 98 91
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
