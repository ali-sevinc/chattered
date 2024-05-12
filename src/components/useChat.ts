import { FormEvent, useEffect, useRef, useState } from "react";

import { ChatSession } from "@google/generative-ai";
import { generationConfig, model, safetySettings } from "../chatInit";

type MessageType = {
  text: string;
  role: string;
  timestamp: string;
};

export default function useChat() {
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

  useEffect(
    function () {
      if (!chatRef.current) return;
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    },
    [messages, chatRef]
  );

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!enteredQuery.trim().length) return;
    handleMessage();
  }

  return {
    handleSubmit,
    handleMessage,
    messages,
    error,
    isGenerating,
    chatRef,
    enteredQuery,
    setEnteredQuery,
  };
}
