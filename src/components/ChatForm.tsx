import { FormEvent } from "react";

type PropsType = {
  onSubmit: (event: FormEvent) => void;
  value: string;
  onChange: (e: string) => void;
};
export default function ChatForm({ onSubmit, value, onChange }: PropsType) {
  return (
    <form
      onSubmit={onSubmit}
      className=" group flex mt-12 items-center rounded-lg focus-within:ring-offset-2 bg-zinc-600 focus-within:ring-2 focus-within:ring-blue-500"
    >
      <input
        className="w-full text-2xl whitespace-pre-wrap px-4 py-2 border-none bg-transparent h-20 text-zinc-50 rounded-l-lg focus:outline-none"
        placeholder="Ask to Bot!"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button className="text-2xl font-bold px-4 py-2 border h-20 hover:bg-stone-200 w-20 rounded-r-lg bg-stone-50">
        &darr;
      </button>
    </form>
  );
}
