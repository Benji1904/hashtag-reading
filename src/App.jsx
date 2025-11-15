import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { 
  Crown, LayoutGrid, Users, Wallet, Sparkles, 
  Check, Plus, Search, Bell, ArrowRight, 
  Clock, Heart, MessageCircle, Repeat, Share, 
  ImageIcon, PenTool, MoreHorizontal, 
  Send, LogOut, MapPin, ChevronRight,
  Shield, Database, Cloud, Palette, Globe,
  Moon, Sun, Settings, AlertCircle
} from 'lucide-react';

// ==============================================
// 1. CONFIGURATION (VOTRE LIEN EST INTÉGRÉ 👇)
// ==============================================
const KING_SUN_API_URL = "https://script.google.com/macros/s/AKfycbwVHgHgICiuUvqAzcOqZXn4UW2Mx2yWo8VhkOfBBxiKidOFU1oHllQlneezJjUT2ihb/exec";

// ==============================================
// 6 : DESIGN & ARCHITECTURE
// ==============================================

const cssStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&family=Urbanist:wght@300;400;500;600;700&display=swap');
    
    :root {
      --bg-deep: #000000;
      --bg-card: #090909;
      --border-subtle: #2F3336;
      --gold-pure: #D4AF37;
      --gold-glow: rgba(212, 175, 55, 0.3);
      --text-primary: #e7e9ea;
      --text-secondary: #71767b;
    }

    body.theme-white-gold {
      --bg-deep: #F5F5F5;
      --bg-card: #FFFFFF;
      --border-subtle: #E1E8ED;
      --gold-pure: #B8860B;
      --text-primary: #14171A;
      --text-secondary: #5B7083;
    }

    body {
      background-color: var(--bg-deep);
      color: var(--text-primary);
      font-family: 'Urbanist', sans-serif;
      margin: 0;
    }

    .font-royal { font-family: 'Cinzel', serif; }
    .text-gold { color: var(--gold-pure); }
    
    .text-gold-liquid {
      background: linear-gradient(135deg, #FDE68A 0%, var(--gold-pure) 50%, #92400E 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 0 15px var(--gold-glow));
    }

    .nav-dock {
      background: rgba(var(--bg-card), 0.85);
      backdrop-filter: blur(20px);
      border: 1px solid var(--border-subtle);
      border-radius: 100px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.8);
    }
    .theme-white-gold .nav-dock {
      background: rgba(255,255,255, 0.85);
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }

    .bento-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 24px;
      transition: all 0.2s ease;
    }
    .bento-card:active { transform: scale(0.98); }

    .tweet-card {
      border-bottom: 1px solid var(--border-subtle);
      padding: 1rem;
      background: transparent;
    }
    
    .input-royal {
      background-color: var(--bg-card);
      border: 1px solid var(--border-subtle);
      color: var(--text-primary);
    }
    .input-royal:focus {
      border-color: var(--gold-pure);
    }

    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;

const UltraLuxeStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: cssStyles }} />
);

