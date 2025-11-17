import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseJackpot = 80000000; // 80 млн
  const dailyIncrease = 86400;
  
  const now = new Date();
  const referenceDate = new Date('2024-11-01T00:00:00');
  const daysSinceReference = (now.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24);
  const currentJackpot = Math.floor(baseJackpot + (daysSinceReference * dailyIncrease));
  
  const response = NextResponse.json({
    jackpot: currentJackpot,
    currency: '€',
    lottery: 'EuroMillions',
    fetchedAt: now.toISOString()
  });

  // CORS заголовки
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}
