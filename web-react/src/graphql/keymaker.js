import { gql } from '@apollo/client';

const GET_RECOMMENDED_PLAYERS = gql`
  query GetRecommendedPlayers($email: String) {
    recommendations(
      engineID: "nba-recommended-players-2"
      params: { email: $email }
      first: 8
    ) {
      item
      score
      details
    }
  }
`;

const GET_RECOMMENDED_TEAMS = gql`
  query GetRecommendedTeams($email: String) {
    recommendations(
      engineID: "nba-recommended-teams"
      params: { email: $email }
      first: 8
    ) {
      item
      score
      details
    }
  }
`;

const GET_SIMILAR_FANS = gql`
  query GetSimilarFans($email: String) {
    recommendations(
      engineID: "nba-similar-fans"
      params: { email: $email }
      first: 10
    ) {
      item
      score
      details
    }
  }
`;

const GET_CURRENT_FAN = gql`
  query GetCurrentFan($email: String) {
    recommendations(engineID: "the-selected-fan", params: { email: $email }) {
      item
      score
      details
    }
  }
`;

const GET_CURRENT_TEAM = gql`
  query GetCurrentTeam($teamName: String) {
    recommendations(
      engineID: "the-seleted-team"
      params: { teamName: $teamName }
    ) {
      item
      score
      details
    }
  }
`;

const GET_TEAM_ROSTER = gql`
  query GetTeamRoster($teamName: String) {
    recommendations(
      engineID: "team-current-players"
      params: { teamName: $teamName }
    ) {
      item
      score
      details
    }
  }
`;

const GET_CURRENT_PLAYER = gql`
  query GetCurrentPlayer($playerName: String) {
    recommendations(
      engineID: "the-selected-player"
      params: { playerName: $playerName }
    ) {
      item
      score
      details
    }
  }
`;

const MOST_POPULAR_TEAMS = gql`
  query MostPopularTeams {
    recommendations(engineID: "most-popular-teams", first: 35) {
      item
      score
      details
    }
  }
`;

const MOST_POPULAR_PLAYERS = gql`
  query MostPopularPlayers {
    recommendations(engineID: "most-popular-players", first: 35) {
      item
      score
      details
    }
  }
`;

const MOST_ACTIVE_FANS = gql`
  query MostPopularPlayers {
    recommendations(engineID: "most-active-fans", first: 30) {
      item
      score
      details
    }
  }
`;

const GET_MOST_IMPORTANT_FANS_FOR_TEAM = gql`
  query GetMostImportantFansForTeam($teamName: String) {
    recommendations(
      engineID: "most-important-fans-team"
      params: { teamName: $teamName }
      first: 20
    ) {
      item
      score
      details
    }
  }
`;

export {
  GET_RECOMMENDED_PLAYERS,
  GET_RECOMMENDED_TEAMS,
  GET_SIMILAR_FANS,
  GET_CURRENT_FAN,
  GET_CURRENT_TEAM,
  GET_TEAM_ROSTER,
  GET_CURRENT_PLAYER,
  MOST_POPULAR_TEAMS,
  MOST_POPULAR_PLAYERS,
  MOST_ACTIVE_FANS,
  GET_MOST_IMPORTANT_FANS_FOR_TEAM,
};
