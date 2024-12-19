import React from 'react';

interface PlayerCircleProps {
  number: number;
  isPresent: boolean;
  hasBonus: boolean;
  onClick: () => void;
}

const PlayerCircle: React.FC<PlayerCircleProps> = ({ number, isPresent, hasBonus, onClick }) => {
  const backgroundColor = isPresent 
    ? hasBonus 
      ? 'bg-orange-500' // Joueur présent avec bonus
      : 'bg-red-600'    // Joueur présent sans bonus
    : 'bg-gray-200';    // Joueur absent

  return (
    <button
      onClick={onClick}
      className={`w-12 h-12 ${backgroundColor} rounded-full flex items-center justify-center text-white font-bold transition-colors`}
    >
      {number}
    </button>
  );
};

export default PlayerCircle;