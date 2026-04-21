// Sport-specific weather conditions and thresholds
// Inspired by Windy.com activity layers and Meteoblue sport forecasts

export interface SportWeatherProfile {
  sport: string;
  label: string;
  emoji: string;
  isOutdoor: boolean;
  idealConditions: {
    tempMin: number; // °C
    tempMax: number;
    maxWindSpeed: number; // km/h
    maxPrecipitation: number; // % chance
    minVisibility: number; // km
    maxUVIndex: number;
    idealHumidityRange: [number, number]; // %
  };
  dangerConditions: string[]; // weather conditions that make this sport dangerous
  bestTimeOfDay: ('morning' | 'afternoon' | 'evening' | 'any')[];
  seasonalNotes: Record<string, string>;
}

export const SPORT_WEATHER_PROFILES: SportWeatherProfile[] = [
  {
    sport: 'running',
    label: 'Running',
    emoji: '🏃',
    isOutdoor: true,
    idealConditions: {
      tempMin: 5, tempMax: 22, maxWindSpeed: 30, maxPrecipitation: 20,
      minVisibility: 3, maxUVIndex: 7, idealHumidityRange: [30, 70],
    },
    dangerConditions: ['Thunderstorm', 'Snow', 'Fog'],
    bestTimeOfDay: ['morning', 'evening'],
    seasonalNotes: { winter: 'Layer up, watch for ice', summer: 'Run early or late to avoid heat' },
  },
  {
    sport: 'cycling',
    label: 'Cycling',
    emoji: '🚴',
    isOutdoor: true,
    idealConditions: {
      tempMin: 8, tempMax: 30, maxWindSpeed: 25, maxPrecipitation: 10,
      minVisibility: 5, maxUVIndex: 8, idealHumidityRange: [30, 65],
    },
    dangerConditions: ['Thunderstorm', 'Rain', 'Snow', 'Fog'],
    bestTimeOfDay: ['morning', 'afternoon'],
    seasonalNotes: { winter: 'Watch for wet/icy roads', summer: 'Hydrate frequently' },
  },
  {
    sport: 'swimming',
    label: 'Swimming (Outdoor)',
    emoji: '🏊',
    isOutdoor: true,
    idealConditions: {
      tempMin: 22, tempMax: 38, maxWindSpeed: 20, maxPrecipitation: 10,
      minVisibility: 5, maxUVIndex: 10, idealHumidityRange: [40, 80],
    },
    dangerConditions: ['Thunderstorm', 'Snow'],
    bestTimeOfDay: ['morning', 'afternoon'],
    seasonalNotes: { winter: 'Indoor pools recommended', summer: 'Apply waterproof sunscreen' },
  },
  {
    sport: 'tennis',
    label: 'Tennis',
    emoji: '🎾',
    isOutdoor: true,
    idealConditions: {
      tempMin: 12, tempMax: 32, maxWindSpeed: 20, maxPrecipitation: 5,
      minVisibility: 5, maxUVIndex: 8, idealHumidityRange: [30, 65],
    },
    dangerConditions: ['Rain', 'Thunderstorm', 'Snow'],
    bestTimeOfDay: ['morning', 'afternoon', 'evening'],
    seasonalNotes: { summer: 'Court surface gets hot, hydrate', winter: 'Indoor courts recommended' },
  },
  {
    sport: 'padel',
    label: 'Padel',
    emoji: '🏓',
    isOutdoor: true,
    idealConditions: {
      tempMin: 12, tempMax: 32, maxWindSpeed: 15, maxPrecipitation: 5,
      minVisibility: 5, maxUVIndex: 8, idealHumidityRange: [30, 65],
    },
    dangerConditions: ['Rain', 'Thunderstorm', 'Snow'],
    bestTimeOfDay: ['morning', 'afternoon', 'evening'],
    seasonalNotes: { summer: 'Glass walls trap heat', winter: 'Covered courts available' },
  },
  {
    sport: 'golf',
    label: 'Golf',
    emoji: '⛳',
    isOutdoor: true,
    idealConditions: {
      tempMin: 10, tempMax: 30, maxWindSpeed: 25, maxPrecipitation: 10,
      minVisibility: 5, maxUVIndex: 8, idealHumidityRange: [30, 70],
    },
    dangerConditions: ['Thunderstorm', 'Snow', 'Fog'],
    bestTimeOfDay: ['morning', 'afternoon'],
    seasonalNotes: { summer: 'Morning tee times recommended', winter: 'Check course conditions' },
  },
  {
    sport: 'surfing',
    label: 'Surfing',
    emoji: '🏄',
    isOutdoor: true,
    idealConditions: {
      tempMin: 15, tempMax: 35, maxWindSpeed: 30, maxPrecipitation: 40,
      minVisibility: 3, maxUVIndex: 10, idealHumidityRange: [40, 90],
    },
    dangerConditions: ['Thunderstorm'],
    bestTimeOfDay: ['morning', 'evening'],
    seasonalNotes: { winter: 'Wetsuit required in most locations', summer: 'Offshore wind ideal' },
  },
  {
    sport: 'skiing',
    label: 'Skiing / Snowboarding',
    emoji: '⛷️',
    isOutdoor: true,
    idealConditions: {
      tempMin: -15, tempMax: 2, maxWindSpeed: 30, maxPrecipitation: 60,
      minVisibility: 2, maxUVIndex: 10, idealHumidityRange: [40, 90],
    },
    dangerConditions: ['Thunderstorm'],
    bestTimeOfDay: ['morning', 'afternoon'],
    seasonalNotes: { winter: 'Peak season', spring: 'Spring skiing conditions vary' },
  },
  {
    sport: 'hiking',
    label: 'Hiking',
    emoji: '🥾',
    isOutdoor: true,
    idealConditions: {
      tempMin: 5, tempMax: 28, maxWindSpeed: 35, maxPrecipitation: 20,
      minVisibility: 5, maxUVIndex: 8, idealHumidityRange: [30, 70],
    },
    dangerConditions: ['Thunderstorm', 'Snow', 'Fog'],
    bestTimeOfDay: ['morning', 'afternoon'],
    seasonalNotes: { summer: 'Start early for mountain hikes', winter: 'Check trail conditions & daylight' },
  },
  {
    sport: 'climbing',
    label: 'Rock Climbing',
    emoji: '🧗',
    isOutdoor: true,
    idealConditions: {
      tempMin: 8, tempMax: 28, maxWindSpeed: 20, maxPrecipitation: 5,
      minVisibility: 5, maxUVIndex: 8, idealHumidityRange: [20, 60],
    },
    dangerConditions: ['Rain', 'Thunderstorm', 'Snow', 'Fog'],
    bestTimeOfDay: ['morning', 'afternoon'],
    seasonalNotes: { summer: 'Avoid midday heat on south-facing walls', winter: 'Low humidity great for grip' },
  },
  {
    sport: 'sailing',
    label: 'Sailing',
    emoji: '⛵',
    isOutdoor: true,
    idealConditions: {
      tempMin: 10, tempMax: 30, maxWindSpeed: 40, maxPrecipitation: 20,
      minVisibility: 5, maxUVIndex: 10, idealHumidityRange: [40, 80],
    },
    dangerConditions: ['Thunderstorm'],
    bestTimeOfDay: ['morning', 'afternoon'],
    seasonalNotes: { summer: 'Thermal winds strongest afternoon', winter: 'Check weather windows' },
  },
  {
    sport: 'diving',
    label: 'Scuba Diving',
    emoji: '🤿',
    isOutdoor: true,
    idealConditions: {
      tempMin: 20, tempMax: 35, maxWindSpeed: 20, maxPrecipitation: 20,
      minVisibility: 8, maxUVIndex: 10, idealHumidityRange: [40, 90],
    },
    dangerConditions: ['Thunderstorm'],
    bestTimeOfDay: ['morning', 'afternoon'],
    seasonalNotes: { summer: 'Best visibility', winter: 'Thicker wetsuit needed' },
  },
  {
    sport: 'yoga',
    label: 'Outdoor Yoga',
    emoji: '🧘',
    isOutdoor: true,
    idealConditions: {
      tempMin: 15, tempMax: 30, maxWindSpeed: 15, maxPrecipitation: 5,
      minVisibility: 5, maxUVIndex: 6, idealHumidityRange: [30, 65],
    },
    dangerConditions: ['Rain', 'Thunderstorm', 'Snow'],
    bestTimeOfDay: ['morning', 'evening'],
    seasonalNotes: { summer: 'Sunrise sessions ideal', winter: 'Indoor practice recommended' },
  },
  {
    sport: 'football',
    label: 'Football / Soccer',
    emoji: '⚽',
    isOutdoor: true,
    idealConditions: {
      tempMin: 5, tempMax: 28, maxWindSpeed: 30, maxPrecipitation: 30,
      minVisibility: 3, maxUVIndex: 8, idealHumidityRange: [30, 75],
    },
    dangerConditions: ['Thunderstorm', 'Snow'],
    bestTimeOfDay: ['morning', 'afternoon', 'evening'],
    seasonalNotes: { summer: 'Hydrate well', winter: 'Warm up thoroughly' },
  },
  {
    sport: 'triathlon',
    label: 'Triathlon',
    emoji: '🏊‍♂️',
    isOutdoor: true,
    idealConditions: {
      tempMin: 12, tempMax: 28, maxWindSpeed: 25, maxPrecipitation: 15,
      minVisibility: 5, maxUVIndex: 8, idealHumidityRange: [40, 75],
    },
    dangerConditions: ['Thunderstorm', 'Snow', 'Fog'],
    bestTimeOfDay: ['morning'],
    seasonalNotes: { summer: 'Watch open-water temp & jellyfish reports', winter: 'Indoor brick sessions recommended' },
  },
  {
    sport: 'hyrox',
    label: 'HYROX',
    emoji: '🔥',
    isOutdoor: false,
    idealConditions: {
      tempMin: 14, tempMax: 26, maxWindSpeed: 100, maxPrecipitation: 100,
      minVisibility: 0, maxUVIndex: 11, idealHumidityRange: [30, 65],
    },
    dangerConditions: [],
    bestTimeOfDay: ['any'],
    seasonalNotes: { summer: 'Race venue AC matters — hydrate hard', winter: 'Peak indoor race season' },
  },
  {
    sport: 'crossfit',
    label: 'CrossFit',
    emoji: '🏋️',
    isOutdoor: false,
    idealConditions: {
      tempMin: 14, tempMax: 28, maxWindSpeed: 100, maxPrecipitation: 100,
      minVisibility: 0, maxUVIndex: 11, idealHumidityRange: [30, 65],
    },
    dangerConditions: [],
    bestTimeOfDay: ['any'],
    seasonalNotes: { summer: 'Outdoor WODs ok early/late', winter: 'Box-based all season' },
  },
  {
    sport: 'chess',
    label: 'Chess',
    emoji: '♟️',
    isOutdoor: false,
    idealConditions: {
      tempMin: 10, tempMax: 30, maxWindSpeed: 100, maxPrecipitation: 100,
      minVisibility: 0, maxUVIndex: 11, idealHumidityRange: [20, 80],
    },
    dangerConditions: [],
    bestTimeOfDay: ['any'],
    seasonalNotes: { summer: 'Park play possible — bring clock & shade', winter: 'Club & online season peaks' },
  },
];

