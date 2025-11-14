'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";

interface JackpotData {
  jackpot: number;
  currency: string;
  fetchedAt: string;
}

export default function JackpotDisplay({ initialData }: { initialData: JackpotData }) {
  const [jackpotData, setJackpotData] = useState<JackpotData>(initialData);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date(initialData.fetchedAt));

  useEffect(() => {
    // Автообновление каждые 5 минут
    const interval = setInterval(() => {
      fetchJackpot();
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchJackpot = async () => {
    try {
      const res = await fetch('/api/jackpot');
      
      if (res.ok) {
        const data = await res.json();
        const newData = {
          jackpot: data.jackpot || 0,
          currency: data.currency || '€',
          fetchedAt: data.fetchedAt
        };
        
        setJackpotData(newData);
        setLastUpdate(new Date(newData.fetchedAt));
      }
    } catch (error) {
      console.log('Failed to fetch jackpot, using cached data from SW');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <main className="flex flex-col items-center gap-8 p-8">
        <Image
          src="/euromillions-logo.png"
          alt="EuroMillions logo"
          width={96}
          height={96}
          priority
        />
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
          <p className="text-yellow-300 text-sm font-medium mb-2">Current Jackpot</p>
          <p className="text-white text-5xl font-bold mb-4">
            {jackpotData.currency}{jackpotData.jackpot.toLocaleString()}
          </p>
          <p className="text-white/70 text-xs mb-4">
            Обновлено: {lastUpdate.toLocaleDateString('ru-RU')} в {lastUpdate.toLocaleTimeString('ru-RU')}
          </p>
          <button 
            onClick={fetchJackpot}
            className="bg-yellow-300 text-blue-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-400 transition"
          >
            Обновить сейчас
          </button>
        </div>
      </main>
    </div>
  );
}
