/* eslint-disable no-unused-vars */
"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";

import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export const FloatingNav = ({ navItems, className }) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Show nav whenever scroll is beyond 5%
    setVisible(current > 0.05);
  });

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "flex flex-col sm:flex-row max-w-fit fixed top-2 sm:top-10 inset-x-0 mx-2 sm:mx-auto border border-transparent dark:border-white/[0.2] rounded-lg sm:rounded-full dark:bg-[#070045] bg-white shadow-md z-[5000] sm:px-4 sm:py-2 px-3 py-3 items-center justify-center gap-3 sm:gap-0 sm:space-x-4",
            className
          )}
        >
          {navItems?.map((navItem, idx) => (
            <Link
              key={`link-${idx}`}
              to={navItem.link}
              className={cn(
                "relative hidden sm:flex items-center text-sm sm:text-sm font-medium dark:text-neutral-50 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500 px-3 py-2 transition"
              )}
            >
              {navItem.name}
            </Link>
          ))}

          <Link
            to="/user/community"
            className="hidden sm:flex border text-xs sm:text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full hover:bg-white/10 transition"
          >
            Community
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
          </Link>
          {/* Mobile Hamburger */}
          <div className="sm:hidden flex items-center">
            <button onClick={() => setMenuOpen((p) => !p)}>
              {menuOpen ? '' : <Menu size={24} />}
            </button>
          </div>

        <AnimatePresence mode="wait">
        {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "sm:hidden flex flex-col sm:flex-row max-w-fit fixed top-2 sm:top-10 inset-x-0 mx-2 sm:mx-auto border border-transparent dark:border-white/[0.2] rounded-lg sm:rounded-full dark:bg-[#070045] bg-white shadow-md z-[5000] sm:px-4 sm:py-2 px-14 py-4 items-center justify-center gap-3 sm:gap-0 sm:space-x-4",
            className
          )}
        >
          <div className={menuOpen ? 'sm:hidden flex items-center mt-4' : 'hidden'}>
            <button onClick={() => setMenuOpen((p) => !p)}>
              {menuOpen ? <X size={24} /> : ''}
            </button>
          </div>
          {navItems?.map((navItem, idx) => (
            <Link
              key={`link-${idx}`}
              to={navItem.link}
              className={cn(
                "relative flex items-center text-sm sm:text-sm font-medium dark:text-neutral-50 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500 px-3 py-2 transition"
              )}
            >
              {navItem.name}
            </Link>
          ))}

          <Link
            to="/user/community"
            className="border text-xs sm:text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full hover:bg-white/10 transition"
          >
            Community
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  );
};
