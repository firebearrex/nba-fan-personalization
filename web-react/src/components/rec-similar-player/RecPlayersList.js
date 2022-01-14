import React from 'react';
import { useQuery } from '@apollo/client';

import {
  Avatar,
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
import { makeStyles } from '@material-ui/core/styles';
import { Link, useParams } from 'react-router-dom';

import { GET_RECOMMENDED_PLAYERS } from '../../graphql/keymaker';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import { brown, lime, orange } from '@mui/material/colors';

const useStyles = makeStyles(() => {
  return {
    linkText: {
      // color: 'white',
      textDecoration: 'none',
      // width: '320px',
      // flexGrow: 1,
    },
  };
});

/**
 * The recommendation influence factors
 */
const REL_WITH_SIMILAR_FANS = 'Relationship with similar fans';
const AGE_SIMILARITY_WITH_SIMILAR_FANS = 'Age similarity with similar fans';
const TEAM_RANK = 'Team rank';

/**
 * Calculate the mean value of Boost Phase 1 - Boost on Number of Relationships with Similar Fans.
 *
 * @param data the Keymaker recommendation data.
 */
const getMeanBoostOnRels = (data) => {
  let totalBoostOnRels = 0;
  data.recommendations.forEach((rec) => {
    totalBoostOnRels += rec.details.boostOnRels;
  });
  return totalBoostOnRels / data.recommendations.length;
};

/**
 * Calculate the mean value of Boost Phase 2 - Negatively Boost on Age Difference.
 *
 * @param data the Keymaker recommendation data.
 */
const getMeanBoostOnAgeDiff = (data) => {
  let totalAgeDiff = 0;
  data.recommendations.forEach((rec) => {
    totalAgeDiff += rec.details.boostOnAgeDiff;
  });
  // return Math.abs(totalAgeDiff / data.recommendations.length);
  return totalAgeDiff / data.recommendations.length;
};

/**
 * Calculate the mean value of Boost Phase 3 - Negatively Boost on Rank.
 *
 * @param data the Keymaker recommendation data.
 */
const getMeanBoostOnRank = (data) => {
  let totalRank = 0;
  data.recommendations.forEach((rec) => {
    totalRank += rec.details.boostOnRank;
  });
  // return Math.abs(totalRank / data.recommendations.length);
  return totalRank / data.recommendations.length;
};

/**
 * Calculate the impact score of boostOnRels score.
 *
 * @param recTeam an recommendation object containing three fields: item, score and details
 * @param meanBoostOnRels the pre-computed mean value of boostOnRels score
 * @returns {number} the impact factor
 */
const getBoostOnRelsImpact = (recTeam, meanBoostOnRels) => {
  const boostOnRelsScore = recTeam.details.boostOnRels
    ? recTeam.details.boostOnRels
    : 0;
  // return Math.abs(boostOnRelsScore - meanBoostOnRels) / meanBoostOnRels;
  return boostOnRelsScore - meanBoostOnRels;
};

/**
 * Calculate the impact score of boostOnAgeDiff score.
 *
 * @param recTeam an recommendation object containing three fields: item, score and details.
 * @param meanBoostOnAgeDiff the pre-computed mean value of boostOnAgeDiff score.
 * @returns {number} the impact factor.
 */
const getBoostOnAgeDiffImpact = (recTeam, meanBoostOnAgeDiff) => {
  const boostOnAgeDiffScore = recTeam.details.boostOnAgeDiff
    ? recTeam.details.boostOnAgeDiff
    : 0;
  // return (
  //   Math.abs(Math.abs(boostOnAgeDiffScore) - meanBoostOnAgeDiff) /
  //   meanBoostOnAgeDiff
  // );
  return boostOnAgeDiffScore - meanBoostOnAgeDiff;
};

/**
 * Calculate the impact score of boostOnRank score.
 *
 * @param recTeam an recommendation object containing three fields: item, score and details
 * @param meanBoostOnRank the pre-computed mean value of boostOnRank score
 * @returns {number} the impact factor
 */
const getBoostOnRankImpact = (recTeam, meanBoostOnRank) => {
  const boostOnRankImpactScore = recTeam.details.boostOnRank
    ? recTeam.details.boostOnRank
    : 0;
  // return (
  //   Math.abs(Math.abs(boostOnRankImpactScore) - meanBoostOnRank) /
  //   meanBoostOnRank
  // );
  return boostOnRankImpactScore - meanBoostOnRank;
};

/**
 * Sort the impact factor's list.
 *
 * @param recPlayer the recommended team.
 * @param meanBoostOnRels the pre-computed mean value of boostOnRels score.
 * @param meanBoostOnAgeDiff the pre-computed mean value of boostOnAgeDiff score.
 * @param meanBoostOnRank the pre-computed mean value of boostOnRank score.
 * @returns {[{impactName: string, impactScore: number}]} the sorted impact list
 */
const getImpactRanking = (
  recPlayer,
  meanBoostOnRels,
  meanBoostOnAgeDiff,
  meanBoostOnRank
) => {
  const boostOnRelsImpact = getBoostOnRelsImpact(recPlayer, meanBoostOnRels);
  console.log(
    `boostOnRelsImpact of ${recPlayer.item.name} for RecPlayerList: `,
    boostOnRelsImpact
  );

  const boostOnAgeDiffImpact = getBoostOnAgeDiffImpact(
    recPlayer,
    meanBoostOnAgeDiff
  );
  console.log(
    `boostOnAgeDiffImpact of ${recPlayer.item.name} for RecPlayerList: `,
    boostOnAgeDiffImpact
  );

  const boostOnRankImpact = getBoostOnRankImpact(recPlayer, meanBoostOnRank);
  console.log(
    `boostOnRankImpact of ${recPlayer.item.name} for RecPlayerList: `,
    boostOnRankImpact
  );

  const impactRanking = [
    {
      impactScore: boostOnRelsImpact,
      impactName: REL_WITH_SIMILAR_FANS,
    },
    {
      impactScore: boostOnAgeDiffImpact,
      impactName: AGE_SIMILARITY_WITH_SIMILAR_FANS,
    },
    {
      impactScore: boostOnRankImpact,
      impactName: TEAM_RANK,
    },
  ];

  return impactRanking.sort((a, b) => b.impactScore - a.impactScore);
};

/**
 * The React component.
 */
const RecPlayersList = () => {
  const classes = useStyles();
  // const { userEmail } = props;
  const { fanEmail } = useParams();

  const { loading, error, data } = useQuery(GET_RECOMMENDED_PLAYERS, {
    // fetchPolicy: 'no-cache',
    variables: { email: fanEmail },
  });

  const getCategoryColor = (influenceFactor) => {
    switch (influenceFactor) {
      case TEAM_RANK:
        return lime[700];
      case AGE_SIMILARITY_WITH_SIMILAR_FANS:
        return orange['A400'];
      case REL_WITH_SIMILAR_FANS:
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
  const meanBoostOnRels = getMeanBoostOnRels(data);
  console.log('meanBoostOnRels:', meanBoostOnRels);
  const meanBoostOnAgeDiff = getMeanBoostOnAgeDiff(data);
  console.log('meanBoostOnAgeDiff:', meanBoostOnAgeDiff);
  const meanBoostOnRank = getMeanBoostOnRank(data);
  console.log('meanBoostOnRank:', meanBoostOnRank);

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
      <Typography variant={'h4'}>Recommended Players</Typography>
      <Typography
        variant={'body2'}
        gutterBottom
        sx={{ color: (theme) => theme.palette.text.secondary }}
      >
        {`Note: The recommendation is made based on factors including 
        "Liked by Similar Fans", "Common City" as well as "Excluding 
        Already Followed Players".`}
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
        {data.recommendations.map((player) => {
          const playerName = player.item.name.toLowerCase();
          const playsFor = player.details.playsFor;
          const impactRanking = getImpactRanking(
            player,
            meanBoostOnRels,
            meanBoostOnAgeDiff,
            meanBoostOnRank
          );
          // console.log('impactRanking:', impactRanking);

          return (
            <Link
              to={`/players/${playerName}`}
              key={playerName}
              className={classes.linkText}
            >
              <ListItem sx={{ px: 0, py: 0 }}>
                <ListItemButton divider={true}>
                  <Grid container spacing={2} alignItems={'center'}>
                    <Grid
                      item
                      xs={4.5}
                      alignItems={'center'}
                      justifyContent={'flex-start'}
                      sx={{ display: 'flex' }}
                    >
                      <ListItemText
                        primary={
                          <>
                            <span>
                              {`${playerName
                                .split(' ')
                                .slice(0, -1)
                                .join(' ')} `}
                            </span>
                            <span style={{ fontWeight: 'bold' }}>
                              {`${playerName.split(' ').slice(-1)[0]}`}
                            </span>
                          </>
                        }
                        primaryTypographyProps={{
                          color: (theme) => theme.palette.text.primary,
                        }}
                        secondary={
                          <Box display={'flex'} alignItems={'center'}>
                            <Avatar
                              variant={'square'}
                              alt={`${playsFor.fullName} Logo`}
                              src={playsFor.teamLogo}
                              sx={{ width: 24, height: 24 }}
                            />
                            <span>{`${playsFor.fullName}`}</span>
                          </Box>
                        }
                        secondaryTypographyProps={{
                          component: 'div',
                        }}
                        style={{ textTransform: 'capitalize' }}
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
                                }}
                              />
                            </Stack>
                          </Paper>
                        </Tooltip>
                        <Tooltip title={'Secondary factor'} followCursor={true}>
                          <Paper
                            elevation={0}
                            sx={{
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
                                    // color: blue[900],
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
                                }}
                              />
                            </Stack>
                          </Paper>
                        </Tooltip>
                        <Tooltip title={'Minor factor'} followCursor={true}>
                          <Paper
                            elevation={0}
                            sx={{
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
            </Link>
          );
        })}
      </List>
    </Paper>
  );
};

export default RecPlayersList;
