/**
 * @description Generative AI simulation engine providing intelligent routing, predictive bottleneck alerts, and multilingual NLP fan assistance.
 */
import type { Stadium, Gate, LanguageCode } from '../types/stadium';

export interface AIRecommendation {
  recommendedGate: Gate;
  savedMinutes: number;
  message: string;
}

export interface PredictiveAlert {
  id: string;
  title: string;
  prediction: string;
  recommendation: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
}

export interface CopilotResponse {
  text: string;
  suggestedAction?: {
    label: string;
    routeTab?: string;
  };
}

/**
 * @description Analyzes current gate congestion to recommend the fastest entry gate.
 */
export const getAICrowdRecommendation = (stadium: Stadium, accessibleOnly: boolean, lang: LanguageCode = 'en'): AIRecommendation => {
  const validGates = accessibleOnly ? stadium.gates.filter((g) => g.accessible) : stadium.gates;
  
  if (validGates.length === 0) {
    return {
      recommendedGate: stadium.gates[0],
      savedMinutes: 0,
      message: 'No accessible gates currently available.',
    };
  }

  // Find most congested gate and optimal gate
  let worstGate = validGates[0];
  let bestGate = validGates[0];

  validGates.forEach((gate) => {
    if (gate.waitTimeMinutes > worstGate.waitTimeMinutes) worstGate = gate;
    if (gate.waitTimeMinutes < bestGate.waitTimeMinutes) bestGate = gate;
  });

  const savedMinutes = Math.max(0, worstGate.waitTimeMinutes - bestGate.waitTimeMinutes);

  const messages: Record<LanguageCode, string> = {
    en: `AI Routing: ${worstGate.name} is experiencing heavy delays (${worstGate.waitTimeMinutes}m wait). We recommend redirecting to ${bestGate.name} for a ${savedMinutes}-minute faster entry!`,
    es: `Ruta IA: ${worstGate.name} tiene retrasos graves (${worstGate.waitTimeMinutes}m). ¡Recomendamos entrar por ${bestGate.name} para ahorrar ${savedMinutes} minutos!`,
    fr: `Routage IA: ${worstGate.name} est très encombré (${worstGate.waitTimeMinutes}m). Nous recommandons ${bestGate.name} pour gagner ${savedMinutes} minutes !`,
    ar: `توجيه الذكاء الاصطناعي: ${worstGate.name} مزدحمة (${worstGate.waitTimeMinutes}د). ننصح بالتوجه إلى ${bestGate.name} لتوفير ${savedMinutes} دقيقة!`,
    de: `KI-Route: ${worstGate.name} hat hohe Wartezeiten (${worstGate.waitTimeMinutes} Min). Wir empfehlen ${bestGate.name} für ${savedMinutes} Minuten schnelleren Einlass!`,
  };

  return {
    recommendedGate: bestGate,
    savedMinutes,
    message: messages[lang] || messages.en,
  };
};

/**
 * @description Generates predictive operational intelligence alerts for stadium staff.
 */
export const getAIPredictiveAlerts = (stadium: Stadium): PredictiveAlert[] => {
  return [
    {
      id: 'pred-1',
      title: 'Post-Match Surge Prediction',
      location: 'Gate F (North Plaza Entry)',
      prediction: `AI modeling indicates a 94% capacity bottleneck at Gate F within 15 minutes of final whistle at ${stadium.name}.`,
      recommendation: 'Open emergency turnstiles 4–8 immediately. Deploy Steward Team Alpha (6 members) to divert pedestrian traffic toward Gate C.',
      severity: 'critical',
    },
    {
      id: 'pred-2',
      title: 'Concession Wait Time Spike',
      location: 'Section 105 & 112 Concessions',
      prediction: 'Halal and general grill wait times exceeding 18 minutes during halftime surge.',
      recommendation: 'Activate mobile express beverage carts in Section 108 and broadcast QR ordering notifications to Section 100-115 ticket holders.',
      severity: 'high',
    },
    {
      id: 'pred-3',
      title: 'Transit Shuttle Platform Congestion',
      location: 'East VIP & Shuttle Plaza',
      prediction: 'Electric Shuttle Express queue predicted to exceed platform holding capacity by 22%.',
      recommendation: 'Dispatch 3 reserve zero-emission articulated buses from Depot B and increase platform digital signage frequency.',
      severity: 'medium',
    },
  ];
};

/**
 * @description Multilingual NLP assistant responding to fan inquiries regarding stadium services, food, and transit.
 */
