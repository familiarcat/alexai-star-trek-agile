import { NextResponse } from 'next/server';

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      api: 'operational',
      database: 'operational',
      n8n: 'operational',
      bilateral_sync: 'operational'
    },
    version: '3.0.0',
    environment: process.env.NODE_ENV || 'development'
  };
  
  return NextResponse.json(health);
} 