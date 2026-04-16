"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import { Menu, X, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAudio } from "@/app/context/AudioContext";
import { FacebookIcon, InstagramIcon, YouTubeIcon } from "./SocialIcons";

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  items?: NavItem[];
}

const defaultItems: NavItem[] = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "Filmy", href: "/filmy" },
  { label: "O mnie", href: "/o-mnie" },
  { label: "Kontakt", href: "/kontakt" },
];

const socials = [
  { title: "facebook", Icon: FacebookIcon, link: "https://www.facebook.com/aeromat1" },
  { title: "instagram", Icon: InstagramIcon, link: "https://www.instagram.com/aeromat1/" },
  { title: "youtube", Icon: YouTubeIcon, link: "https://www.youtube.com/@AeroMat1/" },
];

const Navbar = ({ items = defaultItems }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { muted, toggleMute } = useAudio();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll target to top of viewport with navbar offset (so heading isn't hidden)
  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const top = window.scrollY + rect.top - 100;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  // After navigating to /, scroll to the hash if present
  useEffect(() => {
    if (pathname === "/" && window.location.hash) {
      const id = window.location.hash.slice(1);
      // Small delay to let the page render/hydrate
      const timer = setTimeout(() => {
        scrollToId(id);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, scrollToId]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return; // Regular link, let browser handle

      const path = href.slice(0, hashIndex) || "/";
      const hash = href.slice(hashIndex + 1);

      if (pathname === path || (path === "/" && pathname === "/")) {
        // Same page — just scroll
        e.preventDefault();
        scrollToId(hash);
      } else {
        // Different page — navigate, hash will be picked up by the useEffect above
        e.preventDefault();
        router.push(href);
      }
    },
    [pathname, router, scrollToId]
  );

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
                src="/logo/logo-white.png"
                width={175}
                height={54}
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
                onClick={(e) => handleNavClick(e, item.href)}
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
                <social.Icon className="w-5 h-5" />
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
              aria-label={isMobileMenuOpen ? "Zamknij menu" : "Otwórz menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
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
        id="mobile-menu"
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
              onClick={(e) => {
                handleNavClick(e, item.href);
                setIsMobileMenuOpen(false);
              }}
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
                <social.Icon className="w-5 h-5" />
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
