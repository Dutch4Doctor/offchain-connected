"use client";

import { useState, useEffect, useCallback } from "react";
import { LUKSO_CHAIN_ID, LUKSO_TESTNET_CHAIN_ID } from "../lib/chains";

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const isConnected = !!address;
  const isCorrectChain =
    chainId === LUKSO_CHAIN_ID || chainId === LUKSO_TESTNET_CHAIN_ID;

  useEffect(() => {
    const eth = (window as any).ethereum;
    if (!eth) return;

    eth.request({ method: "eth_accounts" }).then((accounts: string[]) => {
      if (accounts.length > 0) setAddress(accounts[0]);
    });

    eth.request({ method: "eth_chainId" }).then((id: string) => {
      setChainId(parseInt(id, 16));
    });

    eth.on("accountsChanged", (accounts: string[]) => {
      setAddress(accounts.length > 0 ? accounts[0] : null);
    });

    eth.on("chainChanged", (id: string) => {
      setChainId(parseInt(id, 16));
    });
  }, []);

  const connect = useCallback(async () => {
    const eth = (window as any).ethereum;
    if (!eth) {
      alert("Installeer de LUKSO UP Browser Extension!");
      return;
    }
    setIsConnecting(true);
    try {
      const accounts = await eth.request({ method: "eth_requestAccounts" });
      setAddress(accounts[0]);
      const id = await eth.request({ method: "eth_chainId" });
      setChainId(parseInt(id, 16));
    } catch (err) {
      console.error(err);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
  }, []);

  const switchToLukso = useCallback(async () => {
    const eth = (window as any).ethereum;
    if (!eth) return;
    try {
      await eth.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x2a" }],
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  const shortAddress = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : null;

  return {
    address,
    shortAddress,
    isConnected,
    isConnecting,
    isCorrectChain,
    chainId,
    connect,
    disconnect,
    switchToLukso,
    isTestnet: chainId === LUKSO_TESTNET_CHAIN_ID,
  };
}