
import type { Persona, FinancingScenario, FAQItem } from './types';

export const PERSONAS: Persona[] = [
  {
    id: 'budget_family',
    name: 'Budget-Conscious Family',
    description: 'Focuses on long-term savings and energy independence.',
    prompt: 'A family focused on saving money with a tight budget.'
  },
  {
    id: 'eco_warrior',
    name: 'Eco-Warrior',
    description: 'Prioritizes environmental impact and sustainability.',
    prompt: 'An environmentally conscious individual who wants to reduce their carbon footprint.'
  },
  {
    id: 'tech_enthusiast',
    name: 'Tech Enthusiast',
    description: 'Interested in the latest technology, smart home integration, and performance metrics.',
    prompt: 'A tech-savvy person interested in the latest gadgets and home automation.'
  },
];

export const FALLBACK_BENEFITS = `Solar panels provide significant long-term savings on electricity bills by generating your own clean energy. This reduces reliance on the grid, offering energy independence and protection against rising utility costs. Additionally, solar energy is environmentally friendly, reducing your carbon footprint and contributing to a healthier planet. Modern solar systems are durable, require minimal maintenance, and can increase your property value.`;

export const FALLBACK_IMAGE_URL = 'https://picsum.photos/1024/768?random=1';

export const FALLBACK_FINANCING_SCENARIOS: FinancingScenario[] = [
  {
    option: 'Solar Loan',
    pros: ['You own the system', 'Eligible for tax credits', 'Fixed monthly payments'],
    cons: ['Requires good credit', 'Responsible for maintenance'],
    bestFor: 'Homeowners who want to own their system and maximize financial returns.'
  },
  {
    option: 'Cash Purchase',
    pros: ['Highest ROI', 'No monthly payments', 'Full ownership benefits'],
    cons: ['High upfront cost'],
    bestFor: 'Those with available capital seeking the best long-term investment.'
  },
  {
    option: 'Lease / PPA',
    pros: ['Low or no upfront cost', 'No maintenance responsibility', 'Predictable energy costs'],
    cons: ['Do not own the system', 'Not eligible for tax credits', 'Complex contracts'],
    bestFor: 'Customers wanting immediate savings with minimal initial investment.'
  },
];

export const FALLBACK_FAQ: FAQItem[] = [
    {
        question: "How much can I save with solar panels?",
        answer: "Savings vary based on your energy consumption, local utility rates, and system size. Most homeowners see a significant reduction in their monthly electricity bills."
    },
    {
        question: "What happens on cloudy days or at night?",
        answer: "Your system produces less energy on cloudy days and none at night. However, you remain connected to the grid to draw power when needed. Battery storage systems can also provide power during these times."
    },
    {
        question: "Do solar panels require maintenance?",
        answer: "Solar panels are very durable and require little maintenance. We recommend an occasional cleaning and an annual inspection to ensure optimal performance."
    }
];
