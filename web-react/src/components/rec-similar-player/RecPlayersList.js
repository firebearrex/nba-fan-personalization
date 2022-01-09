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
import { makeStyles } from '@material-ui/core/styles';
import { Link, useParams } from 'react-router-dom';

import { GET_RECOMMENDED_PLAYERS } from '../../graphql/keymaker';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';

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
  return Math.abs(totalAgeDiff / data.recommendations.length);
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
  return Math.abs(totalRank / data.recommendations.length);
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
  return Math.abs(boostOnRelsScore - meanBoostOnRels) / meanBoostOnRels;
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
  return (
    Math.abs(Math.abs(boostOnAgeDiffScore) - meanBoostOnAgeDiff) /
    meanBoostOnAgeDiff
  );
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
  return (
    Math.abs(Math.abs(boostOnRankImpactScore) - meanBoostOnRank) /
    meanBoostOnRank
  );
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
  console.log(`boostOnRelsImpact of ${recTeam.item.name}: `, boostOnRelsImpact);

  const boostOnAgeDiffImpact = getBoostOnAgeDiffImpact(
    recTeam,
    meanBoostOnAgeDiff
  );
  console.log(
    `boostOnAgeDiffImpact of ${recTeam.item.name}: `,
    boostOnAgeDiffImpact
  );

  const boostOnRankImpact = getBoostOnRankImpact(recTeam, meanBoostOnRank);
  console.log(`boostOnRankImpact of ${recTeam.item.name}: `, boostOnRankImpact);

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
const RecPlayersList = () => {
  const classes = useStyles();
  // const { userEmail } = props;
  const { fanEmail } = useParams();

  const { loading, error, data } = useQuery(GET_RECOMMENDED_PLAYERS, {
    // fetchPolicy: 'no-cache',
    variables: { email: fanEmail },
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
        {data.recommendations.map((player) => {
          const playerName = player.item.name.toLowerCase();
          const impactRanking = getImpactRanking(
            player,
            meanBoostOnRels,
            meanBoostOnAgeDiff,
            meanBoostOnRank
          );
          console.log('impactRanking:', impactRanking);

          return (
            <Link
              to={`/players/${playerName}`}
              key={playerName}
              className={classes.linkText}
            >
              <ListItem sx={{ px: 0, py: 0 }}>
                <ListItemButton divider={true}>
                  <Grid container spacing={2} alignItems={'center'}>
                    <Grid item xs={4.5}>
                      <ListItemText
                        primary={playerName}
                        primaryTypographyProps={{
                          color: (theme) => theme.palette.text.primary,
                        }}
                        style={{ textTransform: 'capitalize' }}
                      />
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
                  {/*<ListItemText*/}
                  {/*  primary={player.item.name}*/}
                  {/*  secondary={*/}
                  {/*    <>*/}
                  {/*      <span>- Plays for team: {playsFor}</span>*/}
                  {/*      <br />*/}
                  {/*      <span>- Plays in City: {playsInCity}</span>*/}
                  {/*    </>*/}
                  {/*  }*/}
                  {/*  primaryTypographyProps={{*/}
                  {/*    color: (theme) => theme.palette.text.primary,*/}
                  {/*  }}*/}
                  {/*  secondaryTypographyProps={{ pl: 1 }}*/}
                  {/*/>*/}
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
