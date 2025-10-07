
export interface Persona {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

export interface FinancingScenario {
  option: string;
  pros: string[];
  cons: string[];
  bestFor: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