export type WeatherSeverity = 'extreme' | 'severe' | 'moderate' | 'advisory';

export interface SevereWeatherEvent {
  type: string;
  severity: WeatherSeverity;
  headline: string;
  description: string;
  affectedSports: string[];
  safetyTips: string[];
}

export const SEVERE_WEATHER_TYPES: Record<string, SevereWeatherEvent> = {
  'heavy-rain': {
    type: 'heavy-rain',
    severity: 'severe',
    headline: '🌧️ Heavy Rain Warning',
    description: 'Significant rainfall expected. Outdoor activities may be dangerous.',
    affectedSports: ['running', 'cycling', 'tennis', 'padel', 'golf', 'hiking', 'climbing', 'yoga', 'basketball', 'triathlon'],
    safetyTips: ['Move activities indoors', 'Avoid flood-prone areas', 'Carry waterproof gear'],
  },
  'strong-wind': {
    type: 'strong-wind',
    severity: 'moderate',
    headline: '💨 Strong Wind Advisory',
    description: 'High winds expected. Some outdoor activities not recommended.',
    affectedSports: ['cycling', 'golf', 'sailing', 'surfing', 'yoga', 'padel'],
    safetyTips: ['Secure loose equipment', 'Avoid exposed ridges for hiking', 'Check marine forecasts'],
  },
  'snowstorm': {
    type: 'snowstorm',
    severity: 'extreme',
    headline: '🌨️ Snowstorm Warning',
    description: 'Heavy snowfall expected with reduced visibility and dangerous travel.',
    affectedSports: ['running', 'cycling', 'tennis', 'golf', 'hiking', 'climbing', 'football'],
    safetyTips: ['Stay indoors if possible', 'Skiing may also be affected by low visibility', 'Check road conditions'],
  },
  'extreme-heat': {
    type: 'extreme-heat',
    severity: 'severe',
    headline: '🔥 Extreme Heat Warning',
    description: 'Dangerously high temperatures. Heat stroke risk for outdoor activity.',
    affectedSports: ['running', 'cycling', 'tennis', 'golf', 'hiking', 'football', 'basketball', 'yoga', 'triathlon'],
    safetyTips: ['Exercise only in early morning or late evening', 'Hydrate every 15 minutes', 'Wear light, breathable clothing'],
  },
  'thunderstorm': {
    type: 'thunderstorm',
    severity: 'extreme',
    headline: '⛈️ Thunderstorm Warning',
    description: 'Lightning, heavy rain and potential hail. All outdoor activities unsafe.',
    affectedSports: ['running', 'cycling', 'swimming', 'tennis', 'padel', 'golf', 'surfing', 'skiing', 'hiking', 'climbing', 'sailing', 'diving', 'yoga', 'football', 'basketball', 'triathlon'],
    safetyTips: ['Seek shelter immediately', 'Avoid open fields and water', 'Wait 30 min after last thunder'],
  },
  'fog': {
    type: 'fog',
    severity: 'advisory',
    headline: '🌫️ Dense Fog Advisory',
    description: 'Low visibility conditions. Drive and cycle with extreme caution.',
    affectedSports: ['cycling', 'running', 'hiking', 'climbing', 'golf'],
    safetyTips: ['Wear high-visibility clothing', 'Use headlights if cycling', 'Avoid mountain trails'],
  },
  'uv-extreme': {
    type: 'uv-extreme',
    severity: 'moderate',
    headline: '☀️ Extreme UV Index',
    description: 'UV index above 10. High risk of sunburn and skin damage.',
    affectedSports: ['swimming', 'surfing', 'sailing', 'hiking', 'golf', 'tennis', 'running', 'cycling'],
    safetyTips: ['Apply SPF 50+ every 2 hours', 'Wear UV-protective clothing', 'Avoid 11am-3pm exposure'],
  },
};

