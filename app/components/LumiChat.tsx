// app/components/LumiChat.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

type ChatMessage = {
  from: "lumi" | "user";
  text: string;
};

export default function LumiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: "lumi", text: "Hi! I am Lumi. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();

    setMessages((prev) => [
      ...prev,
      { from: "user", text: userMessage }
    ]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/lumi-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are Lumi, a calm, intelligent assistant for Dosreb.com. You help with real estate, construction, documents, and processes with clarity and emotional ease."
            },
            ...messages.map((m) => ({
              role: m.from === "user" ? "user" : "assistant",
              content: m.text
            })),
            { role: "user", content: userMessage }
          ]
        })
      });

      const data = await res.json();
      const aiReply: string =
        data.reply || "I am here, but I could not get a clear reply this time.";

      setMessages((prev) => [
        ...prev,
        { from: "lumi", text: aiReply }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          from: "lumi",
          text: "Sorry, there was a problem connecting to my thinking engine."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        className="lumi-chat-fab"
        aria-label="Open Lumi chat"
        onClick={() => setOpen((v) => !v)}
      >
        <Image
          src="/lumi-hero.png"
          alt="Lumi"
          width={48}
          height={48}
          style={{ borderRadius: "50%" }}
        />
      </button>

      {open && (
        <div className="lumi-chat-window">
          <div className="lumi-chat-header">
            <Image
              src="/lumi-hero.png"
              alt="Lumi"
              width={32}
              height={32}
              style={{ borderRadius: "50%" }}
            />
            <span style={{ marginLeft: 8, fontWeight: 600 }}>Lumi</span>
            <button
              className="lumi-chat-close"
              onClick={() => setOpen(false)}
            >
              &times;
            </button>
          </div>

          <div className="lumi-chat-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={
                  msg.from === "lumi" ? "lumi-msg-lumi" : "lumi-msg-user"
                }
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="lumi-msg-lumi">
                Lumi is thinking for a moment...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form className="lumi-chat-input" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              autoFocus
            />
            <button type="submit" disabled={loading}>
              Send
            </button>
          </form>
        </div>
      )}

      <style jsx global>{`
        .lumi-chat-fab {
          position: fixed;
          right: 2rem;
          bottom: 2rem;
          z-index: 1000;
          background: #ffd700;
          border: none;
          border-radius: 50%;
          box-shadow: 0 2px 16px #ffd70055;
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: box-shadow 0.2s;
        }
        .lumi-chat-fab:hover {
          box-shadow: 0 4px 32px #ffd70099;
        }
        .lumi-chat-window {
          position: fixed;
          right: 2rem;
          bottom: 5.5rem;
          width: 340px;
          max-width: 95vw;
          background: #111;
          color: #ffd700;
          border-radius: 1.2rem;
          box-shadow: 0 4px 32px #ffd70044;
          z-index: 1001;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .lumi-chat-header {
          display: flex;
          align-items: center;
          padding: 1rem;
          background: #222;
          border-bottom: 1px solid #ffd70033;
        }
        .lumi-chat-close {
          margin-left: auto;
          background: none;
          border: none;
          color: #ffd700;
          font-size: 1.5rem;
          cursor: pointer;
        }
        .lumi-chat-messages {
          flex: 1 1 auto;
          padding: 1rem;
          max-height: 260px;
          overflow-y: auto;
          background: #181818;
        }
        .lumi-msg-lumi {
          background: #ffd70022;
          color: #ffd700;
          padding: 0.5rem 1rem;
          border-radius: 1rem 1rem 1rem 0.2rem;
          margin-bottom: 0.5rem;
          max-width: 80%;
        }
        .lumi-msg-user {
          background: #ffd700;
          color: #111;
          padding: 0.5rem 1rem;
          border-radius: 1rem 1rem 0.2rem 1rem;
          margin-bottom: 0.5rem;
          align-self: flex-end;
          margin-left: auto;
          max-width: 80%;
        }
        .lumi-chat-input {
          display: flex;
          border-top: 1px solid #ffd70033;
          background: #222;
        }
        .lumi-chat-input input {
          flex: 1 1 auto;
          border: none;
          background: #222;
          color: #ffd700;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          outline: none;
        }
        .lumi-chat-input button {
          background: #ffd700;
          color: #111;
          border: none;
          padding: 0.75rem 1.2rem;
          font-weight: 700;
          font-size: 1rem;
          border-radius: 0 0 1.2rem 0;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
