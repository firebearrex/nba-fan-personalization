import React from 'react';
import { useQuery } from '@apollo/client';

import {
  Avatar,
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
  Typography,
} from '@mui/material';
import LabelIcon from '@mui/icons-material/Label';
import { GET_SIMILAR_FANS } from '../../graphql/keymaker';
import team from '../../static/images/team.png';
import player from '../../static/images/player.png';
import ageDiff from '../../static/images/age.jpg';
import { green, orange, red } from '@mui/material/colors';

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

/**
 * Get the ranking of the three impact factors.
 *
 * @param similarFan an recommendation object containing three fields: item, score and details
 * @param meanCommonTeams the pre-computed mean score of Common Teams.
 * @param meanCommonPlayers the pre-computed mean score of Common Players.
 * @param meanAgeDiff the pre-computed mean score of Age Diff.
 */
const getImpactRanking = (
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

  impactRanking.sort((a, b) => b.impactScore - a.impactScore);

  let src1,
    src2,
    src3,
    src1Alt,
    src2Alt,
    src3Alt,
    width1,
    height1,
    width2,
    height2,
    width3,
    height3;

  const commonTeams = 'Common interest on teams';
  const commonPlayers = 'Common interest on players';
  const ageDifference = 'Age difference';
  const teamWidth = 128;
  const teamHeight = 128;
  const playerWidth = 88;
  const playerHeight = 128.3;
  const ageDiffWidth = 129;
  const ageDiffHeight = 111;

  switch (impactRanking[0].impactName) {
    case commonTeams:
      src1 = team;
      src1Alt = 'T';
      width1 = teamWidth;
      height1 = teamHeight;
      break;
    case commonPlayers:
      src1 = player;
      src1Alt = 'P';
      width1 = playerWidth;
      height1 = playerHeight;
      break;
    case ageDifference:
      src1 = ageDiff;
      src1Alt = 'A';
      width1 = ageDiffWidth;
      height1 = ageDiffHeight;
      break;
    default:
      src1 = 'No matching found.';
      src1Alt = 'N';
  }

  switch (impactRanking[1].impactName) {
    case commonTeams:
      src2 = team;
      src2Alt = 'T';
      width2 = teamWidth;
      height2 = teamHeight;
      break;
    case commonPlayers:
      src2 = player;
      src2Alt = 'P';
      width2 = playerWidth;
      height2 = playerHeight;
      break;
    case ageDifference:
      src2 = ageDiff;
      src2Alt = 'A';
      width2 = ageDiffWidth;
      height2 = ageDiffHeight;
      break;
    default:
      src2 = 'No matching found.';
      src2Alt = 'N';
  }

  switch (impactRanking[2].impactName) {
    case commonTeams:
      src3 = team;
      src3Alt = 'T';
      width3 = teamWidth;
      height3 = teamHeight;
      break;
    case commonPlayers:
      src3 = player;
      src3Alt = 'P';
      width3 = playerWidth;
      height3 = playerHeight;
      break;
    case ageDifference:
      src3 = ageDiff;
      src3Alt = 'A';
      width3 = ageDiffWidth;
      height3 = ageDiffHeight;
      break;
    default:
      src3 = 'No matching found.';
      src3Alt = 'N';
  }

  return {
    src1,
    src2,
    src3,
    src1Alt,
    src2Alt,
    src3Alt,
    width1,
    height1,
    width2,
    height2,
    width3,
    height3,
  };
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
            const {
              src1,
              src2,
              src3,
              src1Alt,
              src2Alt,
              src3Alt,
              width1,
              height1,
              width2,
              height2,
              width3,
              height3,
            } = getImpactRanking(
              similarFan,
              meanCommonTeams,
              meanCommonPlayers,
              meanAgeDiff
            );

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
                      xs={5}
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
                    {/*<Grid item xs={4} />*/}
                    <Grid item xs={7}>
                      <Stack
                        justifyContent={'center'}
                        alignItems={'stretch'}
                        divider={
                          <Divider
                            // variant={'middle'}
                            flexItem
                            sx={{ my: 1 }}
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
                          marginLeft={2}
                        >
                          <ListItemIcon
                            sx={{
                              alignItems: 'center',
                              minWidth: 0,
                              width: 36,
                            }}
                          >
                            <LabelIcon sx={{ color: red[600] }} />
                          </ListItemIcon>
                          <ListItemAvatar
                            sx={{
                              // p: (theme) => theme.spacing,
                              minWidth: 0,
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'stretch',
                              borderRadius: '4px',
                              bgcolor: red[600],
                            }}
                          >
                            <Avatar
                              alt={src1Alt}
                              src={src1}
                              variant={'rounded'}
                              sx={{
                                m: 1,
                                width: width1,
                                height: height1,
                                bgcolor: (theme) => theme.palette.common.white,
                              }}
                            />
                          </ListItemAvatar>
                          {/*<ListItemText*/}
                          {/*  sx={{*/}
                          {/*    display: 'flex',*/}
                          {/*    alignItems: 'stretch',*/}
                          {/*    verticalAlign: 'middle',*/}
                          {/*  }}*/}
                          {/*  secondary={*/}
                          {/*    'Primary impact: ' + impactRanking[0].impactName*/}
                          {/*  }*/}
                          {/*  secondaryTypographyProps={{*/}
                          {/*    // textAlign: 'center',*/}
                          {/*    variant: 'body2',*/}
                          {/*  }}*/}
                          {/*/>*/}
                        </Stack>
                        <Stack
                          direction={'row'}
                          spacing={0}
                          sx={{
                            justifyContent: 'flex-start',
                            alignItems: 'stretch',
                          }}
                          marginLeft={2}
                        >
                          <ListItemIcon
                            sx={{
                              alignItems: 'center',
                              minWidth: 0,
                              width: 36,
                            }}
                          >
                            <LabelIcon sx={{ color: orange[600] }} />
                          </ListItemIcon>
                          <ListItemAvatar
                            sx={{
                              minWidth: 0,
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'stretch',
                              borderRadius: '4px',
                              bgcolor: orange[600],
                            }}
                          >
                            <Avatar
                              alt={src2Alt}
                              src={src2}
                              variant={'rounded'}
                              sx={{
                                m: 1,
                                width: width2,
                                height: height2,
                                bgcolor: (theme) => theme.palette.common.white,
                              }}
                            />
                          </ListItemAvatar>
                          {/*<ListItemText*/}
                          {/*  sx={{*/}
                          {/*    display: 'flex',*/}
                          {/*    alignItems: 'stretch',*/}
                          {/*    verticalAlign: 'middle',*/}
                          {/*  }}*/}
                          {/*  secondary={*/}
                          {/*    'Secondary impact: ' + impactRanking[1].impactName*/}
                          {/*  }*/}
                          {/*  secondaryTypographyProps={{*/}
                          {/*    variant: 'body2',*/}
                          {/*  }}*/}
                          {/*/>*/}
                        </Stack>
                        <Stack
                          direction={'row'}
                          spacing={0}
                          sx={{
                            // width: '100%',
                            justifyContent: 'flex-start',
                            alignItems: 'stretch',
                            // height: 68,
                          }}
                          marginLeft={2}
                        >
                          <ListItemIcon
                            sx={{
                              alignItems: 'center',
                              minWidth: 0,
                              width: 36,
                            }}
                          >
                            <LabelIcon sx={{ color: green[600] }} />
                          </ListItemIcon>
                          <ListItemAvatar
                            sx={{
                              minWidth: 0,
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'stretch',
                              borderRadius: '4px',
                              bgcolor: green[600],
                            }}
                          >
                            <Avatar
                              alt={src3Alt}
                              src={src3}
                              variant={'rounded'}
                              sx={{
                                m: 1,
                                width: width3,
                                height: height3,
                                bgcolor: (theme) => theme.palette.common.white,
                              }}
                            />
                          </ListItemAvatar>
                          {/*<ListItemText*/}
                          {/*  sx={{*/}
                          {/*    display: 'flex',*/}
                          {/*    alignItems: 'stretch',*/}
                          {/*    verticalAlign: 'middle',*/}
                          {/*  }}*/}
                          {/*  secondary={*/}
                          {/*    'Least impact: ' + impactRanking[2].impactName*/}
                          {/*  }*/}
                          {/*  secondaryTypographyProps={{*/}
                          {/*    variant: 'body2',*/}
                          {/*  }}*/}
                          {/*/>*/}
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
        {/*<Typography variant={'h5'} sx={{ mt: 2 }}>*/}
        {/*  Additional Information:*/}
        {/*</Typography>*/}
        {/*<List>*/}
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
        {/*  <ListItem sx={{ mt: 1, pb: 0 }}>*/}
        {/*    <ListItemText*/}
        {/*      primary={`- Similar fan's personal info:`}*/}
        {/*      primaryTypographyProps={{*/}
        {/*        variant: 'subtitle1',*/}
        {/*        sx: {*/}
        {/*          fontSize: '1.1rem',*/}
        {/*        },*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  </ListItem>*/}
        {/*  {data.recommendations.map((similarFan) => {*/}
        {/*    const commonZip = similarFan.details.commonZip;*/}
        {/*    const [st] = recDashboardUtils.getStateByZip(commonZip);*/}
        {/*    const fanEmail = similarFan.item.email;*/}

        {/*    return (*/}
        {/*      <ListItem*/}
        {/*        key={similarFan.item.email}*/}
        {/*        divider={true}*/}
        {/*        sx={{ ml: 2, mr: 2, width: 'auto' }}*/}
        {/*      >*/}
        {/*        <ListItemText*/}
        {/*          primary={similarFan.item.displayName}*/}
        {/*          secondary={*/}
        {/*            <>*/}
        {/*              <span>{`- Email: ${fanEmail}`}</span>*/}
        {/*              <br />*/}
        {/*              <span>{`- Common zipcode with chosen fan: ${commonZip}`}</span>*/}
        {/*              <br />*/}
        {/*              <span>{`- State: ${st}`}</span>*/}
        {/*            </>*/}
        {/*          }*/}
        {/*          secondaryTypographyProps={{ pl: 1 }}*/}
        {/*        />*/}
        {/*      </ListItem>*/}
        {/*    );*/}
        {/*  })}*/}
        {/*  <ListItem sx={{ mt: 1, pb: 0 }}>*/}
        {/*    <ListItemText*/}
        {/*      primary={'- Commonly interested teams:'}*/}
        {/*      primaryTypographyProps={{*/}
        {/*        variant: 'subtitle1',*/}
        {/*        sx: {*/}
        {/*          fontSize: '1.1rem',*/}
        {/*        },*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  </ListItem>*/}
        {/*  {data.recommendations.map((similarFan) => {*/}
        {/*    const commonTeams = similarFan.details.commonTeams*/}
        {/*      ? similarFan.details.commonTeams*/}
        {/*      : [];*/}
        {/*    const firstFiveTeams = commonTeams.slice(0, 5);*/}
        {/*    const lastTrailing = commonTeams.length <= 5 ? '' : ' ...';*/}
        {/*    return (*/}
        {/*      <ListItem*/}
        {/*        key={similarFan.item.email}*/}
        {/*        divider={true}*/}
        {/*        sx={{ ml: 2, mr: 2, width: 'auto' }}*/}
        {/*      >*/}
        {/*        <ListItemText*/}
        {/*          primary={similarFan.item.displayName}*/}
        {/*          secondary={*/}
        {/*            <>*/}
        {/*              <div>{`- Total number of similar teams: ${commonTeams.length}`}</div>*/}
        {/*              <div>*/}
        {/*                {`- Commonly interested teams (Limit 5): `}*/}
        {/*                {firstFiveTeams.map(*/}
        {/*                  (team, idx) =>*/}
        {/*                    team.name +*/}
        {/*                    (idx === firstFiveTeams.length - 1*/}
        {/*                      ? lastTrailing*/}
        {/*                      : ' | ')*/}
        {/*                )}*/}
        {/*              </div>*/}
        {/*            </>*/}
        {/*          }*/}
        {/*          secondaryTypographyProps={{ pl: 1 }}*/}
        {/*        />*/}
        {/*      </ListItem>*/}
        {/*    );*/}
        {/*  })}*/}
        {/*  <ListItem sx={{ mt: 1, pb: 0 }}>*/}
        {/*    <ListItemText*/}
        {/*      primary={'- Commonly interested players:'}*/}
        {/*      primaryTypographyProps={{*/}
        {/*        variant: 'subtitle1',*/}
        {/*        sx: {*/}
        {/*          fontSize: '1.1rem',*/}
        {/*        },*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  </ListItem>*/}
        {/*  {data.recommendations.map((similarFan) => {*/}
        {/*    const commonPlayers = similarFan.details.commonPlayers*/}
        {/*      ? similarFan.details.commonPlayers*/}
        {/*      : [];*/}
        {/*    const firstFivePlayers = commonPlayers.slice(0, 5);*/}
        {/*    const lastTrailing = commonPlayers.length <= 5 ? '' : ' ...';*/}
        {/*    return (*/}
        {/*      <ListItem*/}
        {/*        key={similarFan.item.email}*/}
        {/*        divider={true}*/}
        {/*        sx={{ ml: 2, mr: 2, width: 'auto' }}*/}
        {/*      >*/}
        {/*        <ListItemText*/}
        {/*          primary={similarFan.item.displayName}*/}
        {/*          secondary={*/}
        {/*            <>*/}
        {/*              <div>{`- Total number of similar players: ${commonPlayers.length}`}</div>*/}
        {/*              <div>*/}
        {/*                {`- Commonly interested players (Limit 5): `}*/}
        {/*                {firstFivePlayers.map(*/}
        {/*                  (player, idx) =>*/}
        {/*                    player.name +*/}
        {/*                    (idx === firstFivePlayers.length - 1*/}
        {/*                      ? lastTrailing*/}
        {/*                      : ' | ')*/}
        {/*                )}*/}
        {/*              </div>*/}
        {/*            </>*/}
        {/*          }*/}
        {/*          secondaryTypographyProps={{ pl: 1 }}*/}
        {/*        />*/}
        {/*      </ListItem>*/}
        {/*    );*/}
        {/*  })}*/}
        {/*</List>*/}
      </Paper>
    </>
  );
};

export default RecFansList;
