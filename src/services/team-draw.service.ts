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
        if (players.length < 4) {
            return [{
                matchNumber: 1,
                matchText: "Il faut au moins 4 joueurs présents",
                teams: { team1: [], team2: [] }
            }];
        }

        const shuffledPlayers = [...players];
        this.shuffleArray(shuffledPlayers);
        const matches: Match[] = [];
        let matchNumber = 1;
        let remainingPlayers = [...shuffledPlayers];

        // Traitement selon le modulo
        const modulo = remainingPlayers.length % 4;

        while (remainingPlayers.length >= 4) {
            const team1 = remainingPlayers.splice(0, 2);
            const team2 = remainingPlayers.splice(0, 2);
            matches.push(this.createMatch(matchNumber++, team1, team2));
        }

        // Gestion des joueurs restants
        if (remainingPlayers.length > 0) {
            const lastMatch = this.handleRemainingPlayers(remainingPlayers, matchNumber);
            if (lastMatch) matches.push(lastMatch);
        }

        return matches;
    }

    private handleRemainingPlayers(players: Player[], matchNumber: number): Match | null {
        switch (players.length) {
            case 3: // 2v3
                const team1 = players.slice(0, 2);
                const team2 = players.slice(2);
                return this.createMatch(matchNumber, team1, team2);
            case 2: // Ajouter à la dernière équipe
                // TODO: Implémenter la logique pour 2 joueurs restants
                break;
            case 1: // Ajouter à la dernière équipe
                // TODO: Implémenter la logique pour 1 joueur restant
                break;
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

    private shuffleArray(array: Player[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}