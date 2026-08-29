import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen grid place-items-center bg-zinc-950 text-zinc-50 px-8">
      <section className="max-w-2xl">
        <p className="tracking-[.16em] text-xs text-zinc-400">
          REFLEX READINESS SPRINT
        </p>
        <h1 className="text-[clamp(42px,7vw,72px)] leading-[0.95] mt-3 mb-4 font-semibold">
          Retailer operations
        </h1>
        <p className="text-zinc-400 leading-relaxed">
          Team workspace. The Sync + Scanning rider flow is available as a
          separate feature route.
        </p>
        <Link
          href="/scanner"
          className="inline-flex mt-6 px-4 py-3 border border-zinc-700 rounded-lg text-zinc-100 hover:bg-zinc-900 transition-colors"
        >
          Open Sync + Scanning →
        </Link>
      </section>
    </main>
  );
}
