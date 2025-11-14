import JackpotDisplay from './components/JackpotDisplay';

export const dynamic = 'force-dynamic';

interface JackpotData {
  jackpot: number;
  currency: string;
  fetchedAt: string;
}

async function getJackpot(): Promise<JackpotData> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/jackpot`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch jackpot');
    }
    
    const data = await res.json();
    
    return {
      jackpot: data.jackpot || 0,
      currency: data.currency || '€',
      fetchedAt: data.fetchedAt
    };
  } catch (error) {
    return {
      jackpot: 0,
      currency: '€',
      fetchedAt: new Date().toISOString()
    };
  }
}

export default async function Home() {
  const jackpotData = await getJackpot();
  
  return <JackpotDisplay initialData={jackpotData} />;
}
