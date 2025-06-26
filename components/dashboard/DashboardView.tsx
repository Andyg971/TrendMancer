import React from 'react';
import { motion } from 'framer-motion';
import { Analytics, Project, Trend } from '@/types';
import { TrendMancerService } from '@/services/TrendMancerService';
import { DynamicLineChart } from '../DynamicImports';

const service = new TrendMancerService();

export const DashboardView: React.FC = () => {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [trends, setTrends] = React.useState<Trend[]>([]);
  const [analytics, setAnalytics] = React.useState<Analytics[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const user = await service.getCurrentUser();
        if (user) {
          const [projectsData, trendsData] = await Promise.all([
            service.getProjects(user.id),
            service.getTrends()
          ]);
          setProjects(projectsData);
          setTrends(trendsData);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du tableau de bord:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Nouveau projet
        </button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <h3 className="text-gray-500 mb-2">Projets actifs</h3>
          <p className="text-3xl font-bold">{projects.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <h3 className="text-gray-500 mb-2">Tendances détectées</h3>
          <p className="text-3xl font-bold">{trends.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <h3 className="text-gray-500 mb-2">Publications prévues</h3>
          <p className="text-3xl font-bold">0</p>
        </motion.div>
      </div>

      {/* Tendances récentes */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Tendances récentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trends.slice(0, 6).map((trend) => (
            <motion.div
              key={trend.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border p-4 rounded-lg"
            >
              <h3 className="font-medium">{trend.keyword}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-500">Volume: {trend.volume}</span>
                <span className={`text-sm ${trend.sentiment > 0.5 ? 'text-green-500' : 'text-red-500'}`}>
                  Sentiment: {(trend.sentiment * 100).toFixed(0)}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Graphique d'engagement */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Engagement</h2>
        <div className="h-[300px]">
          <DynamicLineChart
            data={analytics.map(a => ({
              date: new Date(a.recordedAt),
              value: a.value
            }))}
            width={800}
            height={300}
          />
        </div>
      </div>
    </div>
  );
}; 