'use client'

import Link from 'next/link'
import { FaGithub, FaLinkedin, FaFacebook, FaTwitter } from 'react-icons/fa'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="inline-block">
              <Logo />
            </Link>
            <p className="mt-4 text-gray-400">
              Complete micro tasks and earn money. Join thousands of workers and buyers on our platform.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-400 hover:text-primary-400 transition">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-400 hover:text-primary-400 transition">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition text-2xl"
              >
                <FaGithub />
              </a>
              <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition text-2xl"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://facebook.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition text-2xl"
              >
                <FaFacebook />
              </a>
              <a
                href="https://twitter.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition text-2xl"
              >
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} MicroTask. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

