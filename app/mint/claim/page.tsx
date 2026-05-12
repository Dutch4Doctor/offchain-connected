"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useWallet } from "../../hooks/useWallet";
import { BADGE_CATEGORIES } from "../../types";

export default function ClaimPage() {
  const { isConnected, connect, address, shortAddress, disconnect } = useWallet();
  const [params, setParams] = useState<any>(null);
  const [status, setStatus] = useState<"idle" | "minting" | "success" | "error">("idle");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const creator = searchParams.get("creator");
    const category = searchParams.get("category");
    const message = searchParams.get("message");
    const expires = searchParams.get("expires");

    if (creator && category) {
      setParams({ creator, category, message, expires: Number(expires) });
    }
  }, []);

  const isExpired = params && params.expires < Math.floor(Date.now() / 1000);
  const config = params ? BADGE_CATEGORIES.find((c) => c.id === params.category) : null;

  const handleClaim = async () => {
    if (!address || !params) return;
    setStatus("minting");
    // Hier komt later de echte mint logica
    setTimeout(() => {
      setStatus("success");
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-8">
          <span className="text-xl">⚡</span>
          <span className="font-bold text-lg">
            Offchain<span className="text-pink-500">Connected</span>
          </span>
        </Link>

        {/* Invalid */}
        {!params && (
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div className="text-4xl mb-4">❌</div>
            <h2 className="font-bold text-xl mb-2">Ongeldige QR code</h2>
            <p className="text-gray-400 text-sm">Deze QR code is niet geldig.</p>
          </div>
        )}

        {/* Expired */}
        {params && isExpired && (
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div className="text-4xl mb-4">⏰</div>
            <h2 className="font-bold text-xl mb-2">QR code verlopen</h2>
            <p className="text-gray-400 text-sm">
              Deze badge QR is verlopen. Vraag de maker om een nieuwe.
            </p>
          </div>
        )}

        {/* Valid */}
        {params && !isExpired && config && status !== "success" && (
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">{config.emoji}</div>
              <h2 className="font-bold text-2xl mb-2">Je hebt een badge ontvangen!</h2>
              <p className="text-gray-400 text-sm">
                <span className="font-mono text-xs">
                  {params.creator.slice(0, 6)}…{params.creator.slice(-4)}
                </span>{" "}
                wil je een{" "}
                <span className="font-semibold" style={{ color: config.filterColor }}>
                  {config.label}
                </span>{" "}
                badge geven.
              </p>
            </div>

            <div
              className="p-4 rounded-xl mb-6 text-sm"
              style={{
                background: `${config.filterColor}10`,
                border: `1px solid ${config.filterColor}30`,
              }}
            >
              <div className="text-xs text-gray-400 mb-1">Badge type</div>
              <div className="font-semibold">{config.label}</div>
              <div className="text-xs text-gray-400 mt-1">{config.description}</div>
              {params.message && (
                <div className="text-xs text-gray-300 mt-2 italic">"{params.message}"</div>
              )}
              <div className="text-xs font-mono text-gray-500 mt-2">🔒 Soulbound — niet overdraagbaar</div>
            </div>

            {!isConnected ? (
              <button onClick={connect} className="w-full px-6 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold">
                Connect UP om te claimen →
              </button>
            ) : (
              <button
                onClick={handleClaim}
                disabled={status === "minting"}
                className="w-full px-6 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold transition-colors disabled:opacity-50"
              >
                {status === "minting" ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Badge wordt gemint…
                  </span>
                ) : (
                  "Claim badge →"
                )}
              </button>
            )}
          </div>
        )}

        {/* Success */}
        {status === "success" && (
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="font-bold text-2xl mb-2 text-pink-500">Badge gemint!</h2>
            <p className="text-gray-400 text-sm mb-6">
              Je soulbound badge staat nu op je Universal Profile.
            </p>
            <Link href="/" className="inline-block px-6 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold">
              Terug naar home
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}