import Link from "next/link";

export default function Navbar() {
  return (
    <header className="h-16 px-8 border-b border-zinc-800 flex items-center justify-between bg-zinc-950 text-zinc-50">
      <Link href="/" className="font-bold tracking-tight">
        Reflex
      </Link>
      <nav className="flex gap-6 text-sm text-zinc-400">
        <Link href="/" className="hover:text-zinc-100 transition-colors">
          Home
        </Link>
        <Link href="/login" className="hover:text-zinc-100 transition-colors">
          Retailer Dashboard
        </Link>
        <Link href="/scanner" className="hover:text-zinc-100 transition-colors">
          Sync + Scanning
        </Link>
      </nav>
    </header>
  );
}
