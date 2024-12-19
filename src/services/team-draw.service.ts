export interface Player {
    id: number;
    hasBonus: boolean;
}

export interface Match {
    matchNumber: number;
    matchText: string;
    teams: {
        team1: Player[];
        team2: Player[];
    };
}

export class TeamDrawService {
    public generateMatches(players: Player[]): Match[] {
        const playerCount = players.length;
        if (playerCount < 4 || playerCount > 99) {
            return [{
                matchNumber: 1,
                matchText: "Le nombre de joueurs doit être entre 4 et 99",
                teams: { team1: [], team2: [] }
            }];
        }

        // Trier les joueurs : ceux avec bonus en dernier
        const sortedPlayers = [...players].sort((a, b) => {
            if (a.hasBonus === b.hasBonus) return 0;
            return a.hasBonus ? 1 : -1;
        });

        const matches: Match[] = [];
        let matchNumber = 1;
        let remainingPlayers = [...sortedPlayers];

        // Logique de tirage modifiée
        while (remainingPlayers.length >= 4) {
            // Priorité aux doublettes
            const team1 = remainingPlayers.splice(0, 2);
            const team2 = remainingPlayers.splice(0, 2);
            matches.push(this.createMatch(matchNumber++, team1, team2));
        }

        // Gestion du reste des joueurs
        if (remainingPlayers.length > 0) {
            const lastMatch = this.handleRemainingPlayers(remainingPlayers, matchNumber);
            if (lastMatch) matches.push(lastMatch);
        }

        return matches;
    }

    private handleRemainingPlayers(players: Player[], matchNumber: number): Match | null {
        // Éviter les triplettes pour les joueurs avec bonus si possible
        const nonBonusPlayers = players.filter(p => !p.hasBonus);
        const bonusPlayers = players.filter(p => p.hasBonus);

        switch (players.length) {
            case 3:
                // Si possible, mettre les joueurs avec bonus en doublette
                if (bonusPlayers.length > 0) {
                    const team1 = [bonusPlayers[0], nonBonusPlayers[0]];
                    const team2 = players.filter(p => !team1.includes(p));
                    return this.createMatch(matchNumber, team1, team2);
                }
                break;
            // Ajouter d'autres cas selon vos besoins
        }

        return null;
    }

    private createMatch(number: number, team1: Player[], team2: Player[]): Match {
        return {
            matchNumber: number,
            matchText: `${team1.map(p => p.id).join(", ")} contre ${team2.map(p => p.id).join(", ")}`,
            teams: { team1, team2 }
        };
    }
}