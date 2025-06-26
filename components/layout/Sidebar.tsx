'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  UsersIcon, 
  CalendarIcon, 
  ChartBarIcon, 
  Cog6ToothIcon,
  UserGroupIcon // Icône pour Collaboration
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & { title?: string, titleId?: string } & React.RefAttributes<SVGSVGElement>>;
}

const navItems: NavItem[] = [
  { name: 'Tableau de bord', href: '/', icon: HomeIcon },
  { name: 'Opportunités', href: '/opportunities', icon: ChartBarIcon }, // Assumant une page /opportunities
  { name: 'Collaboration', href: '/collaboration', icon: UserGroupIcon }, // Ajout du lien Collaboration
  { name: 'Calendrier', href: '/calendar', icon: CalendarIcon },       // Assumant une page /calendar
  { name: 'Paramètres', href: '/settings', icon: Cog6ToothIcon },      // Assumant une page /settings
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <motion.aside 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-40"
    >
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-600">TrendMancer</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = item.icon; // Récupère le composant icône
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors relative ${isActive ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
            >
              {/* Affiche le composant icône ici */}
              <IconComponent className="h-5 w-5" /> 
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      {/* Footer ou autres éléments ici si nécessaire */}
    </motion.aside>
  );
};

export default Sidebar; 