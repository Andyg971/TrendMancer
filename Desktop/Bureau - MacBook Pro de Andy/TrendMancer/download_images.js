const fs = require('fs');
const https = require('https');
const path = require('path');

// Fonction pour télécharger une image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(__dirname, 'public', filename);
    const file = fs.createWriteStream(filepath);

    https.get(url, response => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Téléchargement terminé: ${filename}`);
          resolve();
        });
      } else {
        file.close();
        fs.unlink(filepath, () => {}); // Supprimer le fichier en cas d'erreur
        console.error(`Échec du téléchargement de ${filename}, statut HTTP: ${response.statusCode}`);
        reject(new Error(`HTTP Status ${response.statusCode}`));
      }
    }).on('error', err => {
      fs.unlink(filepath, () => {}); // Supprimer le fichier en cas d'erreur
      console.error(`Erreur lors du téléchargement de ${filename}: ${err.message}`);
      reject(err);
    });
  });
}

// Liste des images à télécharger avec des URLs plus fiables
const images = [
  {
    url: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1000',
    filename: 'dashboard-preview.jpg'
  },
  {
    url: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1000',
    filename: 'social-dashboard.jpg'
  },
  {
    url: 'https://images.pexels.com/photos/6177645/pexels-photo-6177645.jpeg?auto=compress&cs=tinysrgb&w=1000',
    filename: 'content-creation.jpg'
  },
  {
    url: 'https://images.pexels.com/photos/3243090/pexels-photo-3243090.jpeg?auto=compress&cs=tinysrgb&w=1000',
    filename: 'scheduling.jpg'
  },
  {
    url: 'https://images.pexels.com/photos/7413915/pexels-photo-7413915.jpeg?auto=compress&cs=tinysrgb&w=1000',
    filename: 'analytics.jpg'
  },
  {
    url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1000',
    filename: 'community.jpg'
  },
  {
    url: 'https://images.pexels.com/photos/3194518/pexels-photo-3194518.jpeg?auto=compress&cs=tinysrgb&w=1000',
    filename: 'media-library.jpg'
  },
  {
    url: 'https://images.pexels.com/photos/1181395/pexels-photo-1181395.jpeg?auto=compress&cs=tinysrgb&w=1000',
    filename: 'campaigns.jpg'
  },
  {
    url: 'https://images.pexels.com/photos/3183132/pexels-photo-3183132.jpeg?auto=compress&cs=tinysrgb&w=1000',
    filename: 'demo-video-preview.jpg'
  }
];

// Télécharger toutes les images
async function downloadAllImages() {
  console.log('Début du téléchargement des images...');
  
  // Créer le dossier public s'il n'existe pas
  if (!fs.existsSync(path.join(__dirname, 'public'))) {
    fs.mkdirSync(path.join(__dirname, 'public'));
  }
  
  // Variable pour suivre si tous les téléchargements ont réussi
  let allSuccessful = true;
  
  try {
    const results = await Promise.allSettled(images.map(image => downloadImage(image.url, image.filename)));
    
    // Vérifier les résultats
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        allSuccessful = false;
        console.error(`Échec du téléchargement de ${images[index].filename}: ${result.reason}`);
      }
    });
    
    if (allSuccessful) {
      console.log('Tous les téléchargements sont terminés avec succès!');
    } else {
      console.log('Certains téléchargements ont échoué. Vérifiez les erreurs ci-dessus.');
    }
  } catch (error) {
    console.error('Une erreur est survenue lors du téléchargement des images:', error);
  }
}

// Exécuter le téléchargement
downloadAllImages(); 