/**
 * @description Global application context providing Fan Persona state management, multilingual support, and secure local storage persistence.
 */
import React, { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import type { AppState, LanguageCode, Stadium, ChatMessage, UserProfile, TicketPass, FoodOrder, SOSAlert, TournamentBadge } from '../types/stadium';
import { STADIUMS, INITIAL_INCIDENTS, TRANSLATIONS } from '../data/stadiumData';

interface AppContextType {
  state: AppState;
  currentStadium: Stadium;
  t: (key: string) => string;
  setLanguage: (lang: LanguageCode) => void;
  setSelectedStadium: (id: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  addEcoPoints: (points: number) => void;
  toggleQRStatus: () => void;
  placeFoodOrder: (order: Omit<FoodOrder, 'id' | 'status' | 'timestamp'>) => void;
  triggerSOS: (type: SOSAlert['type'], userLocation?: string) => void;
  cancelSOS: () => void;
  unlockBadge: (stadiumId: string) => void;
}

const STORAGE_KEY = 'stadia_iq_state_2026';

const INITIAL_PROFILE: UserProfile = {
  name: 'Alex Rivera',
  ticketSection: 'Section 114, Row F',
  accessibleNeeds: false,
  sensoryNeeds: false,
  ecoPoints: 350,
  streak: 4,
};

const INITIAL_TICKET: TicketPass = {
  id: 'TKT-FIFA-2026-8942',
  matchTitle: 'FIFA World Cup 2026 — Final Match',
  stadiumId: 'metlife',
  stadiumName: 'MetLife Stadium',
  section: 'Section 114',
  row: 'Row F',
  seat: 'Seat 12',
  assignedGateId: 'g3',
  assignedGateName: 'Gate C (MetLife West)',
  qrStatus: 'valid',
  biometricExpress: true,
  entryTimeWindow: '18:30 - 19:30 EST',
};

const INITIAL_BADGES: TournamentBadge[] = [
  {
    id: 'badge-metlife',
    title: 'Final Match Witness',
    description: 'Checked in at MetLife Stadium for the FIFA 2026 Championship Final.',
    stadiumId: 'metlife',
    iconName: 'Trophy',
    unlocked: true,
    pointsBonus: 200,
  },
  {
    id: 'badge-azteca',
    title: 'Azteca Opening Explorer',
    description: 'Checked in at Estadio Azteca for the historic Opening Match.',
    stadiumId: 'azteca',
    iconName: 'Flame',
    unlocked: false,
    pointsBonus: 150,
  },
  {
    id: 'badge-sofi',
    title: 'West Coast Pioneer',
    description: 'Checked in at SoFi Stadium in Los Angeles, USA.',
    stadiumId: 'sofi',
    iconName: 'Sun',
    unlocked: false,
    pointsBonus: 150,
  },
];

const INITIAL_STATE: AppState = {
  mode: 'fan',
  language: 'en',
  selectedStadiumId: 'metlife',
  profile: INITIAL_PROFILE,
  incidents: INITIAL_INCIDENTS,
  chatHistory: [
    {
      id: 'welcome-1',
      sender: 'ai',
      text: 'Welcome to StadiaIQ 2026! I am your AI Match Copilot. How can I assist your FIFA World Cup experience today?',
      timestamp: 'Just now',
      language: 'en',
    },
  ],
  savedRoutes: [],
  ticketPass: INITIAL_TICKET,
  activeOrders: [
    {
      id: 'ORD-1049',
      concessionId: 'c1',
      concessionName: 'Crescent Halal Grill',
      items: [{ name: 'Halal Chicken Kebab Combo', quantity: 1, price: 18 }],
      totalAmount: 18,
      deliveryOption: 'in-seat',
      deliveryLocation: 'Section 114, Row F, Seat 12',
      status: 'delivering',
      timestamp: '6 mins ago',
    },
  ],
  activeSOS: null,
  badges: INITIAL_BADGES,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_STATE,
          ...parsed,
          mode: 'fan',
          incidents: Array.isArray(parsed.incidents) ? parsed.incidents : INITIAL_INCIDENTS,
          chatHistory: Array.isArray(parsed.chatHistory) ? parsed.chatHistory : INITIAL_STATE.chatHistory,
          ticketPass: parsed.ticketPass || INITIAL_TICKET,
          activeOrders: Array.isArray(parsed.activeOrders) ? parsed.activeOrders : INITIAL_STATE.activeOrders,
          activeSOS: parsed.activeSOS || null,
          badges: Array.isArray(parsed.badges) ? parsed.badges : INITIAL_BADGES,
        };
      }
    } catch (e) {
      console.error('Failed to parse StadiaIQ localStorage:', e);
    }
    return INITIAL_STATE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save StadiaIQ state:', e);
    }
  }, [state]);

  const currentStadium = useMemo(() => {
    return STADIUMS.find((s) => s.id === state.selectedStadiumId) || STADIUMS[0];
  }, [state.selectedStadiumId]);

  const t = useMemo(() => {
    return (key: string): string => {
      const langDict = TRANSLATIONS[state.language] || TRANSLATIONS.en;
      return langDict[key] || TRANSLATIONS.en[key] || key;
    };
  }, [state.language]);



  const setLanguage = (language: LanguageCode) => {
    setState((prev) => ({ ...prev, language }));
  };

  const setSelectedStadium = (selectedStadiumId: string) => {
    const targetStad = STADIUMS.find((s) => s.id === selectedStadiumId) || STADIUMS[0];
    const optimalGate = targetStad.gates.find((g) => g.status === 'optimal') || targetStad.gates[0];
    
    setState((prev) => ({
      ...prev,
      selectedStadiumId,
      ticketPass: {
        ...prev.ticketPass,
        stadiumId: targetStad.id,
        stadiumName: targetStad.name,
        matchTitle: targetStad.matchTitle,
        assignedGateId: optimalGate ? optimalGate.id : 'g1',
        assignedGateName: optimalGate ? optimalGate.name : targetStad.gates[0]?.name || 'Entry A',
      },
    }));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...updates },
    }));
  };



  const addChatMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setState((prev) => ({
      ...prev,
      chatHistory: [...prev.chatHistory, newMsg],
    }));
  };

  const addEcoPoints = (points: number) => {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        ecoPoints: prev.profile.ecoPoints + points,
      },
    }));
  };

  const toggleQRStatus = () => {
    setState((prev) => ({
      ...prev,
      ticketPass: {
        ...prev.ticketPass,
        qrStatus: prev.ticketPass.qrStatus === 'valid' ? 'checked-in' : 'valid',
      },
    }));
  };

  const placeFoodOrder = (order: Omit<FoodOrder, 'id' | 'status' | 'timestamp'>) => {
    const newOrder: FoodOrder = {
      ...order,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'received',
      timestamp: 'Just now',
    };
    setState((prev) => ({
      ...prev,
      activeOrders: [newOrder, ...prev.activeOrders],
    }));
  };



  const triggerSOS = (type: SOSAlert['type'], userLocation?: string) => {
    const alert: SOSAlert = {
      id: `SOS-${Date.now()}`,
      active: true,
      type,
      userLocation: userLocation || `${state.profile.ticketSection} (${currentStadium.name})`,
      dispatchStatus: 'dispatched',
      evacuationPath: [
        `Exit ${state.profile.ticketSection.split(',')[0]} via Level 1 Priority Elevator`,
        'Follow Step-Free Green LED Concourse Floor Indicators',
        'Proceed directly to North Emergency Assembly Point (Gate C / Medical Hub)',
      ],
    };
    setState((prev) => ({ ...prev, activeSOS: alert }));
  };

  const cancelSOS = () => {
    setState((prev) => ({ ...prev, activeSOS: null }));
  };

  const unlockBadge = (stadiumId: string) => {
    setState((prev) => {
      const alreadyUnlocked = prev.badges.find((b) => b.stadiumId === stadiumId)?.unlocked;
      if (alreadyUnlocked) return prev;
      
      const badgeToUnlock = prev.badges.find((b) => b.stadiumId === stadiumId);
      const bonus = badgeToUnlock ? badgeToUnlock.pointsBonus : 100;

      return {
        ...prev,
        profile: {
          ...prev.profile,
          ecoPoints: prev.profile.ecoPoints + bonus,
        },
        badges: prev.badges.map((b) => (b.stadiumId === stadiumId ? { ...b, unlocked: true } : b)),
      };
    });
  };

  const value = useMemo(
    () => ({
      state,
      currentStadium,
      t,
      setLanguage,
      setSelectedStadium,
      updateProfile,
      addChatMessage,
      addEcoPoints,
      toggleQRStatus,
      placeFoodOrder,
      triggerSOS,
      cancelSOS,
      unlockBadge,
    }),
    [state, currentStadium, t]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
