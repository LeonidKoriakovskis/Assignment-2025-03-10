import axios from "axios";

export const API_URL = 'http://localhost:3000'

export const getTeamWithStats = async (teamId: number) => {
    try {
      const [team, stats] = await Promise.all([
        axios.get(`${API_URL}/teams/${teamId}`),
        axios.get(`${API_URL}/teamStats?teamId=${teamId}`)
      ]);
      
      return {
        ...team.data,
        stats: stats.data[0]
      };
    } catch (error) {
      console.error('Error fetching team stats:', error);
      throw error;
    }
  };

  export const getTeamRoster = async (teamId: number, season: string) => {
    try {
      const roster = await axios.get(
        `${API_URL}/rosters?teamId=${teamId}&season=${season}`
      );
      return roster.data;
    } catch (error) {
      console.error('Error fetching team roster:', error);
      throw error;
    }
  };