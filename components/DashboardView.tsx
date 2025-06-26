'use client';

import React, { useEffect, useState } from 'react';
import { OpportunitiesView } from '@/features/opportunities/OpportunitiesView';
import { DynamicCalendar } from '@/components/DynamicImports';
import { DynamicLineChart } from '@/components/DynamicImports';
import { motion } from 'framer-motion';
import { calendarLocalizer, CalendarEvent, CalendarService } from '@/features/calendar/CalendarService';

const calendarService = new CalendarService();

// Accesseurs de dates pour le calendrier typés correctement
const getEventStart = (event: object): Date => (event as CalendarEvent).start;
const getEventEnd = (event: object): Date => (event as CalendarEvent).end;

export const DashboardView: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const calendarEvents = await calendarService.getEvents();
        setEvents(calendarEvents);
      } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-800"
      >
        Tableau de bord
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section Opportunités en temps réel */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Opportunités en temps réel</h2>
          <OpportunitiesView />
        </motion.div>

        {/* Section Calendrier de contenu */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Calendrier de contenu</h2>
          <div className="h-[500px]">
            <DynamicCalendar 
              localizer={calendarLocalizer}
              events={events}
              startAccessor={getEventStart}
              endAccessor={getEventEnd}
              style={{ height: '100%' }}
              views={['month', 'week', 'day']}
              messages={{
                next: "Suivant",
                previous: "Précédent",
                today: "Aujourd'hui",
                month: "Mois",
                week: "Semaine",
                day: "Jour"
              }}
            />
          </div>
        </motion.div>

        {/* Section Analytiques */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2"
        >
          <h2 className="text-xl font-semibold mb-4">Analytiques</h2>
          <DynamicLineChart 
            data={[]} // TODO: Ajouter les données d'analytiques réelles
            width={800}
            height={300}
          />
        </motion.div>
      </div>
    </div>
  );
}; 