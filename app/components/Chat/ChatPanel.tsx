"use client";

import { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";

import { FAQ_ENTRIES } from "../../lib/faq";
import { matchFaq } from "../../lib/faqMatch";
import { askAssistant } from "../../lib/chat";

interface ChatMessage {
  role: "user" | "bot";
  text: string;
  /* pytanie, ktore mozna doslac do asystenta AI */
  aiOffer?: string;
}

const WELCOME =
  "Cześć! Jestem botem AeroMat. Zapytaj o murale, szyldy, wycenę albo obszar działania — albo kliknij jedno z gotowych pytań.";

const QUICK_IDS = ["cena", "obszar", "czas", "uslugi"];

const ChatPanel = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "bot", text: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [aiPending, setAiPending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, aiPending]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const answerLocally = (question: string) => {
    const match = matchFaq(question, FAQ_ENTRIES);
    if (match.entry && match.confident) {
      setMessages((m) => [...m, { role: "bot", text: match.entry!.answer }]);
    } else if (match.entry) {
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: `${match.entry!.answer}\n\nJeśli nie o to chodziło — dopytaj asystenta AI.`,
          aiOffer: question,
        },
      ]);
    } else {
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: "Nie znalazłem gotowej odpowiedzi na to pytanie. Możesz zapytać asystenta AI albo napisać przez formularz na /kontakt.",
          aiOffer: question,
        },
      ]);
    }
  };

  const submit = (raw?: string) => {
    const question = (raw ?? input).trim();
    if (!question || aiPending) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: question }]);
    answerLocally(question);
  };

  const askAi = async (question: string) => {
    if (aiPending) return;
    setAiPending(true);
    try {
      const { answer } = await askAssistant(question);
      setMessages((m) => [...m, { role: "bot", text: answer }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: "Coś poszło nie tak po stronie asystenta. Spróbuj ponownie albo napisz przez /kontakt.",
        },
      ]);
    } finally {
      setAiPending(false);
    }
  };

  const quickQuestions = FAQ_ENTRIES.filter((e) => QUICK_IDS.includes(e.id));

  return (
    <div
      role="dialog"
      aria-label="Czat AeroMat"
      className="fixed bottom-24 right-4 z-[95] flex h-[28rem] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-xl border border-white/15 bg-black/90 shadow-2xl backdrop-blur-md"
    >
      {/* naglowek */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <p
            className="text-lg leading-none tracking-wide text-white"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            Aero<span className="text-[#ff7302]">Bot</span>
          </p>
          <a
            href="https://automatejobs.online"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] tracking-wide text-white/45 transition hover:text-[#ff7302]"
          >
            powered by: automate
          </a>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Zamknij czat"
          className="rounded p-1 text-white/60 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7302]"
        >
          <X size={18} />
        </button>
      </div>

      {/* wiadomosci */}
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
            <div
              className={
                msg.role === "user"
                  ? "inline-block max-w-[85%] rounded-lg rounded-br-none bg-[#ff7302] px-3 py-2 text-left text-sm text-white"
                  : "inline-block max-w-[85%] whitespace-pre-line rounded-lg rounded-bl-none bg-white/10 px-3 py-2 text-sm text-white/90"
              }
            >
              {msg.text}
            </div>
            {msg.aiOffer && (
              <div className="mt-2 text-left">
                <button
                  type="button"
                  onClick={() => askAi(msg.aiOffer!)}
                  disabled={aiPending}
                  className="rounded-full border border-[#ff7302]/60 px-3 py-1.5 text-xs text-[#ff7302] transition hover:bg-[#ff7302] hover:text-white disabled:opacity-50"
                >
                  Zapytaj asystenta AI
                </button>
              </div>
            )}
          </div>
        ))}
        {aiPending && (
          <p className="text-xs text-white/50" role="status">
            Asystent myśli…
          </p>
        )}
      </div>

      {/* szybkie pytania */}
      <div className="flex flex-wrap gap-2 px-4 pb-2">
        {quickQuestions.map((q) => (
          <button
            key={q.id}
            type="button"
            onClick={() => submit(q.question)}
            className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/75 transition hover:bg-white/20"
          >
            {q.question}
          </button>
        ))}
      </div>

      {/* pole pytania */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex items-center gap-2 border-t border-white/10 p-3"
      >
        <label htmlFor="chat-question" className="sr-only">
          Twoje pytanie
        </label>
        <input
          id="chat-question"
          ref={inputRef}
          type="text"
          value={input}
          maxLength={300}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Napisz pytanie…"
          className="w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-[#ff7302] focus:ring-2 focus:ring-[#ff7302]/50"
        />
        <button
          type="submit"
          aria-label="Wyślij pytanie"
          className="rounded-md bg-[#ff7302] p-2 text-white transition hover:bg-white hover:text-[#bf4d00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7302]"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
