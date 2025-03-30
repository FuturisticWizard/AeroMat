import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-[#FF7300] py-12 px-4">
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className='relative w-32 h-20' >
          <Image src='/logo-horizontal.png' alt='logo-aeromat' fill object-fit='cover'/>
          </div>

          <p className="text-white">
            Profesjonalne malarstwo  uwieczniające ważne chwile od 2010 roku.
          </p>
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
        <div>
          <h3 className="font-bold text-lg mb-4 text-white">Śledź Nas!</h3>
          <div className="flex space-x-4">
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              Instagram
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              Facebook
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              Twitter
            </Link>
          </div>
        </div>
      </div>
      <div className=" mt-8 pt-8 text-center text-white">
        <p>© {new Date().getFullYear()} Aeromat. All rights reserved.</p>
        <p>Icons by <span className='underline'>icons8</span></p>
      </div>
    </div>
  </footer>
  )
}

export default Footer
