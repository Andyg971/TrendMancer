import React from 'react';
import { motion } from 'framer-motion';
import { ContentCalendarItem, Project } from '@/types';
import { TrendMancerService } from '@/services/TrendMancerService';
import { DynamicCalendar } from '../DynamicImports';

const service = new TrendMancerService();

export const ContentCalendarView: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [content, setContent] = React.useState<ContentCalendarItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

  React.useEffect(() => {
    const fetchContent = async () => {
      try {
        const contentData = await service.getContentCalendar(projectId);
        setContent(contentData);
      } catch (error) {
        console.error('Erreur lors du chargement du calendrier:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [projectId]);

  const calendarEvents = content.map(item => ({
    id: item.id,
    title: item.title,
    start: new Date(item.scheduledFor),
    end: new Date(item.scheduledFor),
    allDay: true,
    resource: item
  }));

  const handleSelectEvent = (event: any) => {
    // Ouvrir le modal d'édition avec l'événement sélectionné
    console.log('Événement sélectionné:', event);
  };

  const handleSelectSlot = (slotInfo: any) => {
    // Ouvrir le modal de création avec la date sélectionnée
    setSelectedDate(slotInfo.start);
  };

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
        <h1 className="text-2xl font-bold">Calendrier de contenu</h1>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          onClick={() => handleSelectSlot({ start: new Date() })}
        >
          Nouvelle publication
        </button>
      </div>

      {/* Calendrier */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm"
      >
        <div className="h-[600px]">
          <DynamicCalendar
            events={calendarEvents}
            defaultView="month"
            selectable
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            style={{ height: '100%' }}
          />
        </div>
      </motion.div>

      {/* Liste des publications prévues */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Publications à venir</h2>
        <div className="space-y-4">
          {content
            .filter(item => new Date(item.scheduledFor) > new Date())
            .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())
            .slice(0, 5)
            .map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border p-4 rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(item.scheduledFor).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.status === 'draft' ? 'bg-gray-100 text-gray-600' :
                    item.status === 'scheduled' ? 'bg-blue-100 text-blue-600' :
                    item.status === 'published' ? 'bg-green-100 text-green-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.content}</p>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}; 