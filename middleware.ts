import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Получаем origin из запроса
  const origin = request.headers.get('origin');
  
  // Список разрешенных origins
  const allowedOrigins = [
    'http://127.0.0.1:8000',
    'https://1ottoland.com:8000'
  ];

  // Обработка preflight запросов
  if (request.method === 'OPTIONS') {
    if (origin && allowedOrigins.includes(origin)) {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
          'Access-Control-Allow-Credentials': 'true',
        },
      });
    }
  }

  const response = NextResponse.next();

  // Проверяем, разрешен ли origin
  if (origin && allowedOrigins.includes(origin)) {
    // Удаляем существующие CORS заголовки
    response.headers.delete('Access-Control-Allow-Origin');
    response.headers.delete('Access-Control-Allow-Methods');
    response.headers.delete('Access-Control-Allow-Headers');
    
    // Устанавливаем наши заголовки
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
}

// Применяется ко всем путям
export const config = {
  matcher: '/:path*',
};
