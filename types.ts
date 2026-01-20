
export interface Country {
  name: string;
  code: string; // ISO 3166-1 alpha-2 for flag image
  capital: string;
  currency: string;
  difficulty: number; // 1-10
}

export enum GameMode {
  NORMAL = 'NORMAL',
  BLITZ = 'BLITZ'
}

export enum Tier {
  NAME = 'NAME',
  CAPITAL = 'CAPITAL',
  CURRENCY = 'CURRENCY'
}

export interface GameState {
  currentLevel: number;
  score: number;
  questionsInLevel: number;
  currentCountry: Country | null;
  currentTier: Tier;
  isGameOver: boolean;
  history: string[];
}
