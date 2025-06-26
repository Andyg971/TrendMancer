import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Calendar, TrendingUp, Users, MessageSquare, Award, Clock, Filter, 
  RefreshCw, Download, ThumbsUp, Share2, Eye, HelpCircle, Loader, AlertTriangle, FileText, Heart, Lightbulb, TrendingDown
} from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { 
  getUserPosts, getAnalyticsSummaries, getAIRecommendations, getAudienceMetrics,
  generateAnalyticsReport, generateSampleData, DateRange, SocialPost
} from '../../services/analyticsService';

// Types et interfaces
interface AnalyticsReport {
  posts: SocialPost[];
  summaries: any[];
  recommendations: any[];
  audienceData: any[];
  totalPosts: number;
  totalEngagement: number;
  averageEngagementRate: number;
  contentTypePerformance: {
    type: string;
    count: number;
    totalEngagement: number;
    averageEngagement: number;
  }[];
  bestPostingTimes: {
    day: string;
    hour: string;
    posts: number;
    engagement: number;
    engagementRate: number;
  }[];
  customInsights: string[];
}

// Constantes
const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
const DATE_RANGES = [
  { label: '7 derniers jours', value: 7 },
  { label: '30 derniers jours', value: 30 },
  { label: '90 derniers jours', value: 90 }
];
const PLATFORMS = [
  { label: 'Toutes les plateformes', value: 'all' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'Twitter', value: 'twitter' },
  { label: 'LinkedIn', value: 'linkedin' }
];

const AnalyticsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsReport | null>(null);
  const [hasData, setHasData] = useState<boolean>(true);
  const [isGeneratingSampleData, setIsGeneratingSampleData] = useState<boolean>(false);
  const [sampleDataSuccess, setSampleDataSuccess] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date()
  });
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  // Récupérer l'ID utilisateur actuel
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      } else {
        setIsLoading(false);
        setError("Vous devez être connecté pour accéder à cette page.");
      }
    };

    getCurrentUser();
  }, []);

  // Récupérer les données d'analytics
  useEffect(() => {
    if (userId) {
      fetchAnalyticsData();
    }
  }, [userId, dateRange, platformFilter]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await generateAnalyticsReport(
        userId as string, 
        dateRange, 
        platformFilter
      );

      if (error) {
        throw new Error(error.toString());
      }

      if (!data || data.posts.length === 0) {
        setHasData(false);
        setAnalyticsData(null);
      } else {
        setHasData(true);
        setAnalyticsData(data);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des données d\'analytics:', err);
      setError("Une erreur est survenue lors de la récupération des données.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateRangeChange = (days: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    setDateRange({ startDate, endDate });
  };

  const handlePlatformFilterChange = (platform: string) => {
    setPlatformFilter(platform);
  };

  const handleGenerateSampleData = async () => {
    if (!userId) return;
    
    setIsGeneratingSampleData(true);
    setSampleDataSuccess(false);
    
    try {
      const { data, error } = await generateSampleData(userId);
      
      if (error) throw error;
      
      setSampleDataSuccess(true);
      setTimeout(() => {
        fetchAnalyticsData();
      }, 1000);
    } catch (err) {
      console.error('Erreur lors de la génération des données d\'exemple:', err);
      setError("Une erreur est survenue lors de la génération des données d'exemple.");
    } finally {
      setIsGeneratingSampleData(false);
    }
  };

  const exportAnalyticsData = () => {
    if (!analyticsData) return;
    
    const dataStr = JSON.stringify(analyticsData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `trendmancer-analytics-${platformFilter}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="flex flex-col min-h-screen p-6 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Analyse des performances</h1>
        <p className="text-gray-600">Analysez les performances de vos publications et obtenez des recommandations personnalisées.</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Période :</span>
          <div className="flex space-x-2">
            {Object.entries(DATE_RANGES).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleDateRangeChange(value.value)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  dateRange.startDate.getTime() === new Date(new Date().setDate(new Date().getDate() - value.value)).getTime()
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {value.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Plateforme :</span>
          <div className="flex space-x-2">
            {Object.entries(PLATFORMS).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handlePlatformFilterChange(key)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  platformFilter === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {value.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-blue-700 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Chargement des données...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 rounded-lg border border-red-200">
          <h3 className="text-lg font-medium text-red-800">Erreur</h3>
          <p className="text-red-600">{error}</p>
        </div>
      ) : !hasData ? (
        <div className="p-8 bg-white rounded-lg shadow-sm border border-gray-200 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Aucune donnée disponible</h3>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas encore de données d'analyse pour la période et la plateforme sélectionnées.
          </p>
          
          <button
            onClick={handleGenerateSampleData}
            disabled={isGeneratingSampleData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingSampleData ? 'Génération en cours...' : 'Générer des données d\'exemple'}
          </button>
          
          {sampleDataSuccess && (
            <p className="mt-4 text-green-600">
              Données d'exemple générées avec succès! Actualisation en cours...
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* En-tête avec les statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Publications totales" 
              value={analyticsData?.totalPosts.toString() || "0"} 
              icon={<FileText className="w-6 h-6 text-blue-500" />} 
              change={analyticsData?.summary.postsGrowthRate} 
            />
            <StatCard 
              title="Engagement moyen" 
              value={analyticsData?.averageEngagementRate.toFixed(1) || "0"} 
              icon={<Heart className="w-6 h-6 text-pink-500" />} 
              change={analyticsData?.summary.engagementGrowthRate} 
            />
            <StatCard 
              title="Impressions totales" 
              value={`${(analyticsData?.summary.totalImpressions || 0).toLocaleString()}`} 
              icon={<Eye className="w-6 h-6 text-purple-500" />} 
              change={analyticsData?.summary.impressionsGrowthRate} 
            />
            <StatCard 
              title="Audience" 
              value={`${(analyticsData?.audienceMetrics?.totalFollowers || 0).toLocaleString()}`} 
              icon={<Users className="w-6 h-6 text-green-500" />} 
              change={analyticsData?.audienceMetrics?.followerGrowthRate} 
            />
          </div>

          {/* Plateforme performante */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance par plateforme</h3>
              
              {Object.entries(analyticsData?.platformStats || {}).map(([platform, stats]) => {
                const platformInfo = PLATFORMS[platform as keyof typeof PLATFORMS] || { label: platform, color: 'gray' };
                const percentage = (stats.posts / analyticsData!.totalPosts) * 100;
                
                return (
                  <div key={platform} className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{platformInfo.label}</span>
                      <span className="text-sm text-gray-600">{stats.posts} publications</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full bg-${platformInfo.color}-500`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Engagement: {stats.avgEngagement.toFixed(1)}</span>
                      <span>Impressions: {stats.totalImpressions.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Insights de contenu */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Insights de contenu</h3>
              
              <div className="space-y-4">
                {analyticsData?.contentInsights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-blue-100">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{insight.title}</h4>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommandations IA */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Recommandations de l'IA</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Données mises à jour le {new Date().toLocaleDateString()}</span>
                <button 
                  onClick={exportAnalyticsData}
                  className="p-1.5 rounded-md hover:bg-gray-100"
                  title="Exporter les données"
                >
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {analyticsData?.recommendations.map((recommendation, index) => (
                <div key={index} className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <div className="flex gap-3 mb-3">
                    <div className="p-2 rounded-full bg-blue-600/10">
                      <Lightbulb className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{recommendation.title}</h4>
                      <p className="text-sm text-gray-600">{recommendation.category}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{recommendation.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Meilleurs moments de publication */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Meilleurs moments de publication</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(analyticsData?.bestPostingTimes || {}).map(([platform, times]) => {
                const platformInfo = PLATFORMS[platform as keyof typeof PLATFORMS] || { label: platform, color: 'gray' };
                
                return (
                  <div key={platform} className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">{platformInfo.label}</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {times.length > 0 
                            ? times.map(time => {
                                const [hour, minute] = time.split(':');
                                return `${hour}h${minute}`;
                              }).join(', ')
                            : 'Données insuffisantes'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Composant pour afficher une statistique
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon}
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {change !== undefined && (
          <div className={`flex items-center text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            <span>{Math.abs(change).toFixed(1)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage; 