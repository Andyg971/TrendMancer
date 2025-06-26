import React from 'react';

function MediaLibrary() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with actions */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Bibliothèque de Médias</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Gérez vos images et vidéos pour tous vos réseaux sociaux
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 text-sm font-medium">
              Créer un dossier
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
              Importer des médias
            </button>
          </div>
        </div>
        
        {/* Filter and view options */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input 
                type="text" 
                className="w-full md:w-64 p-2.5 pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg" 
                placeholder="Rechercher..." 
              />
              <div className="absolute left-3 top-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <select className="p-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg">
              <option>Tous les types</option>
              <option>Images</option>
              <option>Vidéos</option>
              <option>GIFs</option>
            </select>
            
            <select className="p-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg">
              <option>Récents d'abord</option>
              <option>Anciens d'abord</option>
              <option>Par nom (A-Z)</option>
              <option>Par nom (Z-A)</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-700 dark:text-blue-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Folders */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Dossiers</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <FolderCard name="Instagram" count={48} />
            <FolderCard name="Facebook" count={32} />
            <FolderCard name="Twitter" count={24} />
            <FolderCard name="LinkedIn" count={16} />
            <FolderCard name="Campagne Été" count={56} />
          </div>
        </div>
        
        {/* Recent media */}
        <div>
          <h2 className="text-lg font-medium mb-4">Médias récents</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <MediaCard 
              type="image" 
              thumbnail="/api/placeholder/200/200" 
              name="produit-01.jpg" 
              size="1.2 MB" 
              dimension="1200 x 800" 
              date="Aujourd'hui" 
            />
            <MediaCard 
              type="image" 
              thumbnail="/api/placeholder/200/200" 
              name="banner-printemps.jpg" 
              size="2.4 MB" 
              dimension="1800 x 1200" 
              date="Aujourd'hui" 
            />
            <MediaCard 
              type="video" 
              thumbnail="/api/placeholder/200/200" 
              name="promo-video.mp4" 
              size="8.7 MB" 
              dimension="1920 x 1080" 
              date="Hier" 
            />
            <MediaCard 
              type="image" 
              thumbnail="/api/placeholder/200/200" 
              name="team-photo.jpg" 
              size="3.1 MB" 
              dimension="2400 x 1600" 
              date="Hier" 
            />
            <MediaCard 
              type="image" 
              thumbnail="/api/placeholder/200/200" 
              name="logo-transparent.png" 
              size="0.8 MB" 
              dimension="800 x 800" 
              date="3 jours" 
            />
            <MediaCard 
              type="gif" 
              thumbnail="/api/placeholder/200/200" 
              name="animation.gif" 
              size="4.2 MB" 
              dimension="600 x 400" 
              date="5 jours" 
            />
            <MediaCard 
              type="image" 
              thumbnail="/api/placeholder/200/200" 
              name="product-lifestyle.jpg" 
              size="2.8 MB" 
              dimension="2000 x 1500" 
              date="5 jours" 
            />
            <MediaCard 
              type="video" 
              thumbnail="/api/placeholder/200/200" 
              name="testimonial.mp4" 
              size="12.5 MB" 
              dimension="1920 x 1080" 
              date="1 semaine" 
            />
            <MediaCard 
              type="image" 
              thumbnail="/api/placeholder/200/200" 
              name="infographic.png" 
              size="1.5 MB" 
              dimension="1080 x 1920" 
              date="1 semaine" 
            />
            <MediaCard 
              type="image" 
              thumbnail="/api/placeholder/200/200" 
              name="cover-photo.jpg" 
              size="3.4 MB" 
              dimension="1200 x 630" 
              date="2 semaines" 
            />
          </div>
        </div>
        
        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-1">
            <button className="px-2 py-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="px-3 py-1 rounded-md bg-blue-600 text-white">1</button>
            <button className="px-3 py-1 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">2</button>
            <button className="px-3 py-1 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">3</button>
            <span className="px-2 py-1 text-gray-500 dark:text-gray-400">...</span>
            <button className="px-3 py-1 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">8</button>
            <button className="px-2 py-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

// Folder card component
function FolderCard({ name, count }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="font-medium text-gray-900 dark:text-white">{name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{count} fichiers</p>
        </div>
      </div>
    </div>
  );
}

// Media card component
function MediaCard({ type, thumbnail, name, size, dimension, date }) {
  const getTypeIcon = () => {
    switch(type) {
      case 'video':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'gif':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
    }
  };
  
  return (
    <div className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="relative">
        <img src={thumbnail} alt={name} className="w-full h-40 object-cover" />
        <div className="absolute top-2 right-2 bg-gray-900/70 rounded-full p-1 text-white">
          {getTypeIcon()}
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
          <div className="flex space-x-2">
            <button className="p-2 bg-white rounded-full text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button className="p-2 bg-white rounded-full text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
            <button className="p-2 bg-white rounded-full text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium truncate" title={name}>{name}</h3>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>{size}</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}

export default MediaLibrary;