import { FormEvent, useEffect, useRef, useState } from "react";

import { ChatSession } from "@google/generative-ai";
import { generationConfig, model, safetySettings } from "./chatInit";

import MessageItem from "./components/MessageItem";
import Header from "./components/Header";
import ChatForm from "./components/ChatForm";

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
        setChat(null);
      }
    }
    chatInit();
  }, [messages, chat]);

  async function handleMessage() {
    try {
      setIsGenerating(true);
      setError("");
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
      setChat(null);
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
      // chatRef.current.scrollIntoView({ behavior: "smooth" });
      // console.log(chatRef.current.scrollHeight);

      // const height = chatRef.current.scrollHeight;
      // console.log(height);
      // console.log(window.innerHeight);
      // window.scrollTo({
      //   top: chatRef.current.scrollHeight,
      //   behavior: "smooth",
      // });
    },
    [messages, chatRef]
  );

  return (
    <div className="h-screen flex flex-col max-w-6xl mx-4 lg:mx-auto pb-2">
      <Header />

      <ol
        id="myList"
        ref={chatRef}
        className="flex-1 overflow-y-scroll text-stone-50 space-y-2 px-2 sm:px-8 py-4"
      >
        {messages.map((msg, index) => (
          <MessageItem
            key={index}
            role={msg.role}
            text={msg.text}
            timestamp={msg.timestamp}
          />
        ))}
        {isGenerating && (
          <li className="text-left animate-pulse text-lg text-yellow-200">
            Generating...
          </li>
        )}
      </ol>
      {error && <p className="text-red-500">{error}</p>}

      <ChatForm
        onSubmit={handleSubmit}
        value={enteredQuery}
        onChange={(e) => setEnteredQuery(e)}
      />
    </div>
  );
}
