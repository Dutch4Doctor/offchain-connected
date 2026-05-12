"use client";

import Link from "next/link";
import { useWallet } from "./hooks/useWallet";
import { BADGE_CATEGORIES } from "./types";

export default function HomePage() {
  const { isConnected, isConnecting, connect, disconnect, shortAddress, isCorrectChain, switchToLukso } = useWallet();

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="font-bold text-lg">
              Offchain<span className="text-pink-500">Connected</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isConnected && !isCorrectChain && (
              <button
                onClick={switchToLukso}
                className="text-xs px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
              >
                Switch to LUKSO
              </button>
            )}
            {isConnected ? (
              <div className="flex items-center gap-3">
                <Link href="/badge/create" className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold transition-colors">
                  Create Badge →
                </Link>
                <button
                  onClick={disconnect}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="font-mono text-xs">{shortAddress}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold transition-colors"
              >
                {isConnecting ? "Connecting…" : "Connect UP"}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-xs text-gray-400 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
            Built on LUKSO · LSP8 Soulbound NFTs
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">
            Proof of{" "}
            <span className="text-pink-500">real connection</span>
          </h1>
          <p className="text-gray-400 text-lg mb-10">
            Mint soulbound badges that prove you've actually met people IRL —
            permanently attached to your Universal Profile.
          </p>
          {isConnected ? (
            <Link href="/badge/create" className="inline-block px-8 py-4 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold transition-colors">
              Create your first badge →
            </Link>
          ) : (
            <button
              onClick={connect}
              className="px-8 py-4 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold transition-colors"
            >
              Connect UP to start →
            </button>
          )}
        </div>
      </section>

      {/* Badge categories */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Badge categories
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGE_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="text-3xl mb-3">{cat.emoji}</div>
              <div className="font-semibold mb-1">{cat.label}</div>
              <div className="text-sm text-gray-400">{cat.description}</div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}