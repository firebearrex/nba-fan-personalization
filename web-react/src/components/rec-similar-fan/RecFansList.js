import React from 'react';
import { useQuery } from '@apollo/client';

import {
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import LabelIcon from '@mui/icons-material/Label';

import { GET_SIMILAR_FANS } from '../../graphql/keymaker';
import recDashboardUtils from '../../utils/rec-dashboard-utils';

/**
 * Calculate the mean number of common teams of all recommendations.
 */
const getMeanCommonTeams = (data) => {
  let totalCommonTeams = 0;
  data.recommendations.forEach((rec) => {
    totalCommonTeams += rec.details.boostOnCommonTeamScore;
  });
  return totalCommonTeams / data.recommendations.length;
};

/**
 * Calculate the mean number of common players of all recommendations.
 */
const getMeanCommonPlayers = (data) => {
  let totalCommonPlayers = 0;
  data.recommendations.forEach((rec) => {
    totalCommonPlayers += rec.details.boostOnCommonPlayerScore;
  });
  return totalCommonPlayers / data.recommendations.length;
};

/**
 * Calculate the mean number of common players of all recommendations.
 */
const getMeanAgeDiff = (data) => {
  let totalAgeDiff = 0;
  data.recommendations.forEach((rec) => {
    totalAgeDiff += rec.details.boostOnAgeDiffScore;
  });
  return Math.abs(totalAgeDiff / data.recommendations.length);
};

/**
 * Calculate the impact factor of the Common Teams score.
 *
 * @param similarFan an recommendation object containing three fields: item, score and details
 * @param meanCommonTeams the pre-computed mean score of Common Teams.
 * @returns {number} the impact factor
 */
const getCommonTeamsImpact = (similarFan, meanCommonTeams) => {
  const boostOnCommonTeamScore = similarFan.details.boostOnCommonTeamScore
    ? similarFan.details.boostOnCommonTeamScore
    : 0;
  return Math.abs(boostOnCommonTeamScore - meanCommonTeams) / meanCommonTeams;
};

/**
 * Calculate the impact factor of the Common Players score.
 *
 * @param similarFan an recommendation object containing three fields: item, score and details
 * @param meanCommonPlayers the pre-computed mean score of Common Players.
 * @returns {number} the impact factor
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
 * Calculate the impact factor of the Age Difference score.
 *
 * @param similarFan an recommendation object containing three fields: item, score and details
 * @param meanAgeDiff the pre-computed mean score of Age Diff.
 * @returns {number} the impact factor
 */
const getAgeDiffImpact = (similarFan, meanAgeDiff) => {
  const boostOnAgeDiffScore = similarFan.details.boostOnAgeDiffScore
    ? similarFan.details.boostOnAgeDiffScore
    : 0;
  return Math.abs(Math.abs(boostOnAgeDiffScore) - meanAgeDiff) / meanAgeDiff;
};

const getImpactRanking = (
  // data,
  similarFan,
  meanCommonTeams,
  meanCommonPlayers,
  meanAgeDiff
) => {
  const commonTeamImpact = getCommonTeamsImpact(similarFan, meanCommonTeams);
  console.log(
    `commonTeamImpact: of ${similarFan.item.displayName}`,
    commonTeamImpact
  );

  const commonPlayersImpact = getCommonPlayersImpact(
    similarFan,
    meanCommonPlayers
  );
  console.log(
    `commonPlayersImpact: of ${similarFan.item.displayName}`,
    commonPlayersImpact
  );

  const commonAgeDiffImpact = getAgeDiffImpact(similarFan, meanAgeDiff);
  console.log(
    `commonAgeDiffImpact of ${similarFan.item.displayName}:`,
    commonAgeDiffImpact
  );

  const impactRanking = [
    {
      impactScore: commonTeamImpact,
      impactName: 'Common interest on teams',
    },
    {
      impactScore: commonPlayersImpact,
      impactName: 'Common interest on players',
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
          // display: 'block',
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
    return (
      <Paper
        elevation={2}
        sx={{
          // display: 'block',
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
          // display: 'block',
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
   * Get the mean values for further calculating the impact factor.
   */
  const meanCommonTeams = getMeanCommonTeams(data);
  console.log('meanCommonTeams:', meanCommonTeams);
  const meanCommonPlayers = getMeanCommonPlayers(data);
  console.log('meanCommonPlayers:', meanCommonPlayers);
  const meanAgeDiff = getMeanAgeDiff(data);
  console.log('meanAgeDiff:', meanAgeDiff);

  return (
    <>
      <Paper
        elevation={2}
        sx={{
          flexGrow: 1,
          mb: 2,
          px: 4,
          py: 4,
        }}
      >
        {/* The master title. */}
        <Typography variant={'h4'}>Recommended Similar Fans</Typography>
        <Typography
          variant={'body2'}
          gutterBottom
          sx={{ color: (theme) => theme.palette.text.secondary }}
        >
          {`Note: The similarity score is calculated based on factors including "Same
            Zipcode", "Common Team Interest", "Common Player Interest", "Common
            Categorizations"" as well as "Age Difference".`}
        </Typography>

        {/* Section 1: Recommendation Rank */}
        <Typography variant={'h5'} sx={{ mt: 3, mb: -1 }}>
          Recommendation Rank:
        </Typography>
        <List>
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
                      <ListItemText
                        id={fanEmail}
                        primary={fanName}
                        // secondary={
                        //   <>
                        //     <span>- Email: {fanEmail}</span>
                        //   </>
                        // }
                        // secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </Grid>
                    <Grid item xs={7.5}>
                      <Stack
                        justifyContent={'center'}
                        alignItems={'flex-start'}
                        divider={
                          <Divider
                            variant={'middle'}
                            flexItem
                            sx={{ my: 0.5 }}
                          />
                        }
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
                              width: 28,
                            }}
                          >
                            <LabelIcon sx={{ color: 'red' }} />
                          </ListItemIcon>
                          <ListItemText
                            compopnent={'div'}
                            sx={{
                              display: 'flex',
                              alignItems: 'stretch',
                              verticalAlign: 'middle',
                            }}
                            secondary={
                              'Primary impact: ' + impactRanking[0].impactName
                            }
                            secondaryTypographyProps={{
                              // textAlign: 'center',
                              variant: 'body2',
                            }}
                          />
                        </Stack>
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
                              width: 28,
                            }}
                          >
                            <LabelIcon sx={{ color: 'orange' }} />
                          </ListItemIcon>
                          <ListItemText
                            sx={{
                              display: 'flex',
                              alignItems: 'stretch',
                              verticalAlign: 'middle',
                            }}
                            secondary={
                              'Secondary impact: ' + impactRanking[1].impactName
                            }
                            secondaryTypographyProps={{
                              variant: 'body2',
                            }}
                          />
                        </Stack>
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
                              width: 28,
                            }}
                          >
                            <LabelIcon sx={{ color: 'green' }} />
                          </ListItemIcon>
                          <ListItemText
                            sx={{
                              display: 'flex',
                              alignItems: 'stretch',
                              verticalAlign: 'middle',
                            }}
                            secondary={
                              'Least impact: ' + impactRanking[2].impactName
                            }
                            secondaryTypographyProps={{
                              variant: 'body2',
                            }}
                          />
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* Section 2: Recommendation Analysis */}
        <Typography variant={'h5'} sx={{ mt: 2 }}>
          Additional Information:
        </Typography>
        <List>
          {/*<ListItem sx={{ mt: 1, pb: 0 }}>*/}
          {/*  <ListItemText*/}
          {/*    primary={'- Recommendation score breakdown'}*/}
          {/*    primaryTypographyProps={{*/}
          {/*      variant: 'subtitle1',*/}
          {/*      sx: {*/}
          {/*        fontSize: '1.1rem',*/}
          {/*      },*/}
          {/*    }}*/}
          {/*  />*/}
          {/*</ListItem>*/}
          {/*{data.recommendations.map((similarFan) => {*/}
          {/*  const initialScore = similarFan.details.initialScore;*/}
          {/*  const boostOnCommonTeamScore = similarFan.details*/}
          {/*    .boostOnCommonTeamScore*/}
          {/*    ? similarFan.details.boostOnCommonTeamScore*/}
          {/*    : 0;*/}
          {/*  const boostOnCommonPlayerScore = similarFan.details*/}
          {/*    .boostOnCommonPlayerScore*/}
          {/*    ? similarFan.details.boostOnCommonPlayerScore*/}
          {/*    : 0;*/}
          {/*  const boostOnCommonCatScore = similarFan.details*/}
          {/*    .boostOnCommonCatScore*/}
          {/*    ? similarFan.details.boostOnCommonCatScore*/}
          {/*    : 0;*/}
          {/*  const boostOnAgeDiffScore = similarFan.details.boostOnAgeDiffScore*/}
          {/*    ? similarFan.details.boostOnAgeDiffScore*/}
          {/*    : 0;*/}
          {/*  const finalScore = similarFan.score;*/}
          {/*  return (*/}
          {/*    <ListItem*/}
          {/*      key={similarFan.item.email}*/}
          {/*      divider={true}*/}
          {/*      sx={{ ml: 2, mr: 2, width: 'auto' }}*/}
          {/*    >*/}
          {/*      <ListItemText*/}
          {/*        primary={similarFan.item.displayName}*/}
          {/*        secondary={*/}
          {/*          <>*/}
          {/*            <div>{`- Initial score: ${initialScore}`}</div>*/}
          {/*            <div>*/}
          {/*              {`- Boost score on commonly interested teams: ${boostOnCommonTeamScore}`}*/}
          {/*            </div>*/}
          {/*            <div>*/}
          {/*              {`- Boost score on commonly interested players: ${boostOnCommonPlayerScore}`}*/}
          {/*            </div>*/}
          {/*            <div>{`- Boost score on common fan's labels: ${boostOnCommonCatScore}`}</div>*/}
          {/*            <div>{`- Boost score on age difference: ${boostOnAgeDiffScore}`}</div>*/}
          {/*            <div>{`- Final score: ${finalScore}`}</div>*/}
          {/*          </>*/}
          {/*        }*/}
          {/*        secondaryTypographyProps={{ pl: 1 }}*/}
          {/*      />*/}
          {/*    </ListItem>*/}
          {/*  );*/}
          {/*})}*/}
          <ListItem sx={{ mt: 1, pb: 0 }}>
            <ListItemText
              primary={'- Common zipcode:'}
              primaryTypographyProps={{
                variant: 'subtitle1',
                sx: {
                  fontSize: '1.1rem',
                },
              }}
            />
          </ListItem>
          {data.recommendations.map((similarFan) => {
            const commonZip = similarFan.details.commonZip;
            const [st] = recDashboardUtils.getStateByZip(commonZip);
            return (
              <ListItem
                key={similarFan.item.email}
                divider={true}
                sx={{ ml: 2, mr: 2, width: 'auto' }}
              >
                <ListItemText
                  primary={similarFan.item.displayName}
                  secondary={
                    <>
                      <div>{`- Common zipcode: ${commonZip}`}</div>
                      <div>{`- State: ${st}`}</div>
                    </>
                  }
                  secondaryTypographyProps={{ pl: 1 }}
                />
              </ListItem>
            );
          })}
          <ListItem sx={{ mt: 1, pb: 0 }}>
            <ListItemText
              primary={'- Commonly interested teams:'}
              primaryTypographyProps={{
                variant: 'subtitle1',
                sx: {
                  fontSize: '1.1rem',
                },
              }}
            />
          </ListItem>
          {data.recommendations.map((similarFan) => {
            const commonTeams = similarFan.details.commonTeams
              ? similarFan.details.commonTeams
              : [];
            const firstFiveTeams = commonTeams.slice(0, 5);
            const lastTrailing = commonTeams.length <= 5 ? '' : ' ...';
            return (
              <ListItem
                key={similarFan.item.email}
                divider={true}
                sx={{ ml: 2, mr: 2, width: 'auto' }}
              >
                <ListItemText
                  primary={similarFan.item.displayName}
                  secondary={
                    <>
                      <div>{`- Total number of similar teams: ${commonTeams.length}`}</div>
                      <div>
                        {`- Commonly interested teams (Limit 5): `}
                        {firstFiveTeams.map(
                          (team, idx) =>
                            team.name +
                            (idx === firstFiveTeams.length - 1
                              ? lastTrailing
                              : ' | ')
                        )}
                      </div>
                    </>
                  }
                  secondaryTypographyProps={{ pl: 1 }}
                />
              </ListItem>
            );
          })}
          <ListItem sx={{ mt: 1, pb: 0 }}>
            <ListItemText
              primary={'- Commonly interested players:'}
              primaryTypographyProps={{
                variant: 'subtitle1',
                sx: {
                  fontSize: '1.1rem',
                },
              }}
            />
          </ListItem>
          {data.recommendations.map((similarFan) => {
            const commonPlayers = similarFan.details.commonPlayers
              ? similarFan.details.commonPlayers
              : [];
            const firstFivePlayers = commonPlayers.slice(0, 5);
            const lastTrailing = commonPlayers.length <= 5 ? '' : ' ...';
            return (
              <ListItem
                key={similarFan.item.email}
                divider={true}
                sx={{ ml: 2, mr: 2, width: 'auto' }}
              >
                <ListItemText
                  primary={similarFan.item.displayName}
                  secondary={
                    <>
                      <div>{`- Total number of similar players: ${commonPlayers.length}`}</div>
                      <div>
                        {`- Commonly interested players (Limit 5): `}
                        {firstFivePlayers.map(
                          (player, idx) =>
                            player.name +
                            (idx === firstFivePlayers.length - 1
                              ? lastTrailing
                              : ' | ')
                        )}
                      </div>
                    </>
                  }
                  secondaryTypographyProps={{ pl: 1 }}
                />
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </>
  );
};

export default RecFansList;
