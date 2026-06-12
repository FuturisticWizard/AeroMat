"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MessageCircle, X } from "lucide-react";

/* Panel (wraz z baza FAQ i logika) laduje sie dopiero po pierwszym kliknieciu
   w przycisk — zero wplywu na poczatkowe ladowanie strony. */
const ChatPanel = dynamic(() => import("./ChatPanel"), { ssr: false });

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);

  const toggle = () => {
    setOpen((o) => !o);
    setEverOpened(true);
  };

  return (
    <>
      {everOpened && open && <ChatPanel onClose={() => setOpen(false)} />}
      <button
        type="button"
        onClick={toggle}
        aria-label={open ? "Zamknij czat" : "Otwórz czat z pytaniami"}
        aria-expanded={open}
        className="fixed bottom-5 right-4 z-[96] flex h-14 w-14 items-center justify-center rounded-full bg-[#ff7302] text-white shadow-lg transition hover:scale-105 hover:bg-[#e76700] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </>
  );
};

export default ChatWidget;
