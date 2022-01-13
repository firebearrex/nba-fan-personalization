import React from 'react';
import { useQuery } from '@apollo/client';

import {
  Avatar,
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import { GET_RECOMMENDED_TEAMS } from '../../graphql/keymaker';
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
 * Calculate the mean value of Boost Phase 1 - Boost on Number of Relationships with Similar Fans.
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
 * @param recTeam an recommendation object containing three fields: item, score and details
 * @param meanBoostOnAgeDiff the pre-computed mean value of boostOnAgeDiff score
 * @returns {number} the impact factor
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
 * @param recTeam the recommended team.
 * @param meanBoostOnRels the pre-computed mean value of boostOnRels score.
 * @param meanBoostOnAgeDiff the pre-computed mean value of boostOnAgeDiff score.
 * @param meanBoostOnRank the pre-computed mean value of boostOnRank score.
 * @returns {[{impactName: string, impactScore: number}]} the sorted impact list
 */
const getImpactRanking = (
  recTeam,
  meanBoostOnRels,
  meanBoostOnAgeDiff,
  meanBoostOnRank
) => {
  const boostOnRelsImpact = getBoostOnRelsImpact(recTeam, meanBoostOnRels);
  console.log(
    `boostOnRelsImpact of ${recTeam.item.name} for RecTeamsList: `,
    boostOnRelsImpact
  );

  const boostOnAgeDiffImpact = getBoostOnAgeDiffImpact(
    recTeam,
    meanBoostOnAgeDiff
  );
  console.log(
    `boostOnAgeDiffImpact of ${recTeam.item.name} for RecTeamsList: `,
    boostOnAgeDiffImpact
  );

  const boostOnRankImpact = getBoostOnRankImpact(recTeam, meanBoostOnRank);
  console.log(
    `boostOnRankImpact of ${recTeam.item.name} for RecTeamsList: `,
    boostOnRankImpact
  );

  const impactRanking = [
    {
      impactScore: boostOnRelsImpact,
      impactName: 'Relationship with similar fans',
    },
    {
      impactScore: boostOnAgeDiffImpact,
      impactName: 'Age diff with similar fans',
    },
    {
      impactScore: boostOnRankImpact,
      impactName: 'Team rank',
    },
  ];

  return impactRanking.sort((a, b) => b.impactScore - a.impactScore);
};

/**
 * The React component.
 */
const RecTeamsList = () => {
  const classes = useStyles();
  // const { userEmail } = props;
  const { fanEmail } = useParams();

  const { loading, error, data } = useQuery(GET_RECOMMENDED_TEAMS, {
    // fetchPolicy: 'no-cache',
    variables: { email: fanEmail },
  });

  const getCategoryColor = (influenceFactor) => {
    switch (influenceFactor) {
      case 'Team rank':
        return lime[700];
      case 'Age diff with similar fans':
        return orange['A400'];
      case 'Relationship with similar fans':
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
  console.log('meanBoostOnRels - Team List:', meanBoostOnRels);
  const meanBoostOnAgeDiff = getMeanBoostOnAgeDiff(data);
  console.log('meanBoostOnAgeDiff - Team List:', meanBoostOnAgeDiff);
  const meanBoostOnRank = getMeanBoostOnRank(data);
  console.log('meanBoostOnRank - Team List:', meanBoostOnRank);

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

      {/* Recommendation Rank */}
      {/* <Typography variant={'h5'} sx={{ mt: 3, mb: 1 }}> */}
      {/*   Recommendation Rank: */}
      {/* </Typography> */}
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
        {data.recommendations.map((team) => {
          const teamName = team.item.fullName;
          const teamLogo = team.item.teamLogo;
          const impactRanking = getImpactRanking(
            team,
            meanBoostOnRels,
            meanBoostOnAgeDiff,
            meanBoostOnRank
          );
          // console.log('Team rec impact ranking:', impactRanking);

          return (
            <Link
              to={`/teams/${team.item.name}`}
              key={team.item.name}
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
                      <ListItemAvatar sx={{ minWidth: 32 }}>
                        <Avatar
                          variant={'square'}
                          alt={`${teamName} Logo`}
                          src={teamLogo}
                          sx={{ width: 32, height: 32 }}
                        />
                      </ListItemAvatar>
                      <Box ml={1} flexGrow={1} display={'block'}>
                        <ListItemText
                          primary={teamName.split(' ').slice(0, -1).join(' ')}
                          primaryTypographyProps={{
                            color: (theme) => theme.palette.text.primary,
                          }}
                        />
                        <ListItemText
                          primary={teamName.split(' ').slice(-1)}
                          primaryTypographyProps={{
                            color: (theme) => theme.palette.text.primary,
                            fontWeight: 'bold',
                          }}
                        />
                      </Box>
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
                                  // color: 'rgb(102, 60, 0)',
                                  // color: 'common.white',
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

export default RecTeamsList;
