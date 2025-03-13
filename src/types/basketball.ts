export interface League {
  id: number;
  name: string;
  countryId: number;
  country?: Country;
}

export interface Country {
  id: number;
  name: string;
  flag: string;
}

export interface HomeArena {
  id: number;
  name: string;
}

export interface Player {
  id: number;
  name: string;
}

export interface Coach {
  id: number;
  name: string;
}

export interface Team {
  id: number;
  name: string;
  league?: {
    id: number;
    name: string;
  };
  country?: {
    id: number;
    name: string;
    flag: string;
  };
  stats?: TeamStats;
  roster?: Roster;
}

export interface RosterPlayer {
  playerId: number;
  jerseyNumber: number;
  role: string;
  startDate: string;
}

export interface Roster {
  id: number;
  teamId: number;
  season: string;
  players: RosterPlayer[];
}

export interface TeamStats {
  teamId: number;
  totalChampionships: number;
  establishedYear: number;
  homeArena: string;
  arenaCapacity: number;
  teamValue: string;
  headCoach: string;
}

export interface Player {
  id: number;
  name: string;
  position: string;
  teamId: number;
  countryId: number;
  team?: Team;
  country?: Country;
}

export interface TeamFormData {
  name: string;
  leagueId: number;
  countryId: number;
}

export interface PlayerFormData {
  name: string;
  position: string;
  teamId: number;
  countryId: number;
}


export interface LeagueFormData {
  name: string;
  countryId: number;
}
export interface CountryFormData {
  name: string;
  continent: string;
  flag: string;
}




export interface BasketballState {
  teams: Team[];
  leagues: League[];
  countries: Country[];
  players: Player[];
  loading: boolean;
  error: string | null;
} 