"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      console.log("scrolling!");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed  top-0 left-0 right-0 bg-white transition-all duration-300 overflow-hidden shadow-lg",
        isScrolled ? "shadow-lg" : "",
        "z-50",
      )}
    >
      <div className="max-w-6xl mx-auto  px-3 md:px-4 lmd:px-2 lg:px-0  z-50 ">
        <div className="flex items-center justify-between h-20 ">
          {/* Logo */}
          <div className="flex-shrink-0  z-50">
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
          <div className="hidden md:block z-5">
            <div className="ml-10 flex items-center space-x-8">
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-foreground/70 hover:text-primary transition-colors duration-200"
                >
                  {item.label}
                </a>
              ))}
              {/* <Button>Zacznij współprace</Button> */}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden ">
            <Button
              className=""
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
        className="md:hidden overflow-hidden z-50"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 ">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block px-3 py-2 text-base font-medium text-foreground/70 hover:text-primary hover:bg-primary/10 rounded-md"
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
