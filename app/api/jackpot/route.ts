import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseJackpot = 123000000;
  const dailyIncrease = 86400;
  
  const now = new Date();
  const referenceDate = new Date('2024-11-01T00:00:00');
  const daysSinceReference = (now.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24);
  const currentJackpot = Math.floor(baseJackpot + (daysSinceReference * dailyIncrease));
  
  return NextResponse.json({
    jackpot: currentJackpot,
    currency: '€',
    fetchedAt: now.toISOString()
  });
}
