import React from 'react';
import Card from './Card';

const WorkflowStep = ({ number, text, isLast = false }: { number: number, text: string, isLast?: boolean }) => (
  <div className="flex items-center">
    <div className="flex-shrink-0 bg-[#333333] text-white rounded-full h-8 w-8 flex items-center justify-center font-bold text-sm">
      {number}
    </div>
    <span className="ml-2 font-semibold text-sm whitespace-nowrap">{text}</span>
    {!isLast && <div className="w-8 md:w-12 h-0.5 bg-gray-300 mx-3"></div>}
  </div>
);

const WorkflowHero: React.FC = () => {
  return (
    <Card>
      <div className="flex items-center justify-center flex-wrap gap-y-2 gap-x-0 md:gap-x-2">
        <WorkflowStep number={1} text="Choose Persona" />
        <WorkflowStep number={2} text="Generate Presentation" />
        <WorkflowStep number={3} text="Generate FAQ" isLast />
      </div>
    </Card>
  );
};

export default WorkflowHero;
