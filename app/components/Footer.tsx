import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Mail, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, YouTubeIcon } from "./SocialIcons";
import { CONTACT } from "../lib/contact";

const socials = [
  {
    title: "facebook",
    label: "AeroMat na Facebooku",
    Icon: FacebookIcon,
    link: "https://www.facebook.com/aeromat1",
  },
  {
    title: "instagram",
    label: "AeroMat na Instagramie",
    Icon: InstagramIcon,
    link: "https://www.instagram.com/aeromat1/",
  },
  {
    title: "youtube",
    label: "Kanał AeroMat na YouTube",
    Icon: YouTubeIcon,
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
          <div className="flex flex-col w-full justify-center items-center text-center">
            <h3 className="font-bold text-lg mb-4 text-white">Kontakt</h3>
            <address className="not-italic text-white/80 space-y-2">
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex items-center justify-center gap-2 hover:text-[#ff7302] transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span>{CONTACT.email}</span>
              </a>
              <a
                href={`tel:${CONTACT.phoneTel}`}
                className="flex items-center justify-center gap-2 hover:text-[#ff7302] transition-colors"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>{CONTACT.phoneDisplay}</span>
              </a>
            </address>
          </div>
          <div className="flex flex-col w-full justify-center items-center text-center ">
            <h3 className="font-bold text-lg mb-4 text-white">Obserwuj mnie!</h3>
            <div className="flex space-x-4">
              {socials.map((social, index) => {
                const Icon = social.Icon;
                return (
                  <Link
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-white hover:text-white/70 transition-colors"
                  >
                    <Icon className="w-8 h-8" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className=" mt-8 pt-8 text-center text-white">
          <p>© {new Date().getFullYear()} AeroMat</p>
          <p className="flex flex-wrap items-center justify-center gap-1.5 text-sm">
            Stworzone przez
            <Link
              href="https://www.linkedin.com/in/automate/"
              aria-label="AutoMate"
              className="inline-flex items-center transition-opacity hover:opacity-70"
            >
              <Image
                src="/logo/automate_white_trim.webp"
                alt="AutoMate"
                width={1042}
                height={97}
                className="h-2 w-auto"
              />
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
