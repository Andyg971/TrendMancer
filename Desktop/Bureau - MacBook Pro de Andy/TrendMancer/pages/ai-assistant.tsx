import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  BarChart3, 
  Bell, 
  Calendar, 
  Home, 
  LogOut, 
  MessageSquare, 
  Users,
  Send,
  Sparkles,
  PlusCircle,
  ArrowRight,
  Settings,
  ChevronDown,
  Download,
  Image as ImageIcon,
  BarChart,
  LineChart,
  PenTool,
  RotateCcw
} from 'lucide-react';

const AIAssistantPage = () => {
  const router = useRouter();
  const [userName, setUserName] = useState('Utilisateur');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<{role: string; content: string; timestamp: Date}[]>([
    {
      role: 'assistant',
      content: 'Bonjour ! Je suis l\'assistant IA de TrendMancer. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Exemples de suggestions pour l'assistant
  const suggestions = [
    "Génère 3 idées de posts Instagram pour ma boutique de vêtements",
    "Analyse les tendances de mon secteur pour le mois prochain",
    "Suggère un planning de publication pour la semaine",
    "Rédige une biographie Instagram professionnelle"
  ];

  // Exemples de modèles de contenu
  const templates = [
    { id: "1", name: "Post Instagram", icon: <ImageIcon className="h-5 w-5" /> },
    { id: "2", name: "Thread Twitter", icon: <MessageSquare className="h-5 w-5" /> },
    { id: "3", name: "Rapport d'analyse", icon: <BarChart className="h-5 w-5" /> },
    { id: "4", name: "Planning éditorial", icon: <Calendar className="h-5 w-5" /> },
    { id: "5", name: "Bio de profil", icon: <PenTool className="h-5 w-5" /> }
  ];

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté (mode démo)
    const demoUser = localStorage.getItem('trendmancer-demo-user');
    
    if (demoUser) {
      try {
        const userData = JSON.parse(demoUser);
        setUserName(userData.name || 'Utilisateur Démo');
      } catch (e) {
        console.error('Erreur de parsing des données utilisateur');
      }
      setIsLoading(false);
    } else {
      // Rediriger vers la page de connexion si pas d'utilisateur
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    // Scroll to bottom whenever conversation changes
    scrollToBottom();
  }, [conversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('trendmancer-demo-user');
    router.push('/login');
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!message.trim() && !selectedTemplate) return;

    const newMessage = selectedTemplate || message;
    
    // Add user message to conversation
    setConversation(prev => [...prev, {
      role: 'user',
      content: newMessage,
      timestamp: new Date()
    }]);

    setMessage('');
    setSelectedTemplate('');
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const responses = {
        "Génère 3 idées de posts Instagram pour ma boutique de vêtements": 
          "Voici 3 idées de posts pour votre boutique de vêtements :\n\n" +
          "1️⃣ Carrousel \"Comment styler\" : Montrez un même vêtement porté de 3 façons différentes. Idéal pour mettre en valeur la versatilité de vos pièces.\n\n" +
          "2️⃣ Vidéo \"Behind the scenes\" : Partagez l'envers du décor d'une séance photo ou la préparation d'une nouvelle collection. Cela crée une connexion authentique avec votre audience.\n\n" +
          "3️⃣ Post \"Le saviez-vous\" sur l'entretien des vêtements : Partagez des conseils pour prolonger la durée de vie des vêtements. C'est informatif et montre votre engagement pour la durabilité.",
        
        "Analyse les tendances de mon secteur pour le mois prochain":
          "D'après l'analyse des tendances actuelles dans le secteur de la mode, voici ce qui sera populaire le mois prochain :\n\n" +
          "📈 Les couleurs terracotta et vert sauge continuent leur progression (+32% de recherches)\n\n" +
          "📈 La mode durable gagne en importance (intérêt en hausse de 47% par rapport à l'année dernière)\n\n" +
          "📈 Les contenus vidéo courts de type \"haul\" et \"try-on\" génèrent 3x plus d'engagement que les photos statiques\n\n" +
          "📈 Les collaborations avec des micro-influenceurs (5-25K followers) montrent un meilleur ROI que les partenariats avec de grands comptes\n\n" +
          "Je vous recommande d'adapter votre stratégie de contenu autour de ces tendances émergentes.",
        
        "Suggère un planning de publication pour la semaine":
          "Voici un planning de publication optimal pour une semaine :\n\n" +
          "𝗟𝘂𝗻𝗱𝗶 (10h) : Post motivationnel pour démarrer la semaine - Engagement élevé le matin\n\n" +
          "𝗠𝗮𝗿𝗱𝗶 (17h) : Présentation produit (Instagram) - Bon taux de conversion en fin de journée\n\n" +
          "𝗠𝗲𝗿𝗰𝗿𝗲𝗱𝗶 (12h) : Contenu éducatif/conseils sur LinkedIn - Parfait pour la pause déjeuner\n\n" +
          "𝗝𝗲𝘂𝗱𝗶 (16h) : Story interactive/sondage - Engagement optimal avant la fin de journée\n\n" +
          "𝗩𝗲𝗻𝗱𝗿𝗲𝗱𝗶 (20h) : Contenu divertissant ou promotionnel - Les utilisateurs sont détendus et réceptifs\n\n" +
          "𝗦𝗮𝗺𝗲𝗱𝗶 (11h) : Témoignage client ou UGC - Idéal quand les utilisateurs ont du temps libre\n\n" +
          "𝗗𝗶𝗺𝗮𝗻𝗰𝗺𝗲 (15h) : Contenu inspirationnel ou teaser pour la semaine suivante",
        
        "Rédige une biographie Instagram professionnelle":
          "Voici une proposition de biographie Instagram professionnelle :\n\n" +
          "✨ [Nom de votre marque] | Mode éthique & intemporelle\n" +
          "🌿 Créations durables fabriquées en France\n" +
          "🛍️ Nouvelles collections chaque saison\n" +
          "💌 Service client : contact@votremarque.com\n" +
          "🔗 Découvrez notre nouvelle collection ⬇️\n\n" +
          "Vous pouvez adapter le texte selon votre positionnement unique et ajouter un call-to-action pertinent avec un lien vers votre site ou votre dernière collection.",

        "Post Instagram": 
          "✨ Voici un exemple de post Instagram pour votre marque :\n\n" +
          "📸 **Image principale** : Photo de votre produit phare dans un contexte lifestyle\n\n" +
          "📝 **Légende** :\n" +
          "Notre [nom du produit] fait son grand retour ! 🎉\n\n" +
          "Fabriqué avec [matériau durable], ce modèle allie style et confort pour toutes vos aventures quotidiennes.\n\n" +
          "🔸 Design exclusif\n" +
          "🔸 Fabrication éthique\n" +
          "🔸 Disponible en 5 coloris\n\n" +
          "Cliquez sur le lien en bio pour découvrir la collection complète !\n\n" +
          "#VotreMarque #ModeDurable #NouvelleCollection",

        "Thread Twitter":
          "Voici un exemple de thread Twitter sur les tendances marketing digital 2025 :\n\n" +
          "🧵 1/7 Les 6 tendances marketing qui vont dominer 2025 selon notre analyse de données. Un fil à lire et à partager avec vos équipes !\n\n" +
          "🧵 2/7 1️⃣ L'IA générative personnalis��e : les marques utilisent désormais l'IA pour créer du contenu ultra-ciblé pour chaque segment de leur audience.\n\n" +
          "🧵 3/7 2️⃣ Social shopping immersif : la réalité augmentée transforme l'expérience d'achat sur les réseaux sociaux avec des essayages virtuels impressionnants.\n\n" +
          "🧵 4/7 3️⃣ Contenu éphémère premium : les contenus temporaires deviennent le format privilégié pour les lancements exclusifs.\n\n" +
          "🧵 5/7 4️⃣ Marketing audio : podcasts de marque et expériences sonores immersives captivent l'attention dans un monde saturé visuellement.\n\n" +
          "🧵 6/7 5️⃣ Ultra-personnalisation : l'exploitation éthique des données permet des expériences sur-mesure jamais vues auparavant.\n\n" +
          "🧵 7/7 6️⃣ Communautés de niche : les micro-communautés remplacent les grandes audiences pour un engagement plus profond et authentique.\n\n" +
          "Laquelle vous intéresse le plus ? Répondez pour en savoir plus !",

        "Rapport d'analyse":
          "📊 **RAPPORT D'ANALYSE PERFORMANCE SOCIAL MEDIA**\n\n" +
          "**Période analysée** : 1er au 30 avril 2025\n\n" +
          "**CROISSANCE GLOBALE**\n" +
          "- Nouveaux abonnés : +782 (+8,5%)\n" +
          "- Impressions totales : 124,560 (+12%)\n" +
          "- Engagement moyen : 4,2% (+0,8%)\n\n" +
          "**PERFORMANCE PAR PLATEFORME**\n" +
          "- Instagram : 6,3% taux d'engagement (⬆️)\n" +
          "- LinkedIn : 4,1% taux d'engagement (⬆️)\n" +
          "- Twitter : 2,9% taux d'engagement (⬆️)\n" +
          "- Facebook : 1,8% taux d'engagement (⬇️)\n\n" +
          "**CONTENU LE PLUS PERFORMANT**\n" +
          "- Type : Vidéos courtes (<30s)\n" +
          "- Thèmes : Coulisses, Témoignages clients\n" +
          "- Horaires optimaux : 11h-12h et 18h-20h\n\n" +
          "**RECOMMANDATIONS**\n" +
          "1. Augmenter la fréquence des vidéos courtes (+20%)\n" +
          "2. Réduire les posts textuels sur Facebook (-15%)\n" +
          "3. Tester des Lives hebdomadaires sur Instagram\n" +
          "4. Optimiser le calendrier de publication selon les horaires de pointe",

        "Planning éditorial":
          "📅 **PLANNING ÉDITORIAL - MAI 2025**\n\n" +
          "**SEMAINE 1 : LANCEMENT COLLECTION ÉTÉ**\n" +
          "- Lundi : Teaser vidéo (Instagram, TikTok)\n" +
          "- Mardi : Présentation de la collection (toutes plateformes)\n" +
          "- Mercredi : Focus produit phare (Instagram)\n" +
          "- Jeudi : Interview designer (LinkedIn, YouTube)\n" +
          "- Vendredi : Tutoriel styling (Instagram Reels)\n" +
          "- Samedi : UGC & témoignages premiers clients\n" +
          "- Dimanche : Récapitulatif hebdo + sondage\n\n" +
          "**SEMAINE 2 : THÈME DURABILITÉ**\n" +
          "- Lundi : Infographie impact environnemental\n" +
          "- Mardi : Vidéo processus fabrication\n" +
          "- Mercredi : Portrait artisan partenaire\n" +
          "- Jeudi : Tips entretien vêtements\n" +
          "- Vendredi : Quiz interactif\n" +
          "- Week-end : Contenu communautaire\n\n" +
          "**CAMPAGNES**\n" +
          "- Promotion 10-15 mai : Code SUMMER25\n" +
          "- Influenceurs : Publications entre 5-20 mai\n" +
          "- Newsletter : Envois les 1, 15 et 30 mai",

        "Bio de profil":
          "📝 **BIO DE PROFIL PROFESSIONNELLE**\n\n" +
          "**Pour une marque de mode :**\n" +
          "✨ [NOM DE MARQUE] | Mode éthique & durable depuis 2023\n" +
          "👗 Pièces intemporelles fabriquées en France\n" +
          "🌿 Matières écologiques & production responsable\n" +
          "📦 Livraison offerte dès 75€ • Retours gratuits\n" +
          "👇 Découvrez notre nouvelle collection\n" +
          "[LIEN SITE WEB]\n\n" +
          "**Pour un(e) consultant(e) marketing :**\n" +
          "✨ [NOM] | Expert(e) Marketing Digital & Social Media\n" +
          "📊 J'aide les marques à dynamiser leur présence en ligne\n" +
          "🚀 +45% d'engagement moyen pour mes clients\n" +
          "💼 Ex-[Grandes entreprises ou clients notables]\n" +
          "📚 Conseils marketing chaque semaine\n" +
          "🔗 Réservez une consultation gratuite\n\n" +
          "N'oubliez pas d'ajouter des émojis pertinents pour votre secteur et de mettre à jour régulièrement votre bio en fonction des promotions ou nouveautés !"
      };

      // Valeur par défaut pour toute requête non répertoriée
      const defaultResponse = "Je vous remercie pour votre message. Permettez-moi d'y réfléchir et de vous proposer une réponse personnalisée.\n\n" +
        "Pour votre demande concernant \"" + newMessage + "\", je pourrais vous suggérer plusieurs approches adaptées à votre stratégie social media.\n\n" +
        "Souhaitez-vous des conseils plus spécifiques ou préférez-vous explorer d'autres aspects de votre stratégie de contenu ?";

      // Get response or use default
      const aiResponse = responses[newMessage as keyof typeof responses] || defaultResponse;

      setConversation(prev => [...prev, {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }]);
      
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    handleSendMessage();
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    handleSendMessage();
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:bg-white md:dark:bg-gray-800 md:border-r md:border-gray-200 md:dark:border-gray-700">
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
            TM
          </div>
          <span className="ml-3 text-xl font-bold text-gray-800 dark:text-white">TrendMancer</span>
        </div>
        <div className="flex flex-col justify-between flex-1 overflow-y-auto">
          <nav className="px-2 py-4">
            <Link href="/dashboard" className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <Home className="w-5 h-5" />
              <span className="mx-4 font-medium">Tableau de bord</span>
            </Link>
            
            <Link href="/calendar" className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <Calendar className="w-5 h-5" />
              <span className="mx-4 font-medium">Calendrier</span>
            </Link>
            
            <Link href="/analytics" className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <BarChart3 className="w-5 h-5" />
              <span className="mx-4 font-medium">Analytiques</span>
            </Link>
            
            <Link href="/community" className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <MessageSquare className="w-5 h-5" />
              <span className="mx-4 font-medium">Communauté</span>
            </Link>
            
            <Link href="/team" className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <Users className="w-5 h-5" />
              <span className="mx-4 font-medium">Équipe</span>
            </Link>

            <Link href="/ai-assistant" className="flex items-center px-4 py-2 mt-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <Sparkles className="w-5 h-5" />
              <span className="mx-4 font-medium">Assistant IA</span>
            </Link>
          </nav>
          
          <div className="px-2 py-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="mx-4 font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center md:hidden">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              TM
            </div>
          </div>
          
          <div className="hidden md:flex items-center">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Assistant IA</h1>
          </div>
          
          <div className="flex items-center">
            <button className="p-1 mr-4 text-gray-500 rounded-full hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:text-gray-300">
              <Bell className="w-6 h-6" />
            </button>
            
            <Link href="#" className="flex items-center text-gray-700 dark:text-gray-200">
              <span className="mr-2">{userName}</span>
              <div className="w-8 h-8 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-700 dark:text-gray-300 font-semibold">{userName.charAt(0)}</span>
              </div>
            </Link>
          </div>
        </header>

        {/* Main chat section */}
        <div className="flex-1 overflow-hidden flex">
          {/* Templates sidebar */}
          <div className="hidden md:flex md:flex-col md:w-64 md:bg-white md:dark:bg-gray-800 md:border-r md:border-gray-200 md:dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Modèles</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Générez du contenu rapidement</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.name)}
                    className="w-full flex items-center p-3 text-left bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                      {template.icon}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{template.name}</h3>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Actions rapides</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    <span className="flex items-center">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Nouvelle conversation
                    </span>
                  </button>
                  <button className="w-full flex items-center justify-between p-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    <span className="flex items-center">
                      <Download className="w-4 h-4 mr-2" />
                      Exporter la conversation
                    </span>
                  </button>
                  <button className="w-full flex items-center justify-between p-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    <span className="flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      Paramètres
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <div className="max-w-3xl mx-auto space-y-6">
                {conversation.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white'} rounded-2xl px-4 py-3 shadow-sm`}>
                      {msg.role === 'assistant' && (
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                            <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                            Assistant TrendMancer • {formatTimestamp(msg.timestamp)}
                          </span>
                        </div>
                      )}
                      <div className="whitespace-pre-line">
                        {msg.content}
                      </div>
                      {msg.role === 'user' && (
                        <div className="flex justify-end mt-1">
                          <span className="text-xs text-blue-200">{formatTimestamp(msg.timestamp)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce" style={{ animationDelay: '400ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Suggestions */}
            {conversation.length <= 2 && !isTyping && (
              <div className="px-4 mb-4">
                <div className="max-w-3xl mx-auto">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Suggestions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-left p-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
                      >
                        <p className="text-sm text-gray-800 dark:text-white truncate">{suggestion}</p>
                        <div className="flex items-center mt-1 text-xs text-blue-600 dark:text-blue-400">
                          <ArrowRight className="w-3.5 h-3.5 mr-1" />
                          <span>Essayer</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Input */}
            <div className="px-4 pb-4">
              <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSendMessage} className="relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isTyping}
                    placeholder="Demandez quelque chose à l'assistant..."
                    className="w-full pl-4 pr-12 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                  />
                  <div className="absolute right-2 top-2 flex items-center space-x-1">
                    <button
                      type="button"
                      className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      <PlusCircle className="h-5 w-5" />
                    </button>
                    <button
                      type="submit"
                      disabled={!message.trim() || isTyping}
                      className={`p-1 ${
                        message.trim() && !isTyping
                          ? 'text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400'
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </form>
                <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
                  L'assistant IA génère des contenus basés sur vos demandes. Révisez toujours avant publication.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;