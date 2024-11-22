import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import PresenceList from './components/PresenceList';
import DrawPage from './components/DrawPage';
import TeamsDisplay from './components/TeamsDisplay';
import { Match } from './services/team-draw.service';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [playerCount, setPlayerCount] = useState(() => {
    const saved = localStorage.getItem('playerCount');
    return saved || '';
  });
  
  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem('matches');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [presentPlayers, setPresentPlayers] = useState<Set<number>>(() => {
    const saved = localStorage.getItem('presentPlayers');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('playerCount', playerCount);
  }, [playerCount]);

  useEffect(() => {
    localStorage.setItem('matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('presentPlayers', JSON.stringify(Array.from(presentPlayers)));
  }, [presentPlayers]);

  const handlePlayerCountChange = (count: string) => {
    setPlayerCount(count);
    if (!isNaN(parseInt(count))) {
      const newPresent = new Set<number>();
      for (let i = 1; i <= parseInt(count); i++) {
        newPresent.add(i);
      }
      setPresentPlayers(newPresent);
    }
  };

  const handleReset = () => {
    setPlayerCount('');
    setPresentPlayers(new Set());
    setMatches([]);
    localStorage.removeItem('playerCount');
    localStorage.removeItem('matches');
    localStorage.removeItem('presentPlayers');
  };

  const handleTogglePresence = (playerId: number) => {
    const newPresent = new Set(presentPlayers);
    if (newPresent.has(playerId)) {
      newPresent.delete(playerId);
    } else {
      newPresent.add(playerId);
    }
    setPresentPlayers(newPresent);
  };

  const handleMatchesUpdate = (newMatches: Match[]) => {
    setMatches(newMatches);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold text-center">Tirage au Sort</h1>
        {!isOnline && (
          <div className="text-sm text-center mt-1 bg-yellow-500 p-1 rounded">
            Mode hors connexion - Vos données sont sauvegardées localement
          </div>
        )}
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
                presentPlayers={presentPlayers}
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
                presentPlayers={Array.from(presentPlayers)}
                onMatchesUpdate={handleMatchesUpdate}
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