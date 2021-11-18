import { gql } from '@apollo/client';

const GET_RECOMMENDED_PLAYERS = gql`
  query GetRecommendedPlayers($email: String) {
    recommendations(
      engineID: "nba-recommended-players-2"
      params: { email: $email }
      first: 5
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
      first: 5
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

const MOST_POPULAR_TEAMS = gql`
  query MostPopularTeams {
    recommendations(engineID: "most-popular-teams", first: 10) {
      item
      score
      details
    }
  }
`;

const MOST_POPULAR_PLAYERS = gql`
  query MostPopularPlayers {
    recommendations(engineID: "most-popular-players", first: 10) {
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

export {
  GET_RECOMMENDED_PLAYERS,
  GET_RECOMMENDED_TEAMS,
  GET_SIMILAR_FANS,
  GET_CURRENT_FAN,
  MOST_POPULAR_TEAMS,
  MOST_POPULAR_PLAYERS,
  MOST_ACTIVE_FANS,
};
