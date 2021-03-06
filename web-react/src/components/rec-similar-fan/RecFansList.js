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
import { useHistory, useParams } from 'react-router-dom';
import { brown, lime, orange } from '@mui/material/colors';

/**
 * The recommendation influence factors
 */
const AGE_SIMILARITY = 'Age similarity';
const PLAYER_INTEREST = 'Player interest';
const TEAM_INTEREST = 'Team interest';

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
  // return Math.abs(totalAgeDiff / data.recommendations.length);
  return totalAgeDiff / data.recommendations.length;
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
  // return Math.abs(boostOnCommonTeamScore - meanCommonTeams) / meanCommonTeams;
  return boostOnCommonTeamScore - meanCommonTeams;
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
  // return (
  //   Math.abs(boostOnCommonPlayerScore - meanCommonPlayers) / meanCommonPlayers
  // );
  return boostOnCommonPlayerScore - meanCommonPlayers;
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
  // return Math.abs(Math.abs(boostOnAgeDiffScore) - meanAgeDiff) / meanAgeDiff;
  return boostOnAgeDiffScore - meanAgeDiff;
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
    `commonTeamImpact of ${similarFan.item.displayName} for RecFansList: `,
    commonTeamImpact
  );

  const commonPlayersImpact = getCommonPlayersImpact(
    similarFan,
    meanCommonPlayers
  );
  console.log(
    `commonPlayersImpact of ${similarFan.item.displayName} for RecFansList: `,
    commonPlayersImpact
  );

  const commonAgeDiffImpact = getAgeDiffImpact(similarFan, meanAgeDiff);
  console.log(
    `commonAgeDiffImpact of ${similarFan.item.displayName} for RecFansList: `,
    commonAgeDiffImpact
  );

  const impactRanking = [
    {
      impactScore: commonTeamImpact,
      impactName: TEAM_INTEREST,
    },
    {
      impactScore: commonPlayersImpact,
      impactName: PLAYER_INTEREST,
    },
    {
      impactScore: commonAgeDiffImpact,
      impactName: AGE_SIMILARITY,
    },
  ];

  return impactRanking.sort((a, b) => b.impactScore - a.impactScore);
};

/**
 * The React component.
 */
