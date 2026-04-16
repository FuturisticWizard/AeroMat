"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, YouTubeIcon } from "../components/SocialIcons";

const socials = [
  { title: "facebook", Icon: FacebookIcon, link: "https://www.facebook.com/aeromat1" },
  { title: "instagram", Icon: InstagramIcon, link: "https://www.instagram.com/aeromat1/" },
  { title: "youtube", Icon: YouTubeIcon, link: "https://www.youtube.com/@AeroMat1/" },
];

function FooterVariant({
  label,
  containerClass,
  textColor,
  mutedTextColor,
  logoSrc,
  hoverAccent = "#ff7302",
}: {
  label: string;
  containerClass: string;
  textColor: string;
  mutedTextColor: string;
  logoSrc: string;
  hoverAccent?: string;
}) {
  return (
    <div>
      <h2 className="text-white font-bold text-xl mb-3">{label}</h2>
      <footer className={`${containerClass} pt-24 md:pt-32 pb-12 px-4 rounded-xl overflow-hidden`}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex w-full justify-center items-center pt-8">
              <div className="relative w-56 h-20">
                <Image src={logoSrc} alt="logo-aeromat" fill className="object-contain" />
              </div>
            </div>

            <div className="flex flex-col w-full justify-center items-center text-center">
              <h3 className={`font-bold text-lg mb-4 ${textColor}`}>Kontakt</h3>
              <address className={`not-italic ${mutedTextColor} space-y-2`}>
                <a
                  href="mailto:kontakt@aeromat.pl"
                  className="flex items-center justify-center gap-2 transition-colors"
                  style={{ color: "inherit" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = hoverAccent)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>kontakt@aeromat.pl</span>
                </a>
                <a
                  href="tel:+48500123456"
                  className="flex items-center justify-center gap-2 transition-colors"
                  style={{ color: "inherit" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = hoverAccent)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>+48 500 123 456</span>
                </a>
              </address>
            </div>

            <div className="flex flex-col w-full justify-center items-center text-center">
              <h3 className={`font-bold text-lg mb-4 ${textColor}`}>Śledź Nas!</h3>
              <div className="flex space-x-4">
                {socials.map((social, index) => {
                  const Icon = social.Icon;
                  return (
                    <Link
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${textColor} hover:opacity-70 transition-opacity`}
                    >
                      <Icon className="w-8 h-8" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={`mt-8 pt-8 text-center ${textColor}`}>
            <p>© {new Date().getFullYear()} AeroMat. All rights reserved.</p>
            <p className="text-sm">
              Icons by{" "}
              <Link href="https://www.icons8.com" className="underline">
                icons8
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function FooterMockup() {
  return (
    <main className="min-h-screen bg-neutral-900 py-12 px-4 mt-20">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
            Footer — mockup wariantów gradientu
          </h1>
          <p className="text-gray-400 text-sm">
            Porównanie obecnego (czarny→brąz) z kilkoma wariantami jasnoszarymi
          </p>
        </header>

        <div className="space-y-10">
          <FooterVariant
            label="A) Obecny — black → dark brown (production)"
            containerClass="bg-gradient-to-b from-black to-[#2d1a0a]"
            textColor="text-white"
            mutedTextColor="text-white/80"
            logoSrc="/logo/logo-white.png"
          />

          <FooterVariant
            label="B) Light gray — gray-100 → gray-400 (very light)"
            containerClass="bg-gradient-to-b from-gray-100 to-gray-400"
            textColor="text-gray-900"
            mutedTextColor="text-gray-700"
            logoSrc="/logo/logo-black.jpg"
          />

          <FooterVariant
            label="C) Medium gray — neutral-300 → neutral-500"
            containerClass="bg-gradient-to-b from-neutral-300 to-neutral-500"
            textColor="text-neutral-900"
            mutedTextColor="text-neutral-800"
            logoSrc="/logo/logo-black.jpg"
          />

          <FooterVariant
            label="D) Soft gray — white → gray-300"
            containerClass="bg-gradient-to-b from-white to-gray-300"
            textColor="text-gray-900"
            mutedTextColor="text-gray-700"
            logoSrc="/logo/logo-black.jpg"
          />

          <FooterVariant
            label="E) Warm gray — stone-200 → stone-400"
            containerClass="bg-gradient-to-b from-stone-200 to-stone-400"
            textColor="text-stone-900"
            mutedTextColor="text-stone-700"
            logoSrc="/logo/logo-black.jpg"
          />
        </div>

        <div className="mt-16 max-w-3xl mx-auto text-gray-300 text-sm space-y-3">
          <h2 className="text-white text-lg font-bold">Uwagi</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Warianty B-E wymagają czarnego logo (<code>/logo/logo-black.png</code>) — jeśli takie istnieje</li>
            <li>Przejście z ciemnej sekcji (np. MuralsMap) do jasnego footera może być ostre — warto dodać pośrednią sekcję lub zmiękczyć gradient w górnej części</li>
            <li>Pomarańczowy akcent (<code>#ff7302</code>) dobrze kontrastuje zarówno z ciemnym jak i jasnym tłem</li>
            <li>Który wariant Ci się podoba? Podmienię w produkcji lub dostosujemy odcień/przejście</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
