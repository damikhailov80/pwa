import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseJackpot = 123000000; // 123 million euros
  const dailyIncrease = 86400; // 10,000 euros per day
  
  const now = new Date();
  const referenceDate = new Date('2024-11-01T00:00:00');
  
  // Calculate milliseconds since reference date
  const msSinceReference = now.getTime() - referenceDate.getTime();
  
  // Calculate fractional days (including hours, minutes, seconds)
  const daysSinceReference = msSinceReference / (1000 * 60 * 60 * 24);
  
  // Calculate current jackpot with fractional day increase
  const currentJackpot = Math.floor(baseJackpot + (daysSinceReference * dailyIncrease));
  
  return NextResponse.json({
    jackpot: currentJackpot,
    currency: '€',
    fetchedAt: now.toISOString()
  });
}
