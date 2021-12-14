import React from 'react';
import { useQuery } from '@apollo/client';

import {
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';

import { GET_SIMILAR_FANS } from '../../graphql/keymaker';

/**
 * Calculate the mean value of Boost Phase 1 - Boost on Common Team Interest.
 */
const getMeanCommonTeams = (data) => {
  let totalCommonTeams = 0;
  data.recommendations.forEach((rec) => {
    totalCommonTeams += rec.details.boostOnCommonTeamScore;
  });
  return totalCommonTeams / data.recommendations.length;
};

/**
 * Calculate the mean value of Boost Phase 2 - Boost on Common Player Interest.
 */
const getMeanCommonPlayers = (data) => {
  let totalCommonPlayers = 0;
  data.recommendations.forEach((rec) => {
    totalCommonPlayers += rec.details.boostOnCommonPlayerScore;
  });
  return totalCommonPlayers / data.recommendations.length;
};

/**
 * Calculate the mean value of Boost Phase 3 - Negatively Boost on Age Difference.
 */
const getMeanAgeDiff = (data) => {
  let totalAgeDiff = 0;
  data.recommendations.forEach((rec) => {
    totalAgeDiff += rec.details.boostOnAgeDiffScore;
  });
  return Math.abs(totalAgeDiff / data.recommendations.length);
};

/**
 * Calculate the impact score of the Common Teams score.
 *
 * @param similarFan an recommendation object containing three fields: item, score and details.
 * @param meanCommonTeams the pre-computed mean score of Common Teams.
 * @returns {number} the impact factor.
 */
const getCommonTeamsImpact = (similarFan, meanCommonTeams) => {
  const boostOnCommonTeamScore = similarFan.details.boostOnCommonTeamScore
    ? similarFan.details.boostOnCommonTeamScore
    : 0;
  return Math.abs(boostOnCommonTeamScore - meanCommonTeams) / meanCommonTeams;
};

/**
 * Calculate the impact score of the Common Players score.
 *
 * @param similarFan an recommendation object containing three fields: item, score and details.
 * @param meanCommonPlayers the pre-computed mean score of Common Players.
 * @returns {number} the impact factor.
 */
const getCommonPlayersImpact = (similarFan, meanCommonPlayers) => {
  const boostOnCommonPlayerScore = similarFan.details.boostOnCommonPlayerScore
    ? similarFan.details.boostOnCommonPlayerScore
    : 0;
  return (
    Math.abs(boostOnCommonPlayerScore - meanCommonPlayers) / meanCommonPlayers
  );
};

/**
 * Calculate the impact score of the Age Difference score.
 *
 * @param similarFan an recommendation object containing three fields: item, score and details.
 * @param meanAgeDiff the pre-computed mean score of Age Diff.
 * @returns {number} the impact factor.
 */
const getAgeDiffImpact = (similarFan, meanAgeDiff) => {
  const boostOnAgeDiffScore = similarFan.details.boostOnAgeDiffScore
    ? similarFan.details.boostOnAgeDiffScore
    : 0;
  return Math.abs(Math.abs(boostOnAgeDiffScore) - meanAgeDiff) / meanAgeDiff;
};

/**
 * Sort the impact factors based on their impact score
 *
 * @param similarFan an recommendation object containing three fields: item, score and details.
 * @param meanCommonTeams the pre-computed mean score of Common Teams.
 * @param meanCommonPlayers the pre-computed mean score of Common Players.
 * @param meanAgeDiff the pre-computed mean score of Age Diff.
 * @returns {object} the sorted impactRanking object based on each impact factor's impact score.
 */
const getImpactRanking = (
  similarFan,
  meanCommonTeams,
  meanCommonPlayers,
  meanAgeDiff
) => {
  const commonTeamImpact = getCommonTeamsImpact(similarFan, meanCommonTeams);
  console.log(
    `commonTeamImpact of ${similarFan.item.displayName}: `,
    commonTeamImpact
  );

  const commonPlayersImpact = getCommonPlayersImpact(
    similarFan,
    meanCommonPlayers
  );
  console.log(
    `commonPlayersImpact of ${similarFan.item.displayName}: `,
    commonPlayersImpact
  );

  const commonAgeDiffImpact = getAgeDiffImpact(similarFan, meanAgeDiff);
  console.log(
    `commonAgeDiffImpact of ${similarFan.item.displayName}: `,
    commonAgeDiffImpact
  );

  const impactRanking = [
    {
      impactScore: commonTeamImpact,
      impactName: 'Team interest',
    },
    {
      impactScore: commonPlayersImpact,
      impactName: 'Player interest',
    },
    {
      impactScore: commonAgeDiffImpact,
      impactName: 'Age difference',
    },
  ];

  return impactRanking.sort((a, b) => b.impactScore - a.impactScore);
};

/**
 * The React component.
 */
const RecFansList = (props) => {
  const { userEmail, handleSimilarFanClick } = props;

  const { loading, error, data } = useQuery(GET_SIMILAR_FANS, {
    // fetchPolicy: 'no-cache',
    variables: { email: userEmail },
  });

  if (loading) {
    return (
      <Paper
        elevation={2}
        sx={{
          flexGrow: 1,
          mb: 2,
          px: 4,
          py: 4,
        }}
      >
        <Typography variant={'h5'}>Loading...</Typography>
      </Paper>
    );
  }

  if (error) {
    console.log(error);
    return (
      <Paper
        elevation={2}
        sx={{
          flexGrow: 1,
          mb: 2,
          px: 4,
          py: 4,
        }}
      >
        <Typography variant={'h5'}>Oops, something went wrong...</Typography>
      </Paper>
    );
  }

  if (data.recommendations.length === 0) {
    return (
      <Paper
        elevation={2}
        sx={{
          flexGrow: 1,
          mb: 2,
          px: 4,
          py: 4,
        }}
      >
        <Typography variant={'h5'}>
          No relevant results have been found...
        </Typography>
      </Paper>
    );
  }

  /**
   * Get the mean values for further calculating the impact factors.
   */
  const meanCommonTeams = getMeanCommonTeams(data);
  console.log('meanCommonTeams:', meanCommonTeams);
  const meanCommonPlayers = getMeanCommonPlayers(data);
  console.log('meanCommonPlayers:', meanCommonPlayers);
  const meanAgeDiff = getMeanAgeDiff(data);
  console.log('meanAgeDiff:', meanAgeDiff);

  return (
    <Paper
      elevation={2}
      sx={{
        flexGrow: 1,
        mb: 2,
        px: 4,
        py: 4,
      }}
    >
      <Typography variant={'h4'}>Recommended Similar Fans</Typography>
      <Typography
        variant={'body2'}
        gutterBottom
        sx={{ color: (theme) => theme.palette.text.secondary }}
      >
        {`Note: The recommendation is made based on factors including "Common
            Zipcode", "Common Team Interest", "Common Player Interest", "Common
            Categorizations" as well as "Age Difference".`}
      </Typography>

      {/* Section 1: Recommendation Rank */}
      <Typography variant={'h5'} sx={{ mt: 3, mb: 1 }}>
        Recommendation Rank:
      </Typography>
      <List>
        <ListItem sx={{ px: 0, py: 0 }} divider={true}>
          <Box sx={{ py: 1, px: 2, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid
                item
                xs={5}
                justifyContent={'center'}
                alignItems={'center'}
                style={{ paddingTop: 8, paddingBottom: 8 }}
              >
                <ListItemText primary={'Name'} />
              </Grid>
              <Divider orientation={'vertical'} variant={'middle'} flexItem />
              <Grid
                item
                xs
                justifyContent={'center'}
                alignItems={'center'}
                style={{ paddingTop: 8, paddingBottom: 8 }}
              >
                <ListItemText primary={'Impact factors'} />
              </Grid>
            </Grid>
          </Box>
        </ListItem>
        {data.recommendations.map((similarFan) => {
          const fanEmail = similarFan.item.email;
          const fanName = similarFan.item.displayName;
          const impactRanking = getImpactRanking(
            similarFan,
            meanCommonTeams,
            meanCommonPlayers,
            meanAgeDiff
          );
          console.log(impactRanking);

          return (
            <ListItem key={fanEmail} sx={{ px: 0, py: 0 }}>
              <ListItemButton
                id={fanEmail}
                onClick={handleSimilarFanClick}
                // onClick={(event) => console.log(event.target.parentElement.id)}
                divider={true}
              >
                <Grid container spacing={2} alignItems={'center'}>
                  <Grid
                    item
                    xs={4.5}
                    // sx={{ display: 'flex', alignItems: 'stretch' }}
                  >
                    <ListItemText id={fanEmail} primary={fanName} />
                  </Grid>
                  <Grid item xs={7.5}>
                    <Stack
                      justifyContent={'center'}
                      alignItems={'stretch'}
                      divider={
                        <Divider variant={'middle'} flexItem sx={{ my: 1 }} />
                      }
                    >
                      <Tooltip title={'Primary impact'} followCursor={true}>
                        <Paper
                          elevation={0}
                          sx={{
                            bgcolor: 'rgb(253, 237, 237)',
                            borderRadius: '4px',
                            px: '16px',
                            py: '4px',
                          }}
                        >
                          <Stack
                            direction={'row'}
                            spacing={0}
                            sx={{
                              justifyContent: 'flex-start',
                              alignItems: 'stretch',
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                alignItems: 'center',
                                minWidth: 0,
                                width: 36,
                              }}
                            >
                              <LooksOneIcon sx={{ color: 'red' }} />
                            </ListItemIcon>
                            <ListItemText
                              compopnent={'div'}
                              sx={{
                                display: 'flex',
                                alignItems: 'stretch',
                              }}
                              secondary={impactRanking[0].impactName}
                              secondaryTypographyProps={{
                                // textAlign: 'center',
                                variant: 'body2',
                                color: 'rgb(95, 33, 32)',
                              }}
                            />
                          </Stack>
                        </Paper>
                      </Tooltip>
                      <Tooltip title={'Secondary impact'} followCursor={true}>
                        <Paper
                          elevation={0}
                          sx={{
                            bgcolor: 'rgb(255, 244, 229)',
                            borderRadius: '4px',
                            px: '16px',
                            py: '4px',
                          }}
                        >
                          <Stack
                            direction={'row'}
                            spacing={0}
                            sx={{
                              justifyContent: 'flex-start',
                              alignItems: 'stretch',
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                alignItems: 'center',
                                minWidth: 0,
                                width: 36,
                              }}
                            >
                              <LooksTwoIcon sx={{ color: 'orange' }} />
                            </ListItemIcon>
                            <ListItemText
                              sx={{
                                display: 'flex',
                                alignItems: 'stretch',
                              }}
                              secondary={impactRanking[1].impactName}
                              secondaryTypographyProps={{
                                variant: 'body2',
                                color: 'rgb(102, 60, 0)',
                              }}
                            />
                          </Stack>
                        </Paper>
                      </Tooltip>
                      <Tooltip title={'Least impact'} followCursor={true}>
                        <Paper
                          elevation={0}
                          sx={{
                            bgcolor: 'rgb(237, 247, 237)',
                            borderRadius: '4px',
                            px: '16px',
                            py: '4px',
                          }}
                        >
                          <Stack
                            direction={'row'}
                            spacing={0}
                            sx={{
                              justifyContent: 'flex-start',
                              alignItems: 'stretch',
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                alignItems: 'center',
                                minWidth: 0,
                                width: 36,
                              }}
                            >
                              <Looks3Icon sx={{ color: 'green' }} />
                            </ListItemIcon>
                            <ListItemText
                              sx={{
                                display: 'flex',
                                alignItems: 'stretch',
                              }}
                              secondary={impactRanking[2].impactName}
                              secondaryTypographyProps={{
                                variant: 'body2',
                                color: 'rgb(30, 70, 32)',
                              }}
                            />
                          </Stack>
                        </Paper>
                      </Tooltip>
                    </Stack>
                  </Grid>
                </Grid>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};

export default RecFansList;
