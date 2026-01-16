// app/components/LumiChat.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from 'next-intl';

type ChatMessage = {
  from: "lumi" | "user";
  text: string;
};

const greetings: Record<string, string> = {
  en: "Hi! I am Lumi. How can I help you today?",
  sv: "Hej! Jag är Lumi. Hur kan jag hjälpa dig idag?",
  fi: "Hei! Olen Lumi. Miten voin auttaa sinua tänään?",
  no: "Hei! Jeg er Lumi. Hvordan kan jeg hjelpe deg i dag?",
  da: "Hej! Jeg er Lumi. Hvordan kan jeg hjælpe dig i dag?",
  es: "¡Hola! Soy Lumi. ¿Cómo puedo ayudarte hoy?",
  pt: "Olá! Eu sou Lumi. Como posso ajudá-lo hoje?",
  fr: "Bonjour! Je suis Lumi. Comment puis-je vous aider aujourd'hui?",
  de: "Hallo! Ich bin Lumi. Wie kann ich Ihnen heute helfen?",
  zh: "你好！我是 Lumi。今天我能为您提供什么帮助？",
  ru: "Привет! Я Луми. Чем я могу помочь вам сегодня?",
  lt: "Sveiki! Aš esu Lumi. Kaip galiu jums padėti šiandien?",
  lv: "Sveiki! Es esmu Lumi. Kā es varu jums palīdzēt šodien?",
  ltg: "Vasals! Es asmu Lumi. Kai es varu jums pajidzēt šudiņ?",
  sgs: "Svēkė! Aš aso Lumi. Kāp galu joms padietė šandėn?",
};

const errorMessages: Record<string, string> = {
  en: "Sorry, there was a problem connecting to my thinking engine.",
  sv: "Förlåt, det uppstod ett problem med att ansluta till min tankemotor.",
  fi: "Anteeksi, yhteydessä ajattelumoottorii tapahtui virhe.",
  no: "Beklager, det oppstod et problem med å koble til tenkemotoren min.",
  da: "Undskyld, der opstod et problem med at oprette forbindelse til min tænkemotor.",
  es: "Lo siento, hubo un problema al conectar con mi motor de pensamiento.",
  pt: "Desculpe, houve um problema ao conectar ao meu motor de pensamento.",
  fr: "Désolé, il y a eu un problème de connexion à mon moteur de réflexion.",
  de: "Entschuldigung, es gab ein Problem beim Verbinden mit meiner Denkmaschine.",
  zh: "抱歉，连接到我的思维引擎时出现问题。",
  ru: "Извините, возникла проблема с подключением к моему мыслительному движку.",
  lt: "Atsiprašau, kilo problemų prisijungiant prie mano mąstymo variklio.",
  lv: "Atvainojiet, radās problēma, savienojoties ar manu domāšanas dzinēju.",
  ltg: "Atsaprošu, radūs problema sasavīnuojūt ar munu duomōšonys dzineju.",
  sgs: "Atsėpruošu, kėla pruoblema sosėjongiant so mona muoslīma varėkliu.",
};

