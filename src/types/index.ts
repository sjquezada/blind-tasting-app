// src/types/index.ts
export interface Collection {
    name: string;
    type: 'whiskey' | 'rum';
    bottles: string[];
    isActive: boolean;
  }
  
  export interface Participant {
    email: string;
    number: number;
    bottle: string;
  }