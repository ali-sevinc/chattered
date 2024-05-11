export default function Header() {
  return (
    <header className="border-b py-4">
      <h1 className="text-4xl text-center text-stone-50 flex items-center justify-center gap-2 font-semibold ">
        <img src="/chat.png" alt="chat bubble" className="w-20" />
        <span>Chattered</span>
      </h1>
    </header>
  );
}
