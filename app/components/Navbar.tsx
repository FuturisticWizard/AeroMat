"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import { Menu, X, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAudio } from "@/app/context/AudioContext";

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  items?: NavItem[];
}

const defaultItems: NavItem[] = [
  //   { label: "Home", href: "#home" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Kontakt", href: "/kontakt" },
];

const Navbar = ({ items = defaultItems }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { muted, toggleMute } = useAudio();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-sm transition-all duration-300 overflow-hidden border-b border-neutral-800",
        isScrolled ? "shadow-lg shadow-black/50" : "",
        "z-[100]",
      )}
    >
      <div className="max-w-7xl mx-auto  px-3 md:px-4 lmd:px-2 lg:px-0  z-[110] ">
        <div className="flex items-center justify-between h-20 ">
          {/* Logo */}
          <div className="flex-shrink-0  z-[120]">
            <Link href="/">
              <Image
                src="/images/logo-horizontal-black2.png"
                width={175}
                height="0"
                style={{ height: "auto" }}
                alt="Logo"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center z-5">
            <div className="ml-10 flex items-center space-x-8">
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-[#ff7302] hover:text-orange-400 transition-colors duration-200"
                >
                  {item.label}
                </a>
              ))}
            </div>
            {/* Sound Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              className="ml-6 rounded-full h-10 w-10 bg-neutral-800 hover:bg-[#ff7302] text-white hover:text-white transition-colors"
              onClick={toggleMute}
              aria-label={muted ? "Włącz dźwięk" : "Wycisz"}
            >
              {muted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Sound Toggle Button - Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 bg-neutral-800 hover:bg-[#ff7302] text-white hover:text-white transition-colors"
              onClick={toggleMute}
              aria-label={muted ? "Włącz dźwięk" : "Wycisz"}
            >
              {muted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
            <Button
              className="text-white hover:text-[#ff7302]"
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6 " />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={isMobileMenuOpen ? "open" : "closed"}
        variants={{
          open: { height: "auto", opacity: 1 },
          closed: { height: 0, opacity: 0 },
        }}
        className="md:hidden overflow-hidden z-[120]"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block px-3 py-2 text-base font-medium text-white hover:text-[#ff7302] hover:bg-neutral-800/80 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          {/* <div className="px-3 py-2">
            <Button className="w-full">Get Started</Button>
          </div> */}
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
