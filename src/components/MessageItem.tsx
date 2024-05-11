import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

type PropsType = { role: string; text: string; timestamp: string };

export default function MessageItem({ role, text, timestamp }: PropsType) {
  return (
    <li
      className={`${
        role === "user" ? "text-right" : "text-left"
      } bg-zinc-800 px-2 py-2 rounded-xl w-full prose-ul:m-0 prose prose-a:text-blue-200 prose-li:m-0  prose-pre:m-0 prose-strong:text-zinc-50 prose-p:m-0 prose-code:text-zinc-50 text-zinc-50`}
    >
      <Markdown
        remarkPlugins={[remarkGfm]}
        className="text-lg whitespace-pre-wrap myMarkdowns "
      >
        {text}
      </Markdown>
      <p className="italic text-stone-700 font-semibold bg-stone-200 px-1 rounded inline">
        {role === "user" ? "You" : "Bot"} -{" "}
        {new Date(timestamp).toLocaleTimeString()}
      </p>
    </li>
  );
}
