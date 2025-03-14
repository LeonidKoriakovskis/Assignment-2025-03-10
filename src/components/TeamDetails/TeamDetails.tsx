import { Link } from "react-router-dom";
import {  Team } from "../../types/types";
import { useEffect, useState } from "react";
import { Roster, TeamStats } from "../../types/basketball";
import axios from "axios";
import { API_URL } from "../../api/apiUrl";
import styles from "./TeamDetails.module.css";


interface TeamDetailsProps {
  team: Team;
  onEdit: () => void;
  onDelete: () => void;
}

const TeamDetails = ({ team, onEdit, onDelete }: TeamDetailsProps) => {
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
  const [roster, setRoster] = useState<Roster | null>(null);
  interface Country {
    name: string;
    flag: string;
  }
  
  const [country, setCountry] = useState<Country | null>(null);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        
        const statsResponse = await axios.get(`${API_URL}/teamStats?teamId=${team.id}`);
        if (statsResponse.data.length > 0) {
          setTeamStats(statsResponse.data[0]);
        }

        
        const rosterResponse = await axios.get(
          `${API_URL}/rosters?teamId=${team.id}&season=2023-2024`
        );
        if (rosterResponse.data.length > 0) {
          setRoster(rosterResponse.data[0]);
        }

        
        if (team.countryId) {
          const countryResponse = await axios.get(`${API_URL}/countries/${team.countryId}`);
          setCountry(countryResponse.data);
        }
      } catch (error) {
        console.error('Error fetching team details:', error);
      }
    };

    fetchTeamDetails();
  }, [team.id, team.countryId]);

  return (
    <div className={styles['team-details']}>
    <h1>{team.name}</h1>

    {country && (
      <div className={styles['country-section']}>
        <h2>Country</h2>
        <span>{country.name}:</span>
        <img width={'25px'} src={country.flag} alt={`Flag of ${country.name}`} />
      </div>
    )}

    {teamStats && (
      <div className={styles['team-stats-section']}>
        <h2>Team Statistics</h2>
        <div className={styles['stats-grid']}>
          <div className={styles['stat-item']}>
            <label>Championships:</label>
            <span>{teamStats.totalChampionships}</span>
          </div>
          <div className={styles['stat-item']}>
            <label>Established:</label>
            <span>{teamStats.establishedYear}</span>
          </div>
          <div className={styles['stat-item']}>
            <label>Home Arena:</label>
            <span>{teamStats.homeArena}</span>
          </div>
          <div className={styles['stat-item']}>
            <label>Arena Capacity:</label>
            <span>{teamStats.arenaCapacity.toLocaleString()}</span>
          </div>
          <div className={styles['stat-item']}>
            <label>Team Value:</label>
            <span>{teamStats.teamValue}</span>
          </div>
          <div className={styles['stat-item']}>
            <label>Head Coach:</label>
            <span>{teamStats.headCoach}</span>
          </div>
        </div>
      </div>
    )}

    {roster && (
      <div className={styles['roster-section']}>
        <h2>Current Roster ({roster.season})</h2>
        <div className={styles['roster-grid']}>
          {roster.players.map((player) => (
            <div key={player.playerId} className={styles['player-card']}>
              <div className={styles['jersey-number']}>#{player.jerseyNumber}</div>
              <div className={styles['player-info']}>
                <div className={styles['player-role']}>{player.role}</div>
                <div className={styles['player-since']}>
                  Since: {new Date(player.startDate).getFullYear()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {team.league && (
      <div className={styles['league-section']}>
        <h2>League</h2>
        <p>
          <Link to={`/project/leagues/${team.league.id}`}>
            {team.league.name}
          </Link>
        </p>
      </div>
    )}

    <div className={styles['action-buttons']}>
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </div>
    
    <div className={styles.navigation}>
      <Link to="/project/teams">Back to Teams List</Link>
    </div>
  </div>
  );
};

export default TeamDetails;