export const generateCopilotResponse = (query: string, stadium: Stadium, lang: LanguageCode = 'en'): CopilotResponse => {
  const q = query.toLowerCase();

  // Vegan food (check first so "vegan" doesn't fall into halal branch)
  if (q.includes('vegan') || q.includes('plant') || q.includes('vegano') || q.includes('végan') || q.includes('نباتي') || q.includes('pflanzlich')) {
    const veganConcession = stadium.concessions.find((c) => c.category === 'vegan') || stadium.concessions[0];
    const responses: Record<LanguageCode, string> = {
      en: `I found ${veganConcession.name} near Section ${veganConcession.section}! Current wait time is only ${veganConcession.waitTimeMinutes} minutes. 100% plant-based menu! Would you like AI walking directions?`,
      es: `¡Encontré ${veganConcession.name} cerca de la Sección ${veganConcession.section}! El tiempo de espera actual es de solo ${veganConcession.waitTimeMinutes} minutos. ¡Menú 100% vegano! ¿Deseas indicaciones?`,
      fr: `J'ai trouvé ${veganConcession.name} près de la Section ${veganConcession.section} ! Temps d'attente actuel : ${veganConcession.waitTimeMinutes} minutes. Menu 100% végétal ! Voulez-vous un itinéraire ?`,
      ar: `لقد وجدت ${veganConcession.name} بالقرب من القسم ${veganConcession.section}! وقت الانتظار الحالي هو ${veganConcession.waitTimeMinutes} دقائق فقط. قائمة نباتية 100%! هل ترغب في إرشادات المشي؟`,
      de: `Ich habe ${veganConcession.name} in der Nähe von Block ${veganConcession.section} gefunden! Wartezeit aktuell nur ${veganConcession.waitTimeMinutes} Minuten. 100% pflanzliches Menü! Möchten Sie eine Wegbeschreibung?`,
    };
    return {
      text: responses[lang] || responses.en,
      suggestedAction: { label: 'View on Live Map', routeTab: 'navigate' },
    };
  }

  // Halal / General Food
  if (q.includes('halal') || q.includes('food') || q.includes('eat') || q.includes('kebab') || q.includes('hungry') || q.includes('comida') || q.includes('nourriture') || q.includes('طعام') || q.includes('essen') || q.includes('kosher')) {
    const halalConcession = stadium.concessions.find((c) => c.category === 'halal') || stadium.concessions[0];
    const responses: Record<LanguageCode, string> = {
      en: `I found ${halalConcession.name} near Section ${halalConcession.section}! Current wait time is only ${halalConcession.waitTimeMinutes} minutes. Would you like AI walking directions?`,
      es: `¡Encontré ${halalConcession.name} cerca de la Sección ${halalConcession.section}! El tiempo de espera actual es de solo ${halalConcession.waitTimeMinutes} minutos. ¿Deseas indicaciones?`,
      fr: `J'ai trouvé ${halalConcession.name} près de la Section ${halalConcession.section} ! Temps d'attente actuel : ${halalConcession.waitTimeMinutes} minutes. Voulez-vous un itinéraire ?`,
      ar: `لقد وجدت ${halalConcession.name} بالقرب من القسم ${halalConcession.section}! وقت الانتظار الحالي هو ${halalConcession.waitTimeMinutes} دقائق فقط. هل ترغب في إرشادات المشي؟`,
      de: `Ich habe ${halalConcession.name} in der Nähe von Block ${halalConcession.section} gefunden! Wartezeit aktuell nur ${halalConcession.waitTimeMinutes} Minuten. Möchten Sie eine Wegbeschreibung?`,
    };
    return {
      text: responses[lang] || responses.en,
      suggestedAction: { label: 'View on Live Map', routeTab: 'navigate' },
    };
  }

  // Restrooms / Toilet
  if (q.includes('restroom') || q.includes('toilet') || q.includes('bathroom') || q.includes('washroom') || q.includes('baño') || q.includes('toilettes') || q.includes('حمام') || q.includes('toilette')) {
    const bestRestroom = stadium.restrooms.reduce((prev, curr) => (curr.waitTimeMinutes < prev.waitTimeMinutes ? curr : prev), stadium.restrooms[0]);
    const responses: Record<LanguageCode, string> = {
      en: `The fastest restroom is located at Section ${bestRestroom.section} (${bestRestroom.type}). Current queue time is ${bestRestroom.waitTimeMinutes} minutes!`,
      es: `El baño más rápido está en la Sección ${bestRestroom.section} (${bestRestroom.type}). ¡El tiempo de espera es de ${bestRestroom.waitTimeMinutes} minutos!`,
      fr: `Les toilettes les plus rapides sont à la Section ${bestRestroom.section} (${bestRestroom.type}). Temps d'attente : ${bestRestroom.waitTimeMinutes} minutes !`,
      ar: `أسرع دورة مياه تقع في القسم ${bestRestroom.section} (${bestRestroom.type}). وقت الانتظار الحالي هو ${bestRestroom.waitTimeMinutes} دقائق!`,
      de: `Die schnellste Toilette befindet sich in Block ${bestRestroom.section} (${bestRestroom.type}). Aktuelle Wartezeit: ${bestRestroom.waitTimeMinutes} Minuten!`,
    };
    return {
      text: responses[lang] || responses.en,
      suggestedAction: { label: 'Navigate to Restroom', routeTab: 'navigate' },
    };
  }

  // Transit / Metro / Bus / Train / Exit
  if (q.includes('transit') || q.includes('metro') || q.includes('train') || q.includes('bus') || q.includes('leave') || q.includes('exit') || q.includes('home') || q.includes('metro') || q.includes('zug') || q.includes('نقل')) {
    const bestTransit = stadium.transit[0];
    const responses: Record<LanguageCode, string> = {
      en: `For fast departure from ${stadium.name}, take ${bestTransit.name} heading to ${bestTransit.destination}. Next departure is in ${bestTransit.departureInMinutes} minutes! Taking transit earns you +${bestTransit.ecoPoints} Eco Points.`,
      es: `Para salir rápido de ${stadium.name}, toma ${bestTransit.name} hacia ${bestTransit.destination}. ¡Sale en ${bestTransit.departureInMinutes} minutos! Ganas +${bestTransit.ecoPoints} Puntos Eco.`,
      fr: `Pour quitter ${stadium.name} rapidement, prenez ${bestTransit.name} vers ${bestTransit.destination}. Départ dans ${bestTransit.departureInMinutes} minutes ! Vous gagnez +${bestTransit.ecoPoints} Points Éco.`,
      ar: `لمغادرة سريعة من ${stadium.name}، اركب ${bestTransit.name} المتجه إلى ${bestTransit.destination}. المغادرة القادمة خلال ${bestTransit.departureInMinutes} دقائق! تكسب +${bestTransit.ecoPoints} نقطة بيئية.`,
      de: `Für eine schnelle Abreise von ${stadium.name} nehmen Sie ${bestTransit.name} Richtung ${bestTransit.destination}. Abfahrt in ${bestTransit.departureInMinutes} Minuten! Sie erhalten +${bestTransit.ecoPoints} Öko-Punkte.`,
    };
    return {
      text: responses[lang] || responses.en,
      suggestedAction: { label: 'View Transit Timers', routeTab: 'transit' },
    };
  }

  // Bag policy / Security / Rules
  if (q.includes('bag') || q.includes('security') || q.includes('policy') || q.includes('prohibited') || q.includes('bolsa') || q.includes('sac') || q.includes('حقيبة') || q.includes('tasche')) {
    const responses: Record<LanguageCode, string> = {
      en: `FIFA World Cup 2026 strict policy: Only clear plastic/vinyl bags not exceeding 12" x 6" x 12" or small clutch bags (4.5" x 6.5") are permitted inside ${stadium.name}. Express screening available at Gate C!`,
      es: `Política estricta de FIFA 2026: Solo se permiten bolsas transparentes de máximo 30x15x30 cm o bolsos pequeños de mano. ¡Inspección exprés en Puerta C!`,
      fr: `Règle FIFA 2026 : Seuls les sacs transparents (max 30x15x30 cm) ou petites pochettes sont autorisés à ${stadium.name}. Contrôle rapide à la Porte C !`,
      ar: `سياسة حقائب فيفا 2026: يُسمح فقط بالحقائب البلاستيكية الشفافة التي لا تتجاوز 30×15×30 سم أو الحقائب اليدوية الصغيرة. فحص سريع في البوابة C!`,
      de: `FIFA 2026 Richtlinie: Nur transparente Taschen bis max. 30x15x30 cm oder kleine Handtaschen sind im ${stadium.name} erlaubt. Express-Kontrolle an Tor C!`,
    };
    return {
      text: responses[lang] || responses.en,
    };
  }

  // Default fallback
  const fallbacks: Record<LanguageCode, string> = {
    en: `I am monitoring live telemetry for ${stadium.name}. You can ask me about gate congestion, halal/vegan food, accessible restrooms, or real-time transit departures!`,
    es: `Monitoreo telemetría en vivo para ${stadium.name}. ¡Puedes preguntarme sobre puertas, comida vegana/halal, baños accesibles o transporte!`,
    fr: `Je surveille la télémétrie en direct de ${stadium.name}. Posez-moi des questions sur l'affluence, la nourriture, les toilettes ou les transports !`,
    ar: `أنا أراقب القياسات المباشرة لملعب ${stadium.name}. يمكنك سؤالي عن ازدحام البوابات، الطعام الحلال، أو أوقات المغادرة للمترو!`,
    de: `Ich überwache die Live-Daten für ${stadium.name}. Fragen Sie mich nach Toren, Essen, barrierefreien Toiletten oder ÖPNV-Abfahrtszeiten!`,
  };

  return {
    text: fallbacks[lang] || fallbacks.en,
  };
};
