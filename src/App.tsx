import { FormEvent, useEffect, useRef, useState } from "react";

import { ChatSession } from "@google/generative-ai";
import { generationConfig, model, safetySettings } from "./ChatInit";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MessageType = {
  text: string;
  role: string;
  timestamp: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [enteredQuery, setEnteredQuery] = useState("");
  const [chat, setChat] = useState<ChatSession | null>(null);
  const [error, setError] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const chatRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (chat) return;
    async function chatInit() {
      try {
        const newChat = model.startChat({
          generationConfig,
          safetySettings,
          history: messages.map((message) => ({
            parts: [{ text: message.text }],
            role: message.role,
          })),
        });
        setChat(newChat);
      } catch (error) {
        setError("Failed to initialize.");
      }
    }
    chatInit();
  }, [messages, chat]);

  async function handleMessage() {
    try {
      setIsGenerating(true);
      const userMessage = {
        text: enteredQuery,
        role: "user",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setEnteredQuery("");

      if (chat) {
        const result = await chat.sendMessage(enteredQuery);
        const response = result.response;
        const botMessage = {
          text: response.text(),
          role: "bot",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      setError("Failed to create message.");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!enteredQuery.trim().length) return;
    handleMessage();
  }
  useEffect(
    function () {
      if (!chatRef.current) return;
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
      // const rect = chatRef.current.getBoundingClientRect();
      // console.log(chatRef.current.scrollHeight);
      // window.scrollTo({
      //   left: 0,
      //   top: chatRef.current.scrollHeight,
      //   behavior: "smooth",
      // });
    },
    [messages]
  );

  return (
    <div className="h-screen flex flex-col max-w-6xl mx-4 lg:mx-auto pb-2">
      <header className="border-b py-4">
        <h1 className="text-4xl text-center text-stone-50 flex items-center justify-center gap-2 font-semibold ">
          <img src="/chat.png" alt="chat bubble" className="w-20" />
          <span>Chattered</span>
        </h1>
      </header>

      <ol
        id="myList"
        ref={chatRef}
        className="flex-1 overflow-y-scroll text-stone-50 space-y-2 px-8 py-4"
      >
        {messages.map((msg, index) => (
          <li
            key={index}
            className={`${
              msg.role === "user" ? "text-right" : "text-left"
            } bg-zinc-800 px-2 py-2 rounded-xl w-full prose prose-strong:text-zinc-50 pro text-zinc-50`}
          >
            <Markdown
              remarkPlugins={[remarkGfm]}
              className="text-lg whitespace-pre-wrap myMarkdowns "
            >
              {msg.text}
            </Markdown>
            <p className="italic text-stone-700 font-semibold bg-stone-200 px-1 rounded inline">
              {msg.role === "user" ? "You" : "Bot"} -{" "}
              {new Date(msg.timestamp).toLocaleTimeString()}
            </p>
          </li>
        ))}
        {isGenerating && (
          <li className="text-left animate-pulse text-lg text-yellow-200">
            Generating...
          </li>
        )}
      </ol>
      {error && <p className="text-red-500">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className=" group flex mt-12 items-center rounded-lg focus-within:ring-offset-2 focus-within:ring-2 focus-within:ring-blue-500"
      >
        <input
          className="w-full text-2xl px-4 py-2 border h-20 rounded-l-lg focus:outline-none"
          placeholder="Ask to Bot!"
          value={enteredQuery}
          onChange={(e) => setEnteredQuery(e.target.value)}
        />
        <button className="text-2xl font-bold px-4 py-2 border h-20 hover:bg-stone-200 w-20 rounded-r-lg bg-stone-50">
          &darr;
        </button>
      </form>
    </div>
  );
}