const RecFansList = () => {
  const history = useHistory();
  const { fanEmail } = useParams();

  const { loading, error, data } = useQuery(GET_SIMILAR_FANS, {
    // fetchPolicy: 'no-cache',
    variables: { email: fanEmail },
  });

  const handleSimilarFanClick = (e) => {
    const simFanEmail = e.target.parentElement.id;
    console.log("Similar fan's email:", simFanEmail);
    history.push(`/fans/${simFanEmail}`);
  };

  const getCategoryColor = (influenceFactor) => {
    switch (influenceFactor) {
      case AGE_SIMILARITY:
        return lime[700];
      case PLAYER_INTEREST:
        return orange['A400'];
      case TEAM_INTEREST:
        return brown[400];
    }
  };

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
        <Typography variant={'h4'}>Recommended Teams</Typography>
        <Typography
          variant={'body2'}
          gutterBottom
          sx={{ color: (theme) => theme.palette.text.secondary }}
        >
          {`Note: The recommendation is made based on factors including 
        "Relationship with similar fans", "Age difference with similar fans" 
        as well as "Team's rank".`}
        </Typography>
        <Divider sx={{ mt: 1, mb: 1 }} />
        <Typography variant={'h5'}>Loading...</Typography>
      </Paper>
    );
  }

  if (error) {
    console.log('RecFanList error message:', error);
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
        <Typography variant={'h4'}>Recommended Teams</Typography>
        <Typography
          variant={'body2'}
          gutterBottom
          sx={{ color: (theme) => theme.palette.text.secondary }}
        >
          {`Note: The recommendation is made based on factors including 
        "Relationship with similar fans", "Age difference with similar fans" 
        as well as "Team's rank".`}
        </Typography>
        <Divider sx={{ mt: 1, mb: 1 }} />
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
        <Typography variant={'h4'}>Recommended Teams</Typography>
        <Typography
          variant={'body2'}
          gutterBottom
          sx={{ color: (theme) => theme.palette.text.secondary }}
        >
          {`Note: The recommendation is made based on factors including 
        "Relationship with similar fans", "Age difference with similar fans" 
        as well as "Team's rank".`}
        </Typography>
        <Divider sx={{ mt: 1, mb: 1 }} />
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
      <Divider sx={{ mt: 1, mb: 1 }} />

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
                <ListItemText
                  primary={'Name'}
                  primaryTypographyProps={{
                    fontWeight: 'bold',
                  }}
                />
              </Grid>
              <Divider orientation={'vertical'} variant={'middle'} flexItem />
              <Grid
                item
                xs
                justifyContent={'center'}
                alignItems={'center'}
                style={{ paddingTop: 8, paddingBottom: 8 }}
              >
                <ListItemText
                  primary={'Influence Rank'}
                  primaryTypographyProps={{
                    fontWeight: 'bold',
                  }}
                />
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
          // console.log('Similar fan rec impact ranking:', impactRanking);

          return (
            <ListItem key={fanEmail} sx={{ px: 0, py: 0 }}>
              <ListItemButton
                id={fanEmail}
                onClick={handleSimilarFanClick}
                divider={true}
              >
                <Grid container spacing={2} alignItems={'center'}>
                  <Grid
                    item
                    xs={4.5}
                    alignItems={'center'}
                    justifyContent={'flex-start'}
                    sx={{ display: 'flex' }}
                  >
                    <ListItemText
                      id={fanEmail}
                      primary={fanName}
                      secondary={`Score: ${similarFan.score}`}
                    />
                  </Grid>
                  <Grid item xs>
                    <Stack
                      justifyContent={'center'}
                      alignItems={'stretch'}
                      divider={
                        <Divider variant={'middle'} flexItem sx={{ my: 1 }} />
                      }
                    >
                      <Tooltip title={'Primary factor'} followCursor={true}>
                        <Paper
                          elevation={0}
                          sx={{
                            // bgcolor: 'rgb(253, 237, 237)',
                            // bgcolor: blue[800],
                            borderRadius: '4px',
                            pl: '8px',
                            py: '4px',
                          }}
                        >
                          <Stack
                            direction={'row'}
                            spacing={0}
                            sx={{
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                alignItems: 'center',
                                minWidth: 0,
                                width: 24,
                                height: 24,
                                zIndex: 1,
                              }}
                            >
                              <LooksOneIcon
                                sx={{
                                  color: 'background.paper',
                                  width: '100%',
                                  height: '100%',
                                }}
                              />
                            </ListItemIcon>
                            <Box
                              ml={'-19px'}
                              width={14}
                              height={14}
                              bgcolor={'text.primary'}
                            />
                            <ListItemIcon
                              sx={{
                                alignItems: 'center',
                                minWidth: 0,
                                width: 24,
                                height: 24,
                                zIndex: 1,
                              }}
                            >
                              <LooksOneIcon
                                sx={{
                                  color: getCategoryColor(
                                    impactRanking[0].impactName
                                  ),
                                  width: '100%',
                                  height: '100%',
                                }}
                              />
                            </ListItemIcon>
                            <Box
                              ml={'-19px'}
                              width={14}
                              height={14}
                              // bgcolor={'common.white'}
                              bgcolor={getCategoryColor(
                                impactRanking[0].impactName
                              )}
                            />
                            <ListItemText
                              compopnent={'div'}
                              sx={{
                                display: 'flex',
                                alignItems: 'stretch',
                                ml: 1.5,
                              }}
                              secondary={impactRanking[0].impactName}
                              secondaryTypographyProps={{
                                variant: 'body2',
                                color: 'text.primary',
                                // color: 'rgb(95, 33, 32)',
                                // color: 'common.white',
                                // color: getCategoryColor(
                                //   impactRanking[0].impactName
                                // ),
                              }}
                            />
                          </Stack>
                        </Paper>
                      </Tooltip>
                      <Tooltip title={'Secondary factor'} followCursor={true}>
                        <Paper
                          elevation={0}
                          sx={{
                            // bgcolor: 'rgb(255, 244, 229)',
                            // bgcolor: blue[600],
                            borderRadius: '4px',
                            pl: '8px',
                            py: '4px',
                          }}
                        >
                          <Stack
                            direction={'row'}
                            spacing={0}
                            sx={{
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                alignItems: 'center',
                                minWidth: 0,
                                width: 24,
                                height: 24,
                                zIndex: 1,
                              }}
                            >
                              <LooksTwoIcon
                                sx={{
                                  color: 'background.paper',
                                  width: '100%',
                                  height: '100%',
                                }}
                              />
                            </ListItemIcon>
                            <Box
                              ml={'-19px'}
                              width={14}
                              height={14}
                              bgcolor={'text.primary'}
                            />
                            <ListItemIcon
                              sx={{
                                alignItems: 'center',
                                minWidth: 0,
                                width: 24,
                                height: 24,
                                zIndex: 1,
                              }}
                            >
                              <LooksTwoIcon
                                sx={{
                                  color: getCategoryColor(
                                    impactRanking[1].impactName
                                  ),
                                  width: '100%',
                                  height: '100%',
                                }}
                              />
                            </ListItemIcon>
                            <Box
                              ml={'-19px'}
                              width={14}
                              height={14}
                              // bgcolor={'common.white'}
                              bgcolor={getCategoryColor(
                                impactRanking[1].impactName
                              )}
                            />
                            <ListItemText
                              sx={{
                                display: 'flex',
                                alignItems: 'stretch',
                                ml: 1.5,
                              }}
                              secondary={impactRanking[1].impactName}
                              secondaryTypographyProps={{
                                variant: 'body2',
                                color: 'text.primary',
                                // color: 'rgb(102, 60, 0)',
                                // color: 'common.white',
                                // color: getCategoryColor(
                                //   impactRanking[1].impactName
                                // ),
                              }}
                            />
                          </Stack>
                        </Paper>
                      </Tooltip>
                      <Tooltip title={'Minor factor'} followCursor={true}>
                        <Paper
                          elevation={0}
                          sx={{
                            // bgcolor: 'rgb(237, 247, 237)',
                            // bgcolor: blue[400],
                            borderRadius: '4px',
                            pl: '8px',
                            py: '4px',
                          }}
                        >
                          <Stack
                            direction={'row'}
                            spacing={0}
                            sx={{
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                alignItems: 'center',
                                minWidth: 0,
                                width: 24,
                                height: 24,
                                zIndex: 1,
                              }}
                            >
                              <Looks3Icon
                                sx={{
                                  color: 'background.paper',
                                  width: '100%',
                                  height: '100%',
                                }}
                              />
                            </ListItemIcon>
                            <Box
                              ml={'-19px'}
                              width={14}
                              height={14}
                              bgcolor={'text.primary'}
                            />
                            <ListItemIcon
                              sx={{
                                alignItems: 'center',
                                minWidth: 0,
                                width: 24,
                                height: 24,
                                zIndex: 1,
                              }}
                            >
                              <Looks3Icon
                                sx={{
                                  color: getCategoryColor(
                                    impactRanking[2].impactName
                                  ),
                                  width: '100%',
                                  height: '100%',
                                }}
                              />
                            </ListItemIcon>
                            <Box
                              ml={'-19px'}
                              width={14}
                              height={14}
                              // bgcolor={'common.white'}
                              bgcolor={getCategoryColor(
                                impactRanking[2].impactName
                              )}
                            />
                            <ListItemText
                              sx={{
                                display: 'flex',
                                alignItems: 'stretch',
                                ml: 1.5,
                              }}
                              secondary={impactRanking[2].impactName}
                              secondaryTypographyProps={{
                                variant: 'body2',
                                color: 'text.primary',
                                // color: 'rgb(30, 70, 32)',
                                // color: 'common.white',
                                // color: getCategoryColor(
                                //   impactRanking[2].impactName
                                // ),
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
