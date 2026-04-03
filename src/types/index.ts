// src/types/index.ts

export type PlayStyle = 'Aggressive Baseliner' | 'All-Court' | 'Serve and Volley' | 'Counter Puncher';
export type DominantHand = 'Right' | 'Left' | 'Ambidextrous';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  playStyle: PlayStyle;
  dominantHand: DominantHand;
}

export interface Racket {
  id: string;
  customerId: string;
  brand: string;
  model: string;
  stringPattern: string; // e.g., '16x19', '18x20'
  headSize: number; // sq inches
  weight: number; // unstrung weight in grams
  qrCode?: string; // identifier
}

export interface StringingJob {
  id: string;
  racketId: string;
  customerId: string;
  date: string; // ISO string
  mainString: string;
  crossString: string;
  tensionMainLbs: number;
  tensionCrossLbs: number;
  preStretch: boolean;
  preStretchPercentage?: number;
  dynamicTensionOut: number; // DT out of the machine
  notes: string;
}

export interface PerformanceFeedback {
  id: string;
  jobId: string;
  customerId: string;
  date: string;
  kpis: {
    tensionMaintenance: number; // 1 to 5
    power: number; // 1 to 5
    comfort: number; // 1 to 5
    spin: number; // 1 to 5
    control: number; // 1 to 5
  };
  comments: string;
}
