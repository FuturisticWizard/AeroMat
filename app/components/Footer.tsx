import Image from "next/image";
import Link from "next/link";
import React from "react";

const socials = [
  {
    title: "facebook",
    icon: "/icons/icons8-facebook-100.png",
    link: "https://www.facebook.com/aeromat1",
  },
  {
    title: "instagram",
    icon: "/icons/icons8-instagram-100.png",
    link: "https://www.instagram.com/aeromat1/",
  },
  {
    title: "youtube",
    icon: "/icons/icons8-youtube-100.png",
    link: "https://www.youtube.com/@AeroMat1/",
  },
];

const Footer = () => {
  return (
    <footer className="bg-[#FF7300] py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex w-full justify-center items-center">
            <div className="relative w-48 h-20">
              <Image
                src="/images/logo-horizontal-black2.png"
                alt="logo-aeromat"
                fill
                object-fit="cover"
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
                  className=" text-muted-foreground hover:text-foreground "
                >
                  <div className="relative w-16 h-16">
                    <Image src={social.icon} alt={social.title} fill />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className=" mt-8 pt-8 text-center text-white">
          <p>© {new Date().getFullYear()} Aeromat. All rights reserved.</p>
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