const systemPrompts: Record<string, string> = {
  en: "You are Lumi, a calm, intelligent assistant for Dosreb.com. You help with real estate, construction, documents, and processes with clarity and emotional ease. Respond in English.",
  sv: "Du är Lumi, en lugn, intelligent assistent för Dosreb.com. Du hjälper till med fastigheter, byggande, dokument och processer med klarhet och känslomässig lätthet. Svara på svenska.",
  fi: "Olet Lumi, rauhallinen, älykäs avustaja Dosreb.com:lle. Autat kiinteistöjen, rakentamisen, asiakirjojen ja prosessien kanssa selkeydellä ja emotionaalisella helpotuksella. Vastaa suomeksi.",
  no: "Du er Lumi, en rolig, intelligent assistent for Dosreb.com. Du hjelper med eiendom, bygg, dokumenter og prosesser med klarhet og emosjonell letthet. Svar på norsk.",
  da: "Du er Lumi, en rolig, intelligent assistent til Dosreb.com. Du hjælper med fast ejendom, byggeri, dokumenter og processer med klarhed og følelsesmæssig lethed. Svar på dansk.",
  es: "Eres Lumi, un asistente tranquilo e inteligente para Dosreb.com. Ayudas con bienes raíces, construcción, documentos y procesos con claridad y facilidad emocional. Responde en español.",
  pt: "Você é Lumi, uma assistente calma e inteligente para Dosreb.com. Você ajuda com imóveis, construção, documentos e processos com clareza e facilidade emocional. Responda em português.",
  fr: "Vous êtes Lumi, un assistant calme et intelligent pour Dosreb.com. Vous aidez avec l'immobilier, la construction, les documents et les processus avec clarté et facilité émotionnelle. Répondez en français.",
  de: "Sie sind Lumi, ein ruhiger, intelligenter Assistent für Dosreb.com. Sie helfen bei Immobilien, Bau, Dokumenten und Prozessen mit Klarheit und emotionaler Leichtigkeit. Antworten Sie auf Deutsch.",
  zh: "您是 Lumi，Dosreb.com 的冷静、智能助手。您以清晰和情感轻松的方式帮助处理房地产、建筑、文件和流程。用中文回答。",
  ru: "Вы Луми, спокойный, умный помощник для Dosreb.com. Вы помогаете с недвижимостью, строительством, документами и процессами с ясностью и эмоциональной легкостью. Отвечайте на русском языке.",
  lt: "Jūs esate Lumi, ramus, protingas asistentas Dosreb.com. Jūs padėdate su nekilnojamuoju turtu, statyba, dokumentais ir procesais aiškiai ir emociškai lengvai. Atsakykite lietuviškai.",
  lv: "Jūs esat Lumi, mierīgs, inteliģents asistents Dosreb.com. Jūs palīdzat ar nekustamo īpašumu, būvniecību, dokumentiem un procesiem ar skaidrību un emocionālu vieglumu. Atbildiet latviski.",
  ltg: "Jius asat Lumi, mīreigs, inteliģents asistents Dosreb.com. Jius pajidzit ar nakilstamu īpašumu, būvīšonu, dukumentim i procesim ar skaideibom i emocionalu vīgleibom. Atbiļdit latgalīški.",
  sgs: "Jūs asat Lumi, mīros, protėngs asėstents Dosreb.com. Jūs padiedat so nakelmuojamu tortu, statuojėmu, dukumentās ė procesās so aiškumu ė emociniam vīgleimu. Atsakīkat žemaitėškā.",
};

const thinkingMessages: Record<string, string> = {
  en: "Lumi is thinking for a moment...",
  sv: "Lumi tänker ett ögonblick...",
  fi: "Lumi ajattelee hetken...",
  no: "Lumi tenker et øyeblikk...",
  da: "Lumi tænker et øjeblik...",
  es: "Lumi está pensando un momento...",
  pt: "Lumi está pensando um momento...",
  fr: "Lumi réfléchit un instant...",
  de: "Lumi denkt einen Moment nach...",
  zh: "Lumi 正在思考...",
  ru: "Луми думает...",
  lt: "Lumi galvoja akimirką...",
  lv: "Lumi domā mirkli...",
  ltg: "Lumi duoma myrkli...",
  sgs: "Lumi golvuojė akelka...",
};

const inputPlaceholders: Record<string, string> = {
  en: "Type your message...",
  sv: "Skriv ditt meddelande...",
  fi: "Kirjoita viestisi...",
  no: "Skriv meldingen din...",
  da: "Skriv din besked...",
  es: "Escribe tu mensaje...",
  pt: "Digite sua mensagem...",
  fr: "Tapez votre message...",
  de: "Geben Sie Ihre Nachricht ein...",
  zh: "输入您的消息...",
  ru: "Введите сообщение...",
  lt: "Įveskite savo žinutę...",
  lv: "Ierakstiet savu ziņojumu...",
  ltg: "Rakstit sovu ziņu...",
  sgs: "Rašīkat sava žėnotė...",
};

const sendButtonTexts: Record<string, string> = {
  en: "Send",
  sv: "Skicka",
  fi: "Lähetä",
  no: "Send",
  da: "Send",
  es: "Enviar",
  pt: "Enviar",
  fr: "Envoyer",
  de: "Senden",
  zh: "发送",
  ru: "Отправить",
  lt: "Siųsti",
  lv: "Sūtīt",
  ltg: "Syuteit",
  sgs: "Sosėostė",
};

export default function LumiChat() {
  const lang = useLocale();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: "lumi", text: greetings[lang] || greetings.en }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update greeting when lang changes
    setMessages([{ from: "lumi", text: greetings[lang] || greetings.en }]);
  }, [lang]);

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
      const res = await fetch(`/api/lumi-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: systemPrompts[lang] || systemPrompts.en
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
        (data.reply || "I am here, but I could not get a clear reply this time.") +
        (data.debug ? ` (debug: ${data.debug})` : "");

      setMessages((prev) => [
        ...prev,
        { from: "lumi", text: aiReply }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          from: "lumi",
          text: errorMessages[lang] || errorMessages.en
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
                {thinkingMessages[lang] || thinkingMessages.en}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form className="lumi-chat-input" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={inputPlaceholders[lang] || inputPlaceholders.en}
              autoFocus
            />
            <button type="submit" disabled={loading}>
              {sendButtonTexts[lang] || sendButtonTexts.en}
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
