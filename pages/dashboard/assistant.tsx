import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Send, User, Bot, Loader2, Clipboard, Check, ThumbsUp, ThumbsDown, Clock, Bookmark, History } from 'lucide-react';
import { generateAIContent, savePrompt, getUserPromptHistory, getPromptTemplates, AIPromptTemplate } from '../../services/aiService';
import { supabase } from '../../utils/supabase';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface GeneratedContent {
  id: string;
  platform: string;
  content: string;
}

const AssistantPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Bonjour ! Je suis l'assistant TrendMancer. Comment puis-je vous aider aujourd'hui ? Je peux vous aider à générer du contenu pour vos réseaux sociaux, suggérer des idées de publications, optimiser vos textes et bien plus encore.",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [generatedContents, setGeneratedContents] = useState<GeneratedContent[]>([]);
  const [contentType, setContentType] = useState('post');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram', 'linkedin']);
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [keywords, setKeywords] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Nouveaux états
  const [promptHistory, setPromptHistory] = useState<any[]>([]);
  const [promptTemplates, setPromptTemplates] = useState<AIPromptTemplate[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<AIPromptTemplate | null>(null);
  const [ratingPromptId, setRatingPromptId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effet pour récupérer l'utilisateur actuel
  useEffect(() => {
    async function getCurrentUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        loadUserPromptHistory(user.id);
        loadPromptTemplates();
      }
    }
    
    getCurrentUser();
  }, []);
  
  // Charger l'historique des prompts de l'utilisateur
  const loadUserPromptHistory = async (userId: string) => {
    setIsLoadingHistory(true);
    const { data, error } = await getUserPromptHistory(userId);
    
    if (data && !error) {
      setPromptHistory(data);
    } else if (error) {
      console.error("Erreur lors du chargement de l'historique:", error);
    }
    
    setIsLoadingHistory(false);
  };
  
  // Charger les modèles de prompts
  const loadPromptTemplates = async () => {
    const { data, error } = await getPromptTemplates();
    
    if (data && !error) {
      setPromptTemplates(data);
    } else if (error) {
      console.error("Erreur lors du chargement des modèles:", error);
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    // Utiliser le service d'IA pour générer du contenu
    try {
      // Analyser si c'est une demande de génération de contenu
      const isContentRequest = 
        inputValue.toLowerCase().includes('publication') || 
        inputValue.toLowerCase().includes('post') || 
        inputValue.toLowerCase().includes('contenu');
      
      if (isContentRequest) {
        // Générer du contenu avec notre service
        const generationResult = generateAIContent(
          inputValue,
          selectedPlatforms,
          tone,
          contentType,
          keywords
        );
        
        const assistantResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: generationResult.response,
          sender: 'assistant',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantResponse]);
        setGeneratedContents(generationResult.contents);
        
        // Sauvegarder le prompt et la réponse si l'utilisateur est connecté
        if (user) {
          await savePrompt({
            user_id: user.id,
            prompt: inputValue,
            response: generationResult.response,
            platforms: selectedPlatforms,
            tone: tone,
            content_type: contentType,
            keywords: keywords,
            usage_stats: { generated_platforms: selectedPlatforms.length }
          });
          
          // Rafraîchir l'historique
          loadUserPromptHistory(user.id);
        }
      } else {
        // Réponse générique si ce n'est pas une demande de génération de contenu
        const assistantResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: "Je peux vous aider à créer du contenu pour vos réseaux sociaux. Dites-moi simplement quel type de publication vous souhaitez et pour quelles plateformes. Vous pouvez aussi préciser le ton et les mots-clés que vous souhaitez utiliser.",
          sender: 'assistant',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantResponse]);
        setGeneratedContents([]);
        
        // Sauvegarder également cette interaction
        if (user) {
          await savePrompt({
            user_id: user.id,
            prompt: inputValue,
            response: assistantResponse.content
          });
          
          // Rafraîchir l'historique
          loadUserPromptHistory(user.id);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la génération de contenu:", error);
      
      // Message d'erreur en cas de problème
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Désolé, j'ai rencontré un problème lors de la génération du contenu. Veuillez réessayer plus tard.",
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  // Fonction pour utiliser un modèle de prompt prédéfini
  const useTemplate = (template: AIPromptTemplate) => {
    setSelectedTemplate(template);
    setInputValue(template.template);
    setShowTemplates(false);
  };
  
  // Fonction pour réutiliser un prompt de l'historique
  const reusePrompt = (historyItem: any) => {
    // Récupérer les paramètres du prompt historique
    setSelectedPlatforms(historyItem.platforms || ['instagram', 'linkedin']);
    setTone(historyItem.tone || 'professional');
    setContentType(historyItem.content_type || 'post');
    setKeywords(historyItem.keywords || '');
    
    // Définir le prompt dans le champ de saisie
    setInputValue(historyItem.prompt);
    
    // Fermer le panneau d'historique
    setShowHistory(false);
  };
  
  // Fonction pour générer du contenu avec le bouton dédié
  const handleGenerateContent = async () => {
    if (keywords.trim() === '') {
      // Si pas de mots-clés spécifiés, demander confirmation
      if (!confirm("Vous n'avez pas spécifié de mots-clés. Voulez-vous continuer quand même ?")) {
        return;
      }
    }
    
    const userPrompt = `Générer ${contentType === 'post' ? 'une publication' : contentType === 'advert' ? 'une publicité' : contentType === 'story' ? 'une story' : 'un contenu'} pour ${selectedPlatforms.join(', ')} avec un ton ${tone} et les mots-clés suivants: ${keywords || 'aucun mot-clé spécifié'}`;
    
    // Utiliser la fonction existante avec le prompt généré
    setInputValue(userPrompt);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePlatformChange = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const copyToClipboard = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const generateContent = () => {
    const userPrompt = `Générer ${contentType === 'post' ? 'une publication' : contentType === 'advert' ? 'une publicité' : contentType === 'story' ? 'une story' : 'un contenu'} pour ${selectedPlatforms.join(', ')} avec un ton ${tone} et les mots-clés suivants: ${keywords || 'aucun mot-clé spécifié'}`;
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: userPrompt,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsTyping(true);
    
    // Simuler la génération de contenu après un délai
    setTimeout(() => {
      const assistantResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Voici le contenu généré selon vos critères. N'hésitez pas à me demander des ajustements si nécessaire !",
        sender: 'assistant',
        timestamp: new Date()
      };
      
      // Générer du contenu pour chaque plateforme sélectionnée
      const newGeneratedContents: GeneratedContent[] = [];
      
      if (selectedPlatforms.includes('instagram')) {
        newGeneratedContents.push({
          id: `instagram-${Date.now()}`,
          platform: 'Instagram',
          content: tone === 'professional' 
            ? `✨ Innovation et excellence au service de votre quotidien ✨\n\nDécouvrez notre approche unique qui allie design contemporain et fonctionnalité. Chaque produit est conçu avec soin pour répondre à vos besoins spécifiques.\n\n${keywords ? `#${keywords.split(',').map(k => k.trim()).join(' #')}` : '#Innovation #Excellence #Design'}`
            : tone === 'casual'
            ? `Hey ! 👋 On a quelque chose de cool à vous montrer ! 😍\n\nOn a travaillé dur ces derniers mois et on est super excités de partager ça avec vous. Swipez pour découvrir notre dernière création !\n\n${keywords ? `#${keywords.split(',').map(k => k.trim()).join(' #')}` : '#Nouveau #Cool #Découverte'}`
            : `🔥 INCROYABLE NOUVEAUTÉ ! 🔥\n\nVous n'avez JAMAIS rien vu de tel ! Notre toute dernière innovation va RÉVOLUTIONNER votre façon de voir les choses ! À découvrir ABSOLUMENT ! 😱\n\n${keywords ? `#${keywords.split(',').map(k => k.trim()).join(' #')}` : '#Incroyable #Révolution #MustHave'}`
        });
      }
      
      if (selectedPlatforms.includes('linkedin')) {
        newGeneratedContents.push({
          id: `linkedin-${Date.now()}`,
          platform: 'LinkedIn',
          content: tone === 'professional' 
            ? `Nous sommes fiers d'annoncer le lancement de notre dernière innovation, fruit d'un travail collaboratif intensif et d'une recherche approfondie.\n\nCette avancée représente parfaitement notre engagement continu envers l'excellence et la satisfaction client qui ont toujours été au cœur de notre philosophie d'entreprise.\n\nN'hésitez pas à me contacter pour plus d'informations sur cette initiative passionnante.\n\n${keywords ? `#${keywords.split(',').map(k => k.trim()).join(' #')}` : '#Innovation #Excellence #Leadership'}`
            : tone === 'casual'
            ? `Heureux de partager avec mon réseau notre dernière réalisation !\n\nAprès plusieurs mois de travail en équipe, nous avons enfin lancé ce projet qui nous tient à cœur. Un grand merci à tous ceux qui ont contribué à ce succès.\n\nQu'en pensez-vous ? Vos retours sont les bienvenus !\n\n${keywords ? `#${keywords.split(',').map(k => k.trim()).join(' #')}` : '#Collaboration #Projet #Partage'}`
            : `🚀 ANNONCE MAJEURE ! 🚀\n\nJe suis EXTRÊMEMENT FIER de vous présenter notre RÉVOLUTION dans le secteur ! Une innovation qui va TRANSFORMER votre façon de travailler !\n\nDemandez-moi comment en profiter dès MAINTENANT !\n\n${keywords ? `#${keywords.split(',').map(k => k.trim()).join(' #')}` : '#Disruption #Innovation #GameChanger'}`
        });
      }
      
      setMessages(prev => [...prev, assistantResponse]);
      setGeneratedContents(newGeneratedContents);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-130px)]">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  IA
                </div>
                <div className="ml-3">
                  <h2 className="font-semibold text-gray-900 dark:text-white">Assistant TrendMancer</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Propulsé par IA avancée</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex items-start ${message.sender === 'user' ? 'justify-end' : ''}`}
                >
                  {message.sender === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div 
                    className={`ml-3 p-4 rounded-lg max-w-3xl ${
                      message.sender === 'user' 
                        ? 'bg-blue-500 text-white rounded-tr-none mr-3 ml-0' 
                        : 'bg-gray-100 dark:bg-gray-700 rounded-tl-none text-gray-800 dark:text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 text-xs font-bold flex-shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="ml-3 bg-gray-100 dark:bg-gray-700 rounded-lg rounded-tl-none p-4 max-w-3xl">
                    <div className="flex space-x-1 items-center">
                      <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                      <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              {generatedContents.length > 0 && (
                <div className="flex items-start">
                  <div className="ml-11 space-y-4 w-full">
                    {generatedContents.map((content) => (
                      <div key={content.id} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{content.platform}</p>
                          <div className="flex items-center space-x-2">
                            <button 
                              className="text-xs flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                              onClick={() => copyToClipboard(content.id, content.content)}
                            >
                              {copiedId === content.id ? (
                                <>
                                  <Check className="h-3 w-3 mr-1" />
                                  Copié
                                </>
                              ) : (
                                <>
                                  <Clipboard className="h-3 w-3 mr-1" />
                                  Copier
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                          {content.content}
                        </p>
                        {/* Boutons de notation */}
                        {user && ratingPromptId && (
                          <div className="mt-3 flex justify-end space-x-2">
                            <button className="text-xs flex items-center text-gray-500 hover:text-green-600">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              Utile
                            </button>
                            <button className="text-xs flex items-center text-gray-500 hover:text-red-600">
                              <ThumbsDown className="h-3 w-3 mr-1" />
                              Pas utile
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-2">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-xs flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <History className="h-3 w-3 mr-1" />
                  Historique
                </button>
                <button
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="text-xs flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Bookmark className="h-3 w-3 mr-1" />
                  Templates
                </button>
              </div>
              
              {/* Afficher l'historique des prompts */}
              {showHistory && (
                <div className="mb-3 max-h-32 overflow-y-auto bg-gray-50 dark:bg-gray-750 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                  {isLoadingHistory ? (
                    <div className="flex justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    </div>
                  ) : promptHistory.length > 0 ? (
                    <div className="space-y-1">
                      {promptHistory.map((item) => (
                        <div 
                          key={item.id}
                          className="p-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center"
                          onClick={() => reusePrompt(item)}
                        >
                          <Clock className="h-3 w-3 mr-2 text-gray-500" />
                          <div className="truncate">{item.prompt}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-center text-gray-500 py-2">Aucun historique disponible</p>
                  )}
                </div>
              )}
              
              {/* Afficher les templates */}
              {showTemplates && (
                <div className="mb-3 max-h-32 overflow-y-auto bg-gray-50 dark:bg-gray-750 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                  {promptTemplates.length > 0 ? (
                    <div className="space-y-1">
                      {promptTemplates.map((template) => (
                        <div 
                          key={template.id}
                          className="p-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-start"
                          onClick={() => useTemplate(template)}
                        >
                          <Bookmark className="h-3 w-3 mr-2 text-gray-500 mt-0.5" />
                          <div>
                            <div className="font-medium">{template.name}</div>
                            <div className="text-gray-500 truncate">{template.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-center text-gray-500 py-2">Aucun template disponible</p>
                  )}
                </div>
              )}
              
              <div className="flex items-center">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Écrivez votre message..."
                  className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  rows={1}
                />
                <button 
                  className="ml-2 p-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSendMessage}
                  disabled={inputValue.trim() === '' || isTyping}
                >
                  {isTyping ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">Paramètres de génération</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type de contenu</label>
                <select 
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                >
                  <option value="post">Publication régulière</option>
                  <option value="advert">Publicité</option>
                  <option value="story">Story</option>
                  <option value="event">Événement</option>
                  <option value="testimonial">Témoignage client</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Plateformes</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="instagram"
                      checked={selectedPlatforms.includes('instagram')} 
                      onChange={() => handlePlatformChange('instagram')}
                      className="h-4 w-4 text-blue-600 rounded" 
                    />
                    <label htmlFor="instagram" className="ml-2 text-sm">Instagram</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="linkedin"
                      checked={selectedPlatforms.includes('linkedin')} 
                      onChange={() => handlePlatformChange('linkedin')}
                      className="h-4 w-4 text-blue-600 rounded" 
                    />
                    <label htmlFor="linkedin" className="ml-2 text-sm">LinkedIn</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="facebook"
                      checked={selectedPlatforms.includes('facebook')} 
                      onChange={() => handlePlatformChange('facebook')}
                      className="h-4 w-4 text-blue-600 rounded" 
                    />
                    <label htmlFor="facebook" className="ml-2 text-sm">Facebook</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="twitter"
                      checked={selectedPlatforms.includes('twitter')} 
                      onChange={() => handlePlatformChange('twitter')}
                      className="h-4 w-4 text-blue-600 rounded" 
                    />
                    <label htmlFor="twitter" className="ml-2 text-sm">Twitter</label>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Ton</label>
                <select 
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  <option value="professional">Professionnel</option>
                  <option value="casual">Décontracté</option>
                  <option value="enthusiastic">Enthousiaste</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Longueur</label>
                <select 
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                >
                  <option value="short">Courte</option>
                  <option value="medium">Moyenne</option>
                  <option value="long">Longue</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Mots-clés (séparés par des virgules)</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" 
                  placeholder="ex: printemps, collection, mode"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>
              
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <button 
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                  onClick={handleGenerateContent}
                  disabled={isTyping || selectedPlatforms.length === 0}
                >
                  {isTyping ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Génération...
                    </div>
                  ) : (
                    'Générer du contenu'
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {user && promptHistory.length > 0 && (
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Historique des générations</h2>
              
              <div className="space-y-3">
                {promptHistory.slice(0, 3).map((item) => (
                  <div 
                    key={item.id}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer"
                    onClick={() => reusePrompt(item)}
                  >
                    <p className="text-sm font-medium">{item.prompt.length > 30 ? item.prompt.substring(0, 30) + '...' : item.prompt}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
                
                {promptHistory.length > 3 && (
                  <button 
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 w-full text-center mt-2"
                    onClick={() => setShowHistory(true)}
                  >
                    Voir tout l'historique
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AssistantPage; 