// ==============================================
// 7 : MULTI-LANGUES
// ==============================================
const translations = {
  fr: {
    "login.title": "HASHTAG",
    "login.subtitle": "Édition Royale",
    "login.username": "Identifiant Royal",
    "login.password": "Code Secret",
    "login.button": "Entrer",
    "login.request": "Demander l'accès",
    "login.auth": "Authentification...",
    "nav.home": "Accueil",
    "nav.social": "Mur Social",
    "nav.guests": "Invités",
    "nav.budget": "Budget Royal",
    "home.budget.title": "Budget Restant",
    "home.guests.title": "Invités Confirmés",
    "home.guests.pending": "En attente",
    "home.kingsun.title": "King Sun AI",
    "home.kingsun.desc": "Gère votre budget royal",
    "home.categories.title": "Postes de Dépenses",
    "social.title": "Mur Social Royal",
    "social.placeholder": "Quoi de neuf, Votre Altesse ?",
    "social.post": "Publier",
    "guests.title": "Gestion des Invités",
    "guests.search": "Rechercher un invité...",
    "guests.status.confirmed": "Confirmé",
    "guests.status.pending": "En attente",
    "budget.title": "Trésor Royal (King Sun)",
    "budget.total": "Budget Total Alloué",
    "budget.spent": "Dépensé",
    "budget.allocated": "Alloué",
    "budget.remaining": "Restant",
    "budget.overbudget": "Dépassement",
    "budget.notification": "Votre budget royal a été réparti avec excellence. 👑",
    "settings.title": "Réglages du Royaume",
    "settings.theme": "Thème Royal",
    "settings.theme.dark": "Noir & Or",
    "settings.theme.light": "Or Blanc",
    "settings.lang": "Langue",
    "settings.logout": "Quitter le Royaume",
  },
  // ... (Pas besoin de copier la section 'en' pour l'instant, elle est longue)
};

const I18nContext = createContext();
const useI18n = () => useContext(I18nContext);

const I18nProvider = ({ children }) => {
  const [language, setLanguage] = useState('fr');

  const t = (key) => {
    return (translations[language] && translations[language][key]) ? translations[language][key] : key;
  };

  const setLang = (lang) => {
    console.log(`[Multi-langues S.7] Langue changée en: ${lang}. Sauvegarde locale...`);
    setLanguage(lang);
  };

  return (
    <I18nContext.Provider value={{ t, setLang, language }}>
      {children}
    </I18nContext.Provider>
  );
};

