export type VikingThing = {
  id: string;
  name: string;
  oldNorse: string;
  image: string;
  category: string;
  description: string;
};

export type Language = 'english' | 'oldNorse';

export type GameConfig = {
  roundCount: number;
  optionCount: number;
  language: Language;
};

export type Attempt = 1 | 2 | 3;

export type Round = {
  answer: VikingThing;
  options: VikingThing[];
  focal: { x: number; y: number };
  attempt: Attempt;
  picked: string[];
  result: 'pending' | 'won' | 'lost';
  pointsEarned: number;
};

export type Game = {
  config: GameConfig;
  rounds: Round[];
  index: number;
  totalScore: number;
};