// Evaluate sport suitability based on weather
export function evaluateSportWeather(
  sport: SportWeatherProfile,
  weather: { temp: number; windSpeed: number; precipitation: number; visibility: number; uvIndex: number; humidity: number; condition: string }
): { score: number; rating: 'perfect' | 'good' | 'fair' | 'poor' | 'unsafe'; reasons: string[] } {
  const reasons: string[] = [];
  let score = 100;

  // Check danger conditions
  if (sport.dangerConditions.some(dc => weather.condition.toLowerCase().includes(dc.toLowerCase()))) {
    return { score: 0, rating: 'unsafe', reasons: [`${weather.condition} is dangerous for ${sport.label}`] };
  }

  // Temperature
  if (weather.temp < sport.idealConditions.tempMin) {
    const diff = sport.idealConditions.tempMin - weather.temp;
    score -= Math.min(diff * 3, 40);
    reasons.push(`Too cold (${weather.temp}°C, ideal >${sport.idealConditions.tempMin}°C)`);
  } else if (weather.temp > sport.idealConditions.tempMax) {
    const diff = weather.temp - sport.idealConditions.tempMax;
    score -= Math.min(diff * 3, 40);
    reasons.push(`Too hot (${weather.temp}°C, ideal <${sport.idealConditions.tempMax}°C)`);
  }

  // Wind
  if (weather.windSpeed > sport.idealConditions.maxWindSpeed) {
    const diff = weather.windSpeed - sport.idealConditions.maxWindSpeed;
    score -= Math.min(diff * 2, 30);
    reasons.push(`Wind too strong (${weather.windSpeed} km/h)`);
  }

  // Precipitation
  if (weather.precipitation > sport.idealConditions.maxPrecipitation) {
    score -= Math.min((weather.precipitation - sport.idealConditions.maxPrecipitation), 30);
    reasons.push(`Rain likely (${weather.precipitation}%)`);
  }

  // UV
  if (weather.uvIndex > sport.idealConditions.maxUVIndex) {
    score -= Math.min((weather.uvIndex - sport.idealConditions.maxUVIndex) * 5, 20);
    reasons.push(`High UV (${weather.uvIndex})`);
  }

  score = Math.max(0, score);

  let rating: 'perfect' | 'good' | 'fair' | 'poor' | 'unsafe';
  if (score >= 85) rating = 'perfect';
  else if (score >= 65) rating = 'good';
  else if (score >= 45) rating = 'fair';
  else if (score >= 20) rating = 'poor';
  else rating = 'unsafe';

  if (reasons.length === 0) reasons.push('Ideal conditions!');

  return { score, rating, reasons };
}