// ==============================================
// 5 : SHIELD SYSTEM (Simulation)
// ==============================================
const useRoyalDatabase = () => {
  
  const [db, setDb] = useState({
    user: {
      name: "Altesse Sarah",
      handle: "@sarah_royal",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      preferences: {
        theme: 'theme-dark',
        language: 'fr'
      }
    },
    globalBudget: {
      totalAmount: 15000,
      currency: "€",
      totalSpent: 7200,
      totalAllocated: 15000
    },
    budgetCategories: [
      {
        categoryId: "traiteur",
        label: "Traiteur Royal",
        icon: Wallet, // Ici on passe le composant
        defaultPercentage: 0.40,
        allocatedAmount: 6000,
        spentAmount: 4500,
        devisItems: [
          { itemId: "d1", vendorName: "Le Festin d'Or", quoteAmount: 4500, status: "CONFIRMED" }
        ]
      },
      {
        categoryId: "salle",
        label: "Lieu de Réception",
        icon: MapPin, // Ici on passe le composant
        defaultPercentage: 0.20,
        allocatedAmount: 3000,
        spentAmount: 2700,
        devisItems: [
          { itemId: "d2", vendorName: "Château Royal", quoteAmount: 2700, status: "PAID" }
        ]
      },
      {
        categoryId: "decoration",
        label: "Décoration",
        icon: Sparkles, // Ici on passe le composant
        defaultPercentage: 0.15,
        allocatedAmount: 2250,
        spentAmount: 0,
        devisItems: []
      },
    ],
    guests: [
      { id: 1, name: "Duc de Montmorency", status: "Confirmé", table: "Royal A", group: "Famille Marié", dietaryNeeds: [] },
      { id: 2, name: "Lady Gaga", status: "Confirmé", table: "VIP B", group: "Amis", dietaryNeeds: ["Végétalien"] },
      { id: 3, name: "Pierre Hermé", status: "En attente", table: "Dessert", group: "Prestataires", dietaryNeeds: [] },
    ],
    tweets: [
      {
        id: 1,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
        name: "Jean D.",
        handle: "@jean_photographe",
        time: "2m",
        text: "La lumière est incroyable ! ✨📸 #RoyalWedding",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80",
        likes: 42, comments: 3
      },
    ]
  });

  const saveToDb = (collection, data) => {
    console.log(`[SHIELD SYSTEM 🛡️] Sauvegarde locale...`);
    setDb(prevDb => ({ ...prevDb, [collection]: data }));
  };

  const syncToCloud = (action, data) => {
    console.log(`[SHIELD SYSTEM ☁️] Connexion... Envoi vers KING_SUN_API...`);
    const payload = { ...data, action: action };

    fetch(KING_SUN_API_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(() => console.log(`[SHIELD SYSTEM ☁️] Données envoyées.`))
    .catch(error => console.error(`[SHIELD SYSTEM ☁️] Erreur:`, error));
  };

  return { db, saveToDb, syncToCloud };
};


// ==============================================
// 3. COMPOSANTS UI
// ==============================================

const TweetPost = ({ avatar, name, handle, time, text, image, likes, comments }) => (
  <div className="tweet-card flex gap-3 hover:bg-white/5 transition-colors cursor-pointer">
    <img src={avatar} alt={name} className="w-10 h-10 rounded-full border border-[var(--border-subtle)]" />
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-1 text-[15px]">
          <span className="font-bold text-[var(--text-primary)] truncate">{name}</span>
          <span className="text-[var(--text-secondary)] truncate">{handle}</span>
          <span className="text-[var(--text-secondary)] text-sm">· {time}</span>
        </div>
        <MoreHorizontal size={16} className="text-[var(--text-secondary)]" />
      </div>
      <p className="text-[15px] text-[var(--text-primary)] mt-1 font-light leading-relaxed">{text}</p>
      {image && (
        <div className="mt-3 rounded-2xl overflow-hidden border border-[var(--border-subtle)] max-h-[250px]">
          <img src={image} alt="Post" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex justify-between items-center mt-3 text-[var(--text-secondary)] max-w-[80%]">
        <div className="flex items-center gap-2"><MessageCircle size={16} /> <span className="text-xs">{comments}</span></div>
        <div className="flex items-center gap-2"><Heart size={16} /> <span className="text-xs">{likes}</span></div>
        <div className="flex items-center gap-2"><Share size={16} /></div>
      </div>
    </div>
  </div>
);

const GuestRow = ({ t, name, status, table }) => (
  <div className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)] last:border-0">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-[var(--bg-deep)] border border-[var(--border-subtle)] flex items-center justify-center text-xs text-gold font-royal">
        {name.charAt(0)}
      </div>
      <div>
        <p className="text-sm font-medium text-[var(--text-primary)]">{name}</p>
        <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wide">Table {table}</p>
      </div>
    </div>
    <div className={`px-3 py-1 rounded-full text-[9px] uppercase font-bold tracking-widest flex items-center gap-1.5 border ${
      status === 'Confirmé' ? 'bg-green-900/20 text-green-400 border-green-900/50' : 'bg-yellow-900/20 text-yellow-500 border-yellow-900/50'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'Confirmé' ? 'bg-green-400' : 'bg-yellow-500'}`}></span>
      {status === 'Confirmé' ? t('guests.status.confirmed') : t('guests.status.pending')}
    </div>
  </div>
);

// --- CORRECTION v4: ICI ---
const BudgetCategoryRow = ({ t, category, currency }) => {
  const spent = category.spentAmount;
  const allocated = category.allocatedAmount;
  const percentage = allocated > 0 ? (spent / allocated) * 100 : 0;
  const isOverBudget = spent > allocated;
  const IconComponent = category.icon; // L'ASTUCE EST ICI

  return (
    <div className="py-3 border-b border-[var(--border-subtle)] last:border-0">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          {/* ET ICI, on utilise le composant */}
          <IconComponent size={14} className="text-[var(--text-secondary)]" />
          <span className="font-medium text-[var(--text-primary)] text-sm">{category.label}</span>
        </div>
        <div className="text-sm">
          <span className="font-bold text-[var(--text-primary)]">{spent}{currency}</span>
          <span className="text-[var(--text-secondary)]"> / {allocated}{currency}</span>
        </div>
      </div>
      <div className="w-full bg-[var(--bg-deep)] h-1.5 rounded-full overflow-hidden mt-1.5">
        <div 
          className={`h-full ${isOverBudget ? 'bg-red-500' : 'bg-gradient-to-r from-[var(--gold-pure)] to-[#FDE68A]'}`}
          style={{ width: `${isOverBudget ? 100 : percentage}%` }}
        ></div>
      </div>
      {isOverBudget && (
        <div className="flex items-center gap-1 mt-1.5 text-red-500">
           <AlertCircle size={12} />
           <span className="text-xs font-medium">{t('budget.overbudget')} de {spent - allocated}{currency}</span>
        </div>
      )}
    </div>
  </div>
);

// ==============================================
// 4. ÉCRANS PRINCIPAUX
// ==============================================

const LoginPage = ({ onLogin, onRequestAccess }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useI18n();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(); 
    }, 1500);
  };

  const handleRequest = (e) => {
     e.preventDefault();
     onRequestAccess({
        name: "Nouvel Utilisateur",
        project: "Projet Test",
        objective: "Tester l'accès"
     });
     alert("Votre demande d'audience a été transmise. 👑 (Vérifiez votre Google Sheet 'Demandes')");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-6">
      <div className="w-full max-w-sm text-center">
        <div className="mb-12">
           <h1 className="font-royal text-5xl text-gold-liquid tracking-widest mb-2">{t('login.title')}</h1>
           <p className="text-[10px] text-gray-500 uppercase tracking-[0.6em]">{t('login.subtitle')}</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
           <input 
             type="text" 
             placeholder={t('login.username')} 
             className="w-full input-royal rounded-xl p-3 text-sm outline-none" 
             value={username}
             onChange={e => setUsername(e.target.value)}
             required 
           />
           <input 
             type="password" 
             placeholder={t('login.password')} 
             className="w-full input-royal rounded-xl p-3 text-sm outline-none" 
             value={password}
             onChange={e => setPassword(e.target.value)}
             required 
           />
           <button disabled={loading} className="w-full bg-gradient-to-r from-[#b38728] to-[#D4AF37] text-black font-bold py-4 rounded-xl uppercase tracking-[0.2em] text-xs">
            {loading ? t('login.auth') : t('login.button')}
          </button>
           <button onClick={handleRequest} className="text-xs text-gray-600 hover:text-gold">
             {t('login.request')}
           </button>
        </form>
      </div>
    </div>
  );
};

