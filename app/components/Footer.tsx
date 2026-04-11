"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";

const socials = [
  {
    title: "facebook",
    icon: faFacebookF,
    link: "https://www.facebook.com/aeromat1",
  },
  {
    title: "instagram",
    icon: faInstagram,
    link: "https://www.instagram.com/aeromat1/",
  },
  {
    title: "youtube",
    icon: faYoutube,
    link: "https://www.youtube.com/@AeroMat1/",
  },
];

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-black to-[#2d1a0a] pt-24 md:pt-48 pb-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex w-full justify-center items-center pt-12">
            <div className="relative w-64 h-24">
              <Image
                src="/logo/logo-white.png"
                alt="logo-aeromat"
                fill
                className="object-contain"
              />
            </div>
          </div>
          {/* <div>
          <h3 className="font-bold text-lg mb-4">Dane Kontaktowe</h3>
          <address className="not-italic text-muted-foreground">
            <p>123 Photography Lane</p>
            <p>New York, NY 10001</p>
            <p className="mt-2">info@companyphotos.com</p>
            <p>(555) 123-4567</p>
          </address>
        </div> */}
          <div className="flex flex-col w-full justify-center items-center text-center ">
            <h3 className="font-bold text-lg mb-4 text-white">Śledź Nas!</h3>
            <div className="flex space-x-4">
              {socials.map((social, index) => (
                <Link
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-white/70 transition-colors"
                >
                  <FontAwesomeIcon icon={social.icon} className="w-8 h-8" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className=" mt-8 pt-8 text-center text-white">
          <p>© {new Date().getFullYear()} Made by . All rights reserved.</p>
          <p>
            Icons by{" "}
            <Link href="https://www.icons8.com" className="underline">
              icons8
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
