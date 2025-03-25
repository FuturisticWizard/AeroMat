import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-muted py-12 px-4">
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-4">Aeromat</h3>
          <p className="text-muted-foreground">
            Profesjonalne usługi fotograficzne uwieczniające ważne chwile od 2010 roku.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4">Dane Kontaktowe</h3>
          <address className="not-italic text-muted-foreground">
            <p>123 Photography Lane</p>
            <p>New York, NY 10001</p>
            <p className="mt-2">info@companyphotos.com</p>
            <p>(555) 123-4567</p>
          </address>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4">Śledź Nas!</h3>
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
      <div className=" mt-8 pt-8 text-center text-muted-foreground">
        <p>© {new Date().getFullYear()} Aeromat. All rights reserved.</p>
      </div>
    </div>
  </footer>
  )
}

export default Footer
