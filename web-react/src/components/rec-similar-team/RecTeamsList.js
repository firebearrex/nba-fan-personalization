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
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import { GET_RECOMMENDED_TEAMS } from '../../graphql/keymaker';
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
  return Math.abs(totalAgeDiff / data.recommendations.length);
};

/**
 * Calculate the mean value of Boost Phase 3 - Negatively Boost on Rank.
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
 * @param recTeam an recommendation object containing three fields: item, score and details
 * @param meanBoostOnAgeDiff the pre-computed mean value of boostOnAgeDiff score
 * @returns {number} the impact factor
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
const RecTeamsList = (props) => {
  const classes = useStyles();
  const { userEmail } = props;
  const { loading, error, data } = useQuery(GET_RECOMMENDED_TEAMS, {
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
        {data.recommendations.map((team) => {
          const teamName = team.item.name;

          const impactRanking = getImpactRanking(
            team,
            meanBoostOnRels,
            meanBoostOnAgeDiff,
            meanBoostOnRank
          );
          console.log('impactRanking:', impactRanking);

          return (
            <Link
              to={`/teams/${teamName}`}
              key={teamName}
              className={classes.linkText}
            >
              <ListItem>
                <ListItemButton divider={true}>
                  <Grid container spacing={2} alignItems={'center'}>
                    <Grid item xs={4.5}>
                      <ListItemText
                        primary={teamName}
                        // secondary={
                        //   <>
                        //     <span>- Team City: {team.details.teamCity}</span>
                        //   </>
                        // }
                        primaryTypographyProps={{
                          color: (theme) => theme.palette.text.primary,
                        }}
                        // secondaryTypographyProps={{ pl: 1 }}
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
