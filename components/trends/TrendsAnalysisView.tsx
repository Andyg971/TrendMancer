import React from 'react';
import { motion } from 'framer-motion';
import { Trend, SocialPlatform } from '@/types';
import { TrendMancerService } from '@/services/TrendMancerService';

const service = new TrendMancerService();

const platformColors: Record<SocialPlatform, string> = {
  twitter: 'bg-blue-100 text-blue-600',
  instagram: 'bg-pink-100 text-pink-600',
  facebook: 'bg-indigo-100 text-indigo-600',
  linkedin: 'bg-blue-100 text-blue-800',
  tiktok: 'bg-gray-100 text-gray-800'
};

export const TrendsAnalysisView: React.FC = () => {
  const [trends, setTrends] = React.useState<Trend[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedPlatform, setSelectedPlatform] = React.useState<SocialPlatform | 'all'>('all');
  const [sortBy, setSortBy] = React.useState<'volume' | 'sentiment'>('volume');

  React.useEffect(() => {
    const fetchTrends = async () => {
      try {
        const trendsData = await service.getTrends(selectedPlatform === 'all' ? undefined : selectedPlatform);
        setTrends(trendsData);
      } catch (error) {
        console.error('Erreur lors du chargement des tendances:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [selectedPlatform]);

  const sortedTrends = React.useMemo(() => {
    return [...trends].sort((a, b) => 
      sortBy === 'volume' ? b.volume - a.volume : b.sentiment - a.sentiment
    );
  }, [trends, sortBy]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analyse des tendances</h1>
        <div className="flex space-x-4">
          <select
            className="border rounded-lg px-4 py-2"
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value as SocialPlatform | 'all')}
          >
            <option value="all">Toutes les plateformes</option>
            <option value="twitter">Twitter</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="linkedin">LinkedIn</option>
            <option value="tiktok">TikTok</option>
          </select>
          <select
            className="border rounded-lg px-4 py-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'volume' | 'sentiment')}
          >
            <option value="volume">Trier par volume</option>
            <option value="sentiment">Trier par sentiment</option>
          </select>
        </div>
      </div>

      {/* Grille des tendances */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTrends.map((trend) => (
          <motion.div
            key={trend.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium text-lg">{trend.keyword}</h3>
              <span className={`px-3 py-1 rounded-full text-sm ${platformColors[trend.platform]}`}>
                {trend.platform}
              </span>
            </div>
            
            <div className="space-y-4">
              {/* Volume */}
              <div>
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Volume</span>
                  <span>{trend.volume.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${Math.min((trend.volume / 10000) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Sentiment */}
              <div>
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Sentiment</span>
                  <span>{(trend.sentiment * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      trend.sentiment > 0.6 ? 'bg-green-500' :
                      trend.sentiment > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${trend.sentiment * 100}%` }}
                  />
                </div>
              </div>

              {/* Taux de croissance */}
              <div>
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Croissance</span>
                  <span>{((trend.growthRate - 1) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${trend.growthRate > 1 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(Math.abs(trend.growthRate - 1) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}; 