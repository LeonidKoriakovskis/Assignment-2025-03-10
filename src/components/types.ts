import { ActionTypes } from "../pages/BasketballReducer";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Country {
    id: number;
    name: string;
    continent: string;
    flag: string;
  }
  
  export interface Team {
    id: number;
    name: string;
    leagueId: number;
    countryId: number;
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
  
  export interface League {
    id: number;
    name: string;
    countryId: number;
    country?: Country;
  }
  
  export interface State {
    players: Player[];
    teams: Team[];
    leagues: League[];
    countries: Country[];
    loading: boolean;
    error: string | null;
  }

  
  
  export type Action =
  | { type: ActionTypes.FETCH_START }
  | { type: ActionTypes.FETCH_SUCCESS; payload: { type: keyof State; data: any } }
  | { type: ActionTypes.FETCH_ERROR; payload: string }
  | { type: ActionTypes.ADD_ITEM; payload: { type: keyof State; item: any } }
  | { type: ActionTypes.UPDATE_ITEM; payload: { type: keyof State; item: any } }
  | { type: ActionTypes.DELETE_ITEM; payload: { type: keyof State; id: number } };
