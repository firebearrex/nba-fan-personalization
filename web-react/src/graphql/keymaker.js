import { gql } from '@apollo/client';

const GET_RECOMMENDED_PLAYERS = gql`
  query GetRecommendedPlayers($email: String) {
    recommendations(
      engineID: "nba-recommended-players"
      params: { email: $email }
      first: 25
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
      first: 25
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
      first: 25
    ) {
      item
      score
      details
    }
  }
`;

// const MOST_POPULAR_TEAMS = gql`
//   query GetSimilarFans() {
//     recommendations(
//       engineID: "most-popular-players"
//       params: { }
//       first: 25
//     ) {
//       item
//       score
//       details
//     }
//   }
// `;
//
// const MOST_POPULAR_PLAYERS = gql`
//   query GetSimilarFans() {
//     recommendations(
//       engineID: "most-popular-teams"
//       params: { }
//       first: 25
//     ) {
//       item
//       score
//       details
//     }
//   }
// `;

export {
  GET_RECOMMENDED_PLAYERS,
  GET_RECOMMENDED_TEAMS,
  GET_SIMILAR_FANS,
  // MOST_POPULAR_TEAMS,
  // MOST_POPULAR_PLAYERS,
};
