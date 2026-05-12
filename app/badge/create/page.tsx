"use client";

import { useState } from "react";
import Link from "next/link";
import { useWallet } from "../../hooks/useWallet";
import { BADGE_CATEGORIES, BadgeCategory } from "../../types";

export default function CreateBadgePage() {
  const { isConnected, connect, address, shortAddress, disconnect } = useWallet();
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | null>(null);
  const [message, setMessage] = useState("");

  const config = selectedCategory
    ? BADGE_CATEGORIES.find((c) => c.id === selectedCategory)
    : null;

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="font-bold text-lg">
              Offchain<span className="text-pink-500">Connected</span>
            </span>
          </Link>
          {isConnected ? (
            <button
              onClick={disconnect}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm"
            >
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="font-mono text-xs">{shortAddress}</span>
            </button>
          ) : (
            <button
              onClick={connect}
              className="px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold"
            >
              Connect UP
            </button>
          )}
        </div>
      </nav>

      <div className="pt-24 pb-16 max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2">
          Create a <span className="text-pink-500">Badge</span>
        </h1>
        <p className="text-gray-400 mb-10">
          Choose a category and personalise your badge.
        </p>

        {!isConnected ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔐</div>
            <h2 className="text-xl font-bold mb-2">Connect your Universal Profile</h2>
            <p className="text-gray-400 mb-6">You need a LUKSO UP to create badges.</p>
            <button onClick={connect} className="px-8 py-4 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold">
              Connect UP
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">

            {/* Left - category + message */}
            <div>
              <h2 className="font-semibold text-lg mb-4">1. Choose a category</h2>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {BADGE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setMessage(cat.defaultMessage);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedCategory === cat.id
                        ? "border-pink-500 bg-pink-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="text-2xl mb-2">{cat.emoji}</div>
                    <div className="text-sm font-semibold">{cat.label}</div>
                  </button>
                ))}
              </div>

              <h2 className="font-semibold text-lg mb-4">2. Add a message</h2>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={60}
                placeholder="A short message for the recipient…"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-pink-500/50 focus:outline-none resize-none h-24"
              />
              <div className="text-xs text-gray-500 text-right mt-1">{message.length}/60</div>
            </div>

            {/* Right - preview */}
            <div>
              <h2 className="font-semibold text-lg mb-4">Preview</h2>
              <div className="aspect-square max-w-[280px] rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {config ? (
                  <>
                    <div
                      className="w-32 h-32 rounded-full flex items-center justify-center text-5xl mb-4"
                      style={{
                        border: `3px solid ${config.filterColor}`,
                        boxShadow: `0 0 30px ${config.filterColor}40`,
                        background: `${config.filterColor}15`,
                      }}
                    >
                      {config.emoji}
                    </div>
                    <div className="text-sm font-semibold text-center mb-1" style={{ color: config.filterColor }}>
                      {config.label}
                    </div>
                    {message && (
                      <div className="text-xs text-gray-400 text-center mt-1">"{message}"</div>
                    )}
                    <div className="text-xs text-gray-600 font-mono mt-3">{shortAddress}</div>
                    <div className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full bg-black/50 border border-white/10 text-gray-500">
                      🔒 SOULBOUND
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-600">
                    <div className="text-4xl mb-3">🎭</div>
                    <div className="text-sm">Choose a category to preview</div>
                  </div>
                )}
              </div>

              {selectedCategory && message && (
                <button className="mt-6 w-full max-w-[280px] px-6 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold transition-colors">
                  Generate QR Code →
                </button>
              )}
            </div>

          </div>
        )}
      </div>
    </main>
  );
}