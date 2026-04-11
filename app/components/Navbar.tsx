"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import { Menu, X, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAudio } from "@/app/context/AudioContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  items?: NavItem[];
}

const defaultItems: NavItem[] = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "Filmy", href: "/#w-akcji" },
  { label: "O mnie", href: "/#o-mnie" },
  { label: "Kontakt", href: "/kontakt" },
];

const socials = [
  { title: "facebook", icon: faFacebookF, link: "https://www.facebook.com/aeromat1" },
  { title: "instagram", icon: faInstagram, link: "https://www.instagram.com/aeromat1/" },
  { title: "youtube", icon: faYoutube, link: "https://www.youtube.com/@AeroMat1/" },
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
        "fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-sm transition-all duration-300 border-b border-neutral-800",
        isScrolled ? "shadow-lg shadow-black/50" : "",
        "z-[100]",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 z-[110]">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
          {/* Left — Logo */}
          <div className="flex-shrink-0 z-[120]">
            <Link href="/">
              <Image
                src="/images/logo-horizontal-black2.webp"
                width={175}
                height={0}
                style={{ height: "auto" }}
                alt="Logo"
                className="w-[130px] sm:w-[150px] md:w-[175px]"
              />
            </Link>
          </div>

          {/* Center — Navigation (desktop) */}
          <div className="hidden md:flex items-center justify-center space-x-8 flex-1">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gray-300 hover:text-[#ff7302] transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right — Social Media Icons + Sound (desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {socials.map((social) => (
              <Link
                key={social.title}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#ff7302] transition-colors duration-200"
                aria-label={social.title}
              >
                <FontAwesomeIcon icon={social.icon} className="w-5 h-5" />
              </Link>
            ))}
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
          </div>

          {/* Mobile — Sound + Hamburger */}
          <div className="md:hidden flex items-center gap-2">
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
              className="text-white hover:text-[#ff7302] hover:bg-transparent focus-visible:ring-0 z-[130] relative"
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileMenuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.span>
                )}
              </AnimatePresence>
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
        <div className="px-4 pt-3 pb-4 space-y-1">
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
          {/* Social media icons in mobile menu */}
          <div className="flex items-center space-x-4 px-3 pt-3 border-t border-neutral-700 mt-2">
            {socials.map((social) => (
              <Link
                key={social.title}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#ff7302] transition-colors duration-200"
                aria-label={social.title}
              >
                <FontAwesomeIcon icon={social.icon} className="w-5 h-5" />
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
