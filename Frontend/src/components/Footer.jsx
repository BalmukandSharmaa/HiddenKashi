import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Swagatam Kashi</h3>
            <p className="text-gray-400 text-sm">
              Your trusted partner for hotel and tour bookings in Varanasi and beyond.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <FiFacebook />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FiTwitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FiInstagram />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/hotels" className="text-gray-400 hover:text-white">
                  Hotels
                </Link>
              </li>
              <li>
                <Link to="/tours" className="text-gray-400 hover:text-white">
                  Tours
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">For Business</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/register" className="text-gray-400 hover:text-white">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link to="/owner/dashboard" className="text-gray-400 hover:text-white">
                  Owner Dashboard
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-white">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center">
                <FiMapPin className="mr-2" />
                Varanasi, Uttar Pradesh
              </li>
              <li className="flex items-center">
                <FiPhone className="mr-2" />
                +91 9876543210
              </li>
              <li className="flex items-center">
                <FiMail className="mr-2" />
                info@swagatamkashi.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Swagatam Kashi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
