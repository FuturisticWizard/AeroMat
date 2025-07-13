"use client";

import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';

interface CallButtonPortalProps {
  phoneNumber?: string;
}

const CallButtonPortal: React.FC<CallButtonPortalProps> = ({
  phoneNumber = "+48780428883"
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const buttonContent = (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.6, type: "spring" }}
      className="fixed bottom-6 right-6 sm:hidden"
      style={{ 
        zIndex: 99999,
        position: 'fixed',
        isolation: 'isolate'
      }}
    >
      <a
        href={`tel:${phoneNumber}`}
        className="flex items-center justify-center w-14 h-14 bg-[#FE9100] text-white rounded-full shadow-lg hover:bg-[#e87f00] hover:scale-110 transition-all duration-300 active:scale-95"
        aria-label="Zadzwoń: +48 780 428 883"
      >
        <Phone className="w-6 h-6" />
      </a>
    </motion.div>
  );

  return createPortal(buttonContent, document.body);
};

export default CallButtonPortal; 