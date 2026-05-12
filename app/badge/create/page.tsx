"use client";

import { useState } from "react";
import Link from "next/link";
import QRCode from "react-qr-code";
import { useWallet } from "../../hooks/useWallet";
import { BADGE_CATEGORIES, BadgeCategory } from "../../types";

type Step = "category" | "message" | "qr";

export default function CreateBadgePage() {
  const { isConnected, connect, address, shortAddress, disconnect } = useWallet();
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | null>(null);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState<Step>("category");

  const config = selectedCategory
    ? BADGE_CATEGORIES.find((c) => c.id === selectedCategory)
    : null;

  // Build the QR mint URL
  const mintUrl = address && selectedCategory
    ? `${window.location.origin}/mint/claim?creator=${address}&category=${selectedCategory}&message=${encodeURIComponent(message)}&expires=${Math.floor(Date.now() / 1000) + 86400}`
    : "";

  const copyLink = () => {
    navigator.clipboard.writeText(mintUrl);
    alert("Link gekopieerd!");
  };

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
            <button onClick={connect} className="px-5 py-2.5 rounded-xl bg-pink-500 text-white text-sm font-semibold">
              Connect UP
            </button>
          )}
        </div>
      </nav>

      <div className="pt-24 pb-16 max-w-4xl mx-auto px-4">
        <Link href="/" className="text-sm text-gray-400 hover:text-white mb-6 inline-block">
          ← Back
        </Link>
        <h1 className="text-4xl font-bold mb-2">
          Create a <span className="text-pink-500">Badge</span>
        </h1>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-10 mt-4">
          {(["category", "message", "qr"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step === s ? "bg-pink-500 text-white" : 
                i < ["category","message","qr"].indexOf(step) ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                "bg-white/10 text-gray-500"
              }`}>
                {i + 1}
              </div>
              <span className={`text-sm ${step === s ? "text-white" : "text-gray-500"}`}>
                {s === "category" ? "Category" : s === "message" ? "Message" : "QR Code"}
              </span>
              {i < 2 && <span className="text-gray-700 mx-1">—</span>}
            </div>
          ))}
        </div>

        {!isConnected ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔐</div>
            <h2 className="text-xl font-bold mb-2">Connect your Universal Profile</h2>
            <p className="text-gray-400 mb-6">You need a LUKSO UP to create badges.</p>
            <button onClick={connect} className="px-8 py-4 rounded-xl bg-pink-500 text-white font-semibold">
              Connect UP
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">

            {/* Left - steps */}
            <div>
              {/* Step 1: Category */}
              {step === "category" && (
                <div>
                  <h2 className="font-semibold text-lg mb-4">Choose a category</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {BADGE_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setMessage(cat.defaultMessage);
                          setStep("message");
                        }}
                        className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-pink-500/50 text-left transition-all"
                      >
                        <div className="text-2xl mb-2">{cat.emoji}</div>
                        <div className="text-sm font-semibold">{cat.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Message */}
              {step === "message" && (
                <div>
                  <button onClick={() => setStep("category")} className="text-sm text-gray-400 hover:text-white mb-4 block">
                    ← Back
                  </button>
                  <h2 className="font-semibold text-lg mb-4">Add a message</h2>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={60}
                    placeholder="A short message for the recipient…"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-pink-500/50 focus:outline-none resize-none h-24 mb-2"
                  />
                  <div className="text-xs text-gray-500 text-right mb-6">{message.length}/60</div>
                  <button
                    onClick={() => setStep("qr")}
                    disabled={!message.trim()}
                    className="w-full px-6 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold transition-colors disabled:opacity-50"
                  >
                    Generate QR Code →
                  </button>
                </div>
              )}

              {/* Step 3: QR Code */}
              {step === "qr" && (
                <div>
                  <button onClick={() => setStep("message")} className="text-sm text-gray-400 hover:text-white mb-4 block">
                    ← Back
                  </button>
                  <h2 className="font-semibold text-lg mb-4">Share your badge</h2>
                  <p className="text-sm text-gray-400 mb-6">
                    Laat je vriend deze QR code scannen om de badge te minten naar zijn Universal Profile.
                  </p>

                  {/* QR Code */}
                  <div className="p-4 rounded-2xl bg-white inline-block mb-4">
                    <QRCode
                      value={mintUrl}
                      size={180}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    />
                  </div>

                  <button
                    onClick={copyLink}
                    className="w-full px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white text-sm font-semibold transition-colors mb-3"
                  >
                    📋 Copy link
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    QR code verloopt over 24 uur
                  </p>
                </div>
              )}
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
            </div>

          </div>
        )}
      </div>
    </main>
  );
}