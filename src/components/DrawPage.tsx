import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaDice } from 'react-icons/fa';
import { TeamDrawService, Player, Match } from '../services/team-draw.service';

interface DrawPageProps {
  playerCount: string;
  presentPlayers: Player[];
  onMatchesUpdate: (matches: Match[]) => void;
  onUpdateBonus: (playerIds: number[]) => void;
}

const DrawPage: React.FC<DrawPageProps> = ({ 
  playerCount, 
  presentPlayers, 
  onMatchesUpdate,
  onUpdateBonus 
}) => {
  const teamDrawService = new TeamDrawService();
  const navigate = useNavigate();

  console.log('DrawPage rendu avec:', { playerCount, presentPlayers });

  const handleDraw = () => {
    console.log('handleDraw appelé');
    
    if (presentPlayers.length < 4) {
      alert("Il faut au moins 4 joueurs présents pour effectuer le tirage");
      return;
    }

    try {
      console.log('Génération des matches...');
      const newMatches = teamDrawService.generateMatches(presentPlayers);
      console.log('Matches générés:', newMatches);
      
      const triplettePlayers = newMatches.flatMap(match => {
        const { team1, team2 } = match.teams;
        return [...team1, ...team2].filter(player => 
          team1.length === 3 || team2.length === 3
        ).map(player => player.id);
      });

      console.log('Avant onUpdateBonus:', { triplettePlayers });

      onUpdateBonus(triplettePlayers);
      onMatchesUpdate(newMatches);
      navigate('/teams');
    } catch (error) {
      console.error('Erreur dans handleDraw:', error);
      alert("Une erreur s'est produite lors du tirage");
    }
  };

  return (
    <main className="container mx-auto px-4 py-6 max-w-lg">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Tirage au sort</h2>
          <button 
            onClick={() => navigate('/presence')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md font-semibold"
          >
            <FaUsers />
            <span>PRÉSENCE</span>
          </button>
        </div>
        <div className="text-center mb-4">
          <p>Joueurs présents: {presentPlayers.length} / {playerCount}</p>
        </div>
        <div className="flex gap-2 justify-center">
          <button
            onClick={handleDraw}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-700 transition-colors"
          >
            <FaDice className="text-xl" />
            <span>EFFECTUER LE TIRAGE</span>
          </button>
        </div>
      </div>
    </main>
  );
};

export default DrawPage;