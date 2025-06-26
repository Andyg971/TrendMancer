import React, { useEffect, useState } from 'react';
import { Analytics } from '@/types/analytics';
import { OpportunitiesService } from './OpportunitiesService';
import { motion } from 'framer-motion';

const opportunitiesService = new OpportunitiesService();

export const OpportunitiesView: React.FC = () => {
  const [trends, setTrends] = useState<Analytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const data = await opportunitiesService.detectTrends();
        setTrends(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
    // Rafraîchir toutes les 5 minutes
    const interval = setInterval(fetchTrends, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Opportunités en Temps Réel</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trends.map((trend, index) => (
          <motion.div
            key={trend.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                trend.sentiment > 0 ? 'bg-green-100 text-green-800' :
                trend.sentiment < 0 ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {trend.source}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(trend.timestamp).toLocaleTimeString()}
              </span>
            </div>

            <h3 className="text-xl font-semibold mb-2">{trend.keyword}</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Volume</span>
                <span className="font-medium">{trend.volume.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Engagement</span>
                <span className="font-medium">
                  {(trend.engagement_rate * 100).toFixed(1)}%
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Portée potentielle</span>
                <span className="font-medium">
                  {trend.potential_reach.toLocaleString()}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Score de pertinence</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 rounded-full h-2"
                      style={{ width: `${trend.relevance_score * 100}%` }}
                    />
                  </div>
                  <span className="ml-2 text-sm font-medium">
                    {(trend.relevance_score * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}; 