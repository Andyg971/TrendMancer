import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Contenu principal avec padding pour la navbar fixe */}
      <main className="flex-grow pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo et description */}
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="text-2xl font-bold text-white">
                TrendMancer
              </Link>
              <p className="mt-2 text-gray-400">
                Transformez votre présence digitale avec l'intelligence artificielle.
                Détectez les tendances, créez du contenu engageant et développez votre audience.
              </p>
            </div>

            {/* Liens rapides */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Navigation
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/opportunities" className="text-gray-300 hover:text-white">
                    Opportunités
                  </Link>
                </li>
                <li>
                  <Link href="/collaboration" className="text-gray-300 hover:text-white">
                    Collaboration
                  </Link>
                </li>
                <li>
                  <Link href="/assistant" className="text-gray-300 hover:text-white">
                    Assistant
                  </Link>
                </li>
                <li>
                  <Link href="/content" className="text-gray-300 hover:text-white">
                    Contenu
                  </Link>
                </li>
              </ul>
            </div>

            {/* Liens légaux */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Légal
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/privacy" className="text-gray-300 hover:text-white">
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-300 hover:text-white">
                    Conditions d'utilisation
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-gray-300 hover:text-white">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-sm text-center">
              © {new Date().getFullYear()} TrendMancer. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}; 