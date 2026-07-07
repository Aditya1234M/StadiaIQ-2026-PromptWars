/**
 * @description Global application context providing dual-mode switching (Fan vs Staff), multilingual support, and secure local storage state.
 */
import React, { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import type { AppState, UserMode, LanguageCode, Stadium, Incident, ChatMessage, UserProfile } from '../types/stadium';
import { STADIUMS, INITIAL_INCIDENTS, TRANSLATIONS } from '../data/stadiumData';

interface AppContextType {
  state: AppState;
  currentStadium: Stadium;
  t: (key: string) => string;
  setMode: (mode: UserMode) => void;
  setLanguage: (lang: LanguageCode) => void;
  setSelectedStadium: (id: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addIncident: (incident: Omit<Incident, 'id' | 'timestamp'>) => void;
  updateIncidentStatus: (id: string, status: Incident['status'], team?: string) => void;
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  addEcoPoints: (points: number) => void;
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
          // Guarantee array safety
          incidents: Array.isArray(parsed.incidents) ? parsed.incidents : INITIAL_INCIDENTS,
          chatHistory: Array.isArray(parsed.chatHistory) ? parsed.chatHistory : INITIAL_STATE.chatHistory,
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

  const setMode = (mode: UserMode) => {
    setState((prev) => ({ ...prev, mode }));
  };

  const setLanguage = (language: LanguageCode) => {
    setState((prev) => ({ ...prev, language }));
  };

  const setSelectedStadium = (selectedStadiumId: string) => {
    setState((prev) => ({ ...prev, selectedStadiumId }));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...updates },
    }));
  };

  const addIncident = (incident: Omit<Incident, 'id' | 'timestamp'>) => {
    const newInc: Incident = {
      ...incident,
      id: `inc-${Date.now()}`,
      timestamp: 'Just now',
    };
    setState((prev) => ({
      ...prev,
      incidents: [newInc, ...prev.incidents],
    }));
  };

  const updateIncidentStatus = (id: string, status: Incident['status'], team?: string) => {
    setState((prev) => ({
      ...prev,
      incidents: prev.incidents.map((inc) => {
        if (inc.id === id) {
          return {
            ...inc,
            status,
            assignedTeam: team || inc.assignedTeam,
          };
        }
        return inc;
      }),
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

  const value = useMemo(
    () => ({
      state,
      currentStadium,
      t,
      setMode,
      setLanguage,
      setSelectedStadium,
      updateProfile,
      addIncident,
      updateIncidentStatus,
      addChatMessage,
      addEcoPoints,
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
