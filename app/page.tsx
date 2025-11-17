import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

const lotteries = [
  {
    name: 'EuroMillions',
    path: '/euromillions',
    logo: '/euromillions-logo.png',
    description: 'European lottery with huge jackpots'
  },
  {
    name: 'EuroJackpot',
    path: '/eurojackpot',
    logo: '/eurojackpot-logo.png',
    description: 'Popular European lottery'
  }
];

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-blue-800">
      <main className="flex flex-col items-center gap-8 p-8 max-w-4xl w-full">
        <h1 className="text-white text-4xl font-bold text-center mb-4">
          Lotteries
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {lotteries.map((lottery) => (
            <Link
              key={lottery.path}
              href={lottery.path}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105"
            >
              <div className="flex flex-col items-center gap-4">
                <Image
                  src={lottery.logo}
                  alt={lottery.name}
                  width={124}
                  height={124}
                  priority
                />
                <h2 className="text-white text-2xl font-bold">{lottery.name}</h2>
                <p className="text-white/70 text-center text-sm">{lottery.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