const SettingsModal = ({ db, saveToDb, onSetTheme, onSetLang, onClose, onLogout }) => {
  const { t, language } = useI18n();

  const handleThemeChange = (theme) => {
    onSetTheme(theme);
    const updatedUser = { ...db.user, preferences: { ...db.user.preferences, theme } };
    saveToDb('user', updatedUser);
  };

  const handleLangChange = (lang) => {
    onSetLang(lang);
    const updatedUser = { ...db.user, preferences: { ...db.user.preferences, language: lang } };
    saveToDb('user', updatedUser);
  };
  
  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bento-card w-full max-w-md p-5 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500">&times;</button>
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-6">{t('settings.title')}</h2>

        <div className="mb-4">
          <label className="text-sm font-medium text-[var(--text-secondary)]">{t('settings.theme')}</label>
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => handleThemeChange('theme-dark')} 
              className={`flex-1 p-2 rounded-lg border ${db.user.preferences.theme === 'theme-dark' ? 'border-[var(--gold-pure)] text-[var(--gold-pure)]' : 'border-[var(--border-subtle)]'}`}
            >
              <Moon size={16} className="mx-auto mb-1" /> {t('settings.theme.dark')}
            </button>
            <button 
              onClick={() => handleThemeChange('theme-white-gold')} 
              className={`flex-1 p-2 rounded-lg border ${db.user.preferences.theme === 'theme-white-gold' ? 'border-[var(--gold-pure)] text-[var(--gold-pure)]' : 'border-[var(--border-subtle)]'}`}
            >
              <Sun size={16} className="mx-auto mb-1" /> {t('settings.theme.light')}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium text-[var(--text-secondary)]">{t('settings.lang')}</label>
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => handleLangChange('fr')} 
              className={`flex-1 p-2 rounded-lg border ${language === 'fr' ? 'border-[var(--gold-pure)] text-[var(--gold-pure)]' : 'border-[var(--border-subtle)]'}`}
            >
              FR
            </button>
            <button 
              onClick={() => handleLangChange('en')} 
              className={`flex-1 p-2 rounded-lg border ${language === 'en' ? 'border-[var(--gold-pure)] text-[var(--gold-pure)]' : 'border-[var(--border-subtle)]'}`}
            >
              EN
            </button>
          </div>
        </div>
        
        <button onClick={onLogout} className="w-full p-2 text-sm text-red-500 bg-red-900/20 rounded-lg border border-red-900/50">
          {t('settings.logout')}
        </button>
      </div>
    </div>
  );
};


