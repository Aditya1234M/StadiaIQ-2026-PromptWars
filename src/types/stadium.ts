/**
 * @description Strict TypeScript interfaces for StadiaIQ 2026 FIFA World Cup Smart Stadium & Operations AI.
 */

export type UserMode = 'fan' | 'staff';

export type LanguageCode = 'en' | 'es' | 'fr' | 'ar' | 'de';

export interface Gate {
  id: string;
  name: string;
  section: string;
  waitTimeMinutes: number;
  capacityPercent: number;
  status: 'optimal' | 'normal' | 'congested';
  accessible: boolean;
}

export interface Concession {
  id: string;
  name: string;
  category: 'halal' | 'vegan' | 'general' | 'kosher' | 'beverage';
  section: string;
  waitTimeMinutes: number;
  open: boolean;
}

export interface Restroom {
  id: string;
  section: string;
  type: 'standard' | 'family' | 'all-gender' | 'sensory-relief';
  waitTimeMinutes: number;
  accessible: boolean;
}

export interface TransitRoute {
  id: string;
  name: string;
  type: 'metro' | 'shuttle' | 'bus' | 'walk';
  destination: string;
  departureInMinutes: number;
  status: 'on-time' | 'delayed' | 'crowded';
  ecoPoints: number;
}

export interface Incident {
  id: string;
  timestamp: string;
  title: string;
  type: 'medical' | 'security' | 'maintenance' | 'crowd';
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'assigned' | 'resolved';
  assignedTeam?: string;
}

export interface Stadium {
  id: string;
  name: string;
  city: string;
  matchTitle: string;
  matchTime: string;
  capacity: number;
  currentAttendance: number;
  ecoRating: string;
  solarPowerKw: number;
  recyclingPercent: number;
  gates: Gate[];
  concessions: Concession[];
  restrooms: Restroom[];
  transit: TransitRoute[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  language: LanguageCode;
  suggestedAction?: {
    label: string;
    routeTab?: string;
  };
}

export interface UserProfile {
  name: string;
  ticketSection: string;
  accessibleNeeds: boolean;
  sensoryNeeds: boolean;
  ecoPoints: number;
  streak: number;
}

export interface TicketPass {
  id: string;
  matchTitle: string;
  stadiumId: string;
  stadiumName: string;
  section: string;
  row: string;
  seat: string;
  assignedGateId: string;
  assignedGateName: string;
  qrStatus: 'valid' | 'checked-in';
  biometricExpress: boolean;
  entryTimeWindow: string;
}

export interface FoodOrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface FoodOrder {
  id: string;
  concessionId: string;
  concessionName: string;
  items: FoodOrderItem[];
  totalAmount: number;
  deliveryOption: 'in-seat' | 'express-pickup';
  deliveryLocation: string;
  status: 'received' | 'preparing' | 'delivering' | 'completed';
  timestamp: string;
}

export interface SOSAlert {
  id: string;
  active: boolean;
  type: 'medical' | 'security' | 'evacuation';
  userLocation: string;
  dispatchStatus: 'dispatched' | 'arriving' | 'none';
  evacuationPath: string[];
}

export interface TournamentBadge {
  id: string;
  title: string;
  description: string;
  stadiumId: string;
  iconName: string;
  unlocked: boolean;
  pointsBonus: number;
}

export interface AppState {
  mode: UserMode;
  language: LanguageCode;
  selectedStadiumId: string;
  profile: UserProfile;
  incidents: Incident[];
  chatHistory: ChatMessage[];
  savedRoutes: string[];
  ticketPass: TicketPass;
  activeOrders: FoodOrder[];
  activeSOS: SOSAlert | null;
  badges: TournamentBadge[];
}

