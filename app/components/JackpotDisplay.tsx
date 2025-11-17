'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";

interface JackpotData {
  jackpot: number;
  currency: string;
  fetchedAt: string;
}

interface JackpotDisplayProps {
  initialData: JackpotData;
  logoUrl: string;
  logoAlt: string;
  apiEndpoint: string;
}

export default function JackpotDisplay({ initialData, logoUrl, logoAlt, apiEndpoint }: JackpotDisplayProps) {
  const [jackpotData, setJackpotData] = useState<JackpotData>(initialData);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date(initialData.fetchedAt));

  useEffect(() => {
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchJackpot();
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchJackpot = async () => {
    try {
      const res = await fetch(apiEndpoint);
      
      if (res.ok) {
        const data = await res.json();
        setJackpotData({
          jackpot: data.jackpot || 0,
          currency: data.currency || '€',
          fetchedAt: data.fetchedAt
        });
        setLastUpdate(new Date(data.fetchedAt));
      }
    } catch {
      // Service worker will serve cached data
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <main className="flex flex-col items-center gap-8 p-8">
        <Image
          src={logoUrl}
          alt={logoAlt}
          width={124}
          height={124}
          priority
        />
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
          <p className="text-yellow-300 text-sm font-medium mb-2">Current Jackpot</p>
          <p className="text-white text-5xl font-bold mb-4">
            {jackpotData.currency}{jackpotData.jackpot.toLocaleString()}
          </p>
          <p className="text-white/70 text-xs mb-4">
            Updated: {lastUpdate.toLocaleDateString('en-US')} at {lastUpdate.toLocaleTimeString('en-US')}
          </p>
          <button 
            onClick={fetchJackpot}
            className="bg-yellow-300 text-blue-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-400 transition"
          >
            Refresh Now
          </button>
        </div>
      </main>
    </div>
  );
}
