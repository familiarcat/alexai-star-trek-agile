'use client';

import React, { useState, useEffect } from 'react';

interface MarketData {
  currentPosition: string;
  targetPosition: string;
  marketShare: number;
  targetShare: number;
  innovationRate: string;
  targetRate: string;
}

export default function MarketDashboard() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('/api/market-intelligence/analysis');
        const data = await response.json();
        setMarketData(data);
      } catch (error) {
        console.error('Failed to fetch market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  if (loading) return <div>Loading market intelligence...</div>;
  if (!marketData) return <div>Failed to load market data</div>;

  return (
    <div className="market-dashboard">
      <h2>🎯 Market Intelligence Dashboard</h2>
      <div className="market-metrics">
        <div className="metric">
          <h3>Current Position</h3>
          <p className="current">{marketData.currentPosition}</p>
          <p className="target">Target: {marketData.targetPosition}</p>
        </div>
        <div className="metric">
          <h3>Market Share</h3>
          <p className="current">{marketData.marketShare}%</p>
          <p className="target">Target: {marketData.targetShare}%</p>
        </div>
        <div className="metric">
          <h3>Innovation Rate</h3>
          <p className="current">{marketData.innovationRate}</p>
          <p className="target">Target: {marketData.targetRate}</p>
        </div>
      </div>
    </div>
  );
}
