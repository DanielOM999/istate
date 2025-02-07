"use client";

import { useState, useRef } from 'react'
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FaClipboardList } from "react-icons/fa";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  return (
    <header className='fixed top-0 z-50 w-full border-b border-white/10 bg-top/25 backdrop-blur-md'>
    <nav className="flex flex-row justify-between mx-10 my-4">
      <div className="flex items-center text-3xl">
        <FaClipboardList className="mr-1 rotate-[-10deg]" />
        <h1>Istate</h1>
      </div>
      <div className="flex-col text-3xl">
        <div className="hidden md:flex ">
          <div className="flex gap-6">
            {["Home", "List", "About"].map((item, index) => (
              <div key={item}>
                <Link
                  href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="transition-colors text-2xl"
                >
                  {item}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className='relative md:hidden'>
            <motion.button
              className='text-white'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? (
                <X className='h-10 w-10 mt-2' />
              ) : (
                <Menu className='h-10 w-10 mt-2' />
              )}
            </motion.button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  className='absolute right-0 top-full mt-2 w-36 rounded-md bg-primary/30 p-4 shadow-lg backdrop-blur-md'
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  ref={menuRef}
                >
                  <div className='flex flex-col gap-4 text-center text-2xl'>
                    {["Home", "List", "About"].map(
                      (item) => (
                        <div key={item}>
                          <Link
                            href={
                              item === 'Home' ? '/' : `/${item.toLowerCase()}`
                            }
                            className='transition-colors hover:text-secondary'
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item}
                          </Link>
                        </div>
                      )
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
      </div>
    </nav>
    </header>
  );
}