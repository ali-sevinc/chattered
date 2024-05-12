import MessageItem from "./MessageItem";
import Header from "./Header";
import ChatForm from "./ChatForm";
import useChat from "./useChat";

export default function Chat() {
  const {
    error,
    handleSubmit,
    isGenerating,
    messages,
    chatRef,
    enteredQuery,
    setEnteredQuery,
  } = useChat();

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