// ==============================================
// 5. APPLICATION PRINCIPALE (Le Trône)
// ==============================================
function RoyalApp() {
  const [view, setView] = useState('login'); 
  const [tab, setTab] = useState('home'); 
  const [showSettings, setShowSettings] = useState(false);
  const { db, saveToDb, syncToCloud } = useRoyalDatabase();
  const { t, setLang } = useI18n();

  const [theme, setTheme] = useState(db.user.preferences.theme);
  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(theme);
  }, [theme]);
  
  useEffect(() => {
    setLang(db.user.preferences.language);
  }, [db.user.preferences.language, setLang]);

  const handleLogin = () => setView('app');
  const handleLogout = () => setView('login');
  const handleRequestAccess = (data) => syncToCloud('request_access', data);

  const [tweetInput, setTweetInput] = useState("");
  const handlePost = () => {
    if(!tweetInput) return;
    const newTweet = {
      id: Date.now(), avatar: db.user.avatar, name: db.user.name, handle: db.user.handle, time: "À l'instant", text: tweetInput, likes: 0, comments: 0
    };
    const updatedTweets = [newTweet, ...db.tweets];
    saveToDb('tweets', updatedTweets);
    setTweetInput("");
    syncToCloud('post_tweet', { text: tweetInput, user: db.user.name });
    alert("Post publié ! (Vérifiez votre Google Sheet 'RoyalNetwork')");
  };
  
  const guestStats = {
    confirmed: db.guests.filter(g => g.status === 'Confirmé').length,
    pending: db.guests.filter(g => g.status === 'En attente').length,
  };

  if (view === 'login') {
    return <LoginPage onLogin={handleLogin} onRequestAccess={handleRequestAccess} />;
  }

  return (
    <div className="min-h-screen pb-24 relative">
      <UltraLuxeStyles />
      
      {showSettings && (
        <SettingsModal 
          db={db}
          saveToDb={saveToDb}
          onSetTheme={setTheme}
          onSetLang={setLang}
          onClose={() => setShowSettings(false)}
          onLogout={handleLogout}
        />
      )}
      
      <header className="sticky top-0 z-50 bg-[var(--bg-deep)]/80 backdrop-blur-xl border-b border-[var(--border-subtle)] px-4 py-3 flex justify-between items-center">
         <div>
           <h2 className="font-royal text-lg text-gold-liquid tracking-widest">HASHTAG</h2>
         </div>
         <div className="flex items-center gap-4">
           <Bell size={20} className="text-[var(--text-secondary)]"/>
           <Settings size={20} className="text-[var(--text-secondary)] cursor-pointer" onClick={() => setShowSettings(true)} />
           <img src={db.user.avatar} className="w-8 h-8 rounded-full border border-[var(--border-subtle)]" alt="Profile"/>
         </div>
      </header>

      <main className="animate-slide">
        
        {/* ONGLET ACCUEIL */}
        {tab === 'home' && (
          <div className="p-4 space-y-4">
            <div className="bento-card p-5 bg-gradient-to-br from-[var(--bg-card)] to-black relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10"><Wallet size={80} className="text-[var(--gold-pure)]"/></div>
               <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest mb-1">{t('home.budget.title')}</p>
               <h2 className="text-4xl font-royal text-[var(--text-primary)] mb-4">{db.globalBudget.totalAmount - db.globalBudget.totalSpent} {db.globalBudget.currency}</h2>
               <div className="w-full bg-gray-700/30 h-1.5 rounded-full overflow-hidden">
                 <div className="bg-gradient-to-r from-[var(--gold-pure)] to-[#FDE68A] h-full"
                      style={{width: `${(db.globalBudget.totalSpent / db.globalBudget.totalAmount) * 100}%`}}></div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div onClick={() => setTab('guests')} className="bento-card p-4 cursor-pointer">
                  <Users size={20} className="text-[var(--text-secondary)] mb-2"/>
                  <span className="text-2xl font-bold text-[var(--text-primary)]">{guestStats.confirmed}</span>
                  <p className="text-xs font-medium text-[var(--text-secondary)]">{t('home.guests.title')}</p>
                  <p className="text-xs text-yellow-500">{guestStats.pending} {t('home.guests.pending')}</p>
               </div>
               <div onClick={() => setTab('budget')} className="bento-card p-4 cursor-pointer border-[var(--gold-pure)]/30">
                  <Crown size={20} className="text-[var(--gold-pure)] mb-2"/>
                  <span className="text-sm font-bold text-[var(--text-primary)]">{t('home.kingsun.title')}</span>
                  <p className="text-xs text-[var(--text-secondary)]">{t('home.kingsun.desc')}</p>
               </div>
            </div>
            
            <div className="bento-card p-5">
              <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3">{t('home.categories.title')}</h3>
              <div className="space-y-2">
                {db.budgetCategories.slice(0, 2).map(cat => (
                  <BudgetCategoryRow key={cat.categoryId} t={t} category={cat} currency={db.globalBudget.currency} />
                ))}
                <button onClick={() => setTab('budget')} className="text-xs text-center w-full pt-2 text-[var(--gold-pure)] font-bold">
                  {t('budget.title')}
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ONGLET BUDGET */}
        {tab === 'budget' && (
          <div className="p-4">
             <div className="bento-card p-5 mb-4">
                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">{t('budget.title')}</h2>
                <div className="text-center mb-4">
                  <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">{t('budget.total')}</p>
                  <h3 className="text-4xl font-royal text-[var(--text-primary)]">{db.globalBudget.totalAmount} {db.globalBudget.currency}</h3>
                </div>
                <div className="flex justify-between text-xs mb-2">
                   <span>{t('budget.spent')}: <span className="font-bold">{db.globalBudget.totalSpent} {db.globalBudget.currency}</span></span>
                   <span>{t('budget.remaining')}: <span className="font-bold text-green-400">{db.globalBudget.totalAmount - db.globalBudget.totalSpent} {db.globalBudget.currency}</span></span>
                </div>
                <div className="w-full bg-gray-700/30 h-2 rounded-full overflow-hidden">
                 <div className="bg-gradient-to-r from-[var(--gold-pure)] to-[#FDE68A] h-full"
                      style={{width: `${(db.globalBudget.totalSpent / db.globalBudget.totalAmount) * 100}%`}}></div>
               </div>
               <p className="text-xs italic text-center text-[var(--text-secondary)] mt-4">
                 {t('budget.notification')}
               </p>
             </div>
             
             <div className="bento-card p-5">
              <div className="space-y-2">
                {db.budgetCategories.map(cat => (
                  <BudgetCategoryRow key={cat.categoryId} t={t} category={cat} currency={db.globalBudget.currency} />
                ))}
              </div>
             </div>
          </div>
        )}

        {/* ONGLET MUR SOCIAL */}
        {tab === 'social' && (
          <div>
            <div className="p-4 border-b border-[var(--border-subtle)] flex gap-3">
               <img src={db.user.avatar} className="w-10 h-10 rounded-full" alt="Avatar"/>
               <div className="flex-1">
                  <input 
                    value={tweetInput}
                    onChange={(e) => setTweetInput(e.target.value)}
                    placeholder={t('social.placeholder')}
                    className="w-full bg-transparent text-lg text-[var(--text-primary)] outline-none mb-3" 
                  />
                  <button onClick={handlePost} className="bg-[var(--gold-pure)] text-black font-bold px-4 py-1.5 rounded-full text-sm">{t('social.post')}</button>
               </div>
            </div>
            {db.tweets.map(tweet => <TweetPost key={tweet.id} {...tweet} />)}
          </div>
        )}

        {/* ONGLET INVITÉS */}
        {tab === 'guests' && (
          <div className="p-4 min-h-[80vh]">
             <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">{t('guests.title')}</h2>
             <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-1 mb-4 flex items-center">
                <Search size={18} className="ml-3 text-[var(--text-secondary)]"/>
                <input placeholder={t('guests.search')} className="w-full bg-transparent p-2 text-[var(--text-primary)] text-sm outline-none"/>
             </div>
             <div className="space-y-1">
                {db.guests.map(g => (
                  <GuestRow 
                    key={g.id} 
                    t={t}
                    name={g.name} 
                    status={g.status} 
                    table={g.table} 
                  />
                ))}
             </div>
          </div>
        )}

      </main>

      {/* NAVIGATION */}
      <footer className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
        <div className="nav-dock flex items-center justify-center gap-6 px-6 py-3">
          
          <div className="flex flex-col items-center" onClick={() => setTab('home')}>
            <LayoutGrid 
              size={24} 
              className={`cursor-pointer transition-colors ${tab === 'home' ? 'text-[var(--gold-pure)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} 
            />
            <span className={`text-[8px] mt-0.5 ${tab === 'home' ? 'text-[var(--gold-pure)]' : 'text-[var(--text-secondary)]'}`}>{t('nav.home')}</span>
          </div>
          
          <div className="flex flex-col items-center" onClick={() => setTab('budget')}>
            <Crown 
              size={24} 
              className={`cursor-pointer transition-colors ${tab === 'budget' ? 'text-[var(--gold-pure)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} 
            />
            <span className={`text-[8px] mt-0.5 ${tab === 'budget' ? 'text-[var(--gold-pure)]' : 'text-[var(--text-secondary)]'}`}>{t('nav.budget')}</span>
          </div>

          <div className="flex flex-col items-center" onClick={() => setTab('social')}>
            <MessageCircle 
              size={24} 
              className={`cursor-pointer transition-colors ${tab === 'social' ? 'text-[var(--gold-pure)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} 
            />
             <span className={`text-[8px] mt-0.5 ${tab === 'social' ? 'text-[var(--gold-pure)]' : 'text-[var(--text-secondary)]'}`}>{t('nav.social')}</span>
          </div>
          
          <div className="flex flex-col items-center" onClick={() => setTab('guests')}>
            <Users 
              size={24} 
              className={`cursor-pointer transition-colors ${tab === 'guests' ? 'text-[var(--gold-pure)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} 
            />
             <span className={`text-[8px] mt-0.5 ${tab === 'guests' ? 'text-[var(--gold-pure)]' : 'text-[var(--text-secondary)]'}`}>{t('nav.guests')}</span>
          </div>
          
        </div>
      </footer>
    </div>
  );
}

// ==============================================
// 6. EXPORT FINAL
// ==============================================
export default function AppWrapper() {
  return (
    <I18nProvider>
      <UltraLuxeStyles />
      <RoyalApp />
    </I18nProvider>
  );
}
