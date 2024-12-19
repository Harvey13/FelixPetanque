import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import PresenceList from './components/PresenceList';
import DrawPage from './components/DrawPage';
import TeamsDisplay from './components/TeamsDisplay';
import { Match } from './services/team-draw.service';

function App() {
  const [playerCount, setPlayerCount] = useState('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [presentPlayers, setPresentPlayers] = useState<Map<number, Player>>(new Map());

  const handlePlayerCountChange = (count: string) => {
    setPlayerCount(count);
    if (!isNaN(parseInt(count))) {
      const newPresent = new Map<number, Player>();
      for (let i = 1; i <= parseInt(count); i++) {
        newPresent.set(i, { id: i, hasBonus: false });
      }
      setPresentPlayers(newPresent);
    }
  };

  const handleReset = () => {
    setPlayerCount('');
    setPresentPlayers(new Map());
    setMatches([]);
  };

  const handleTogglePresence = (playerId: number) => {
    const newPresent = new Map(presentPlayers);
    const player = newPresent.get(playerId);
    if (player) {
      newPresent.set(playerId, { ...player, hasBonus: !player.hasBonus });
    }
    setPresentPlayers(newPresent);
  };

  const handleMatchesUpdate = (newMatches: Match[]): void => {
    console.log('handleMatchesUpdate called with:', newMatches);
    setMatches(newMatches);
  };

  const handleUpdateBonus = (playerIds: number[]): void => {
    console.log('handleUpdateBonus called with:', playerIds);
    const newPresent = new Map(presentPlayers);
    playerIds.forEach(id => {
      const player = newPresent.get(id);
      if (player) {
        newPresent.set(id, { ...player, hasBonus: true });
      }
    });
    setPresentPlayers(newPresent);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold text-center">Tirage au Sort</h1>
      </header>

      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage 
              playerCount={playerCount}
              onPlayerCountChange={handlePlayerCountChange}
              onReset={handleReset}
            />
          } 
        />
        <Route 
          path="/presence" 
          element={
            parseInt(playerCount) >= 4 ? (
              <PresenceList 
                playerCount={playerCount}
                presentPlayers={Array.from(presentPlayers.values())}
                onTogglePresence={handleTogglePresence}
              />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route 
          path="/draw" 
          element={
            parseInt(playerCount) >= 4 ? (
              <DrawPage 
                playerCount={playerCount}
                presentPlayers={Array.from(presentPlayers.values())}
                onMatchesUpdate={handleMatchesUpdate}
                onUpdateBonus={handleUpdateBonus}
              />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route 
          path="/teams" 
          element={
            matches.length > 0 ? (
              <TeamsDisplay 
                matches={matches}
                onBack={() => setMatches([])}
              />
            ) : (
              <Navigate to="/draw" replace />
            )
          } 
        />
      </Routes>
    </div>
  );
}

export default App;