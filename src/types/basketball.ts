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

export interface Team {
  id: number;
  name: string;
  leagueId: number;
  countryId: number;
  league?: League;
  country?: Country;
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

export interface BasketballState {
  teams: Team[];
  leagues: League[];
  countries: Country[];
  players: Player[];
  loading: boolean;
  error: string | null;
} 