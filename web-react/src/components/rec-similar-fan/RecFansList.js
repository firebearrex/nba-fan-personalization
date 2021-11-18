import React from 'react';
import { useQuery } from '@apollo/client';

import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';

import { GET_SIMILAR_FANS } from '../../graphql/keymaker';
import recDashboardUtils from '../../utils/rec-dashboard-utils';

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

  // const currFan = data.recommendations[0].details;
  // console.log(currFan);
  // fanActions.setFan(currFan);

  return (
    <>
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
        <Typography variant={'h5'} sx={{ mt: 3, mb: -1 }}>
          Final Results:
        </Typography>
        <List>
          {data.recommendations.map((fan) => {
            const fanEmail = fan.item.email;
            const fanName = fan.item.displayName;
            return (
              <ListItem key={fanEmail}>
                <ListItemButton
                  id={fanEmail}
                  onClick={handleSimilarFanClick}
                  // onClick={(event) => console.log(event.target.parentElement.id)}
                  divider={true}
                >
                  <ListItemText
                    id={fanEmail}
                    primary={fanName}
                    secondary={
                      <>
                        <div>- Email: {fanEmail}</div>
                      </>
                    }
                    secondaryTypographyProps={{ pl: 1 }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Typography variant={'h5'} sx={{ mt: 2 }}>
          Recommendation Analysis:
        </Typography>
        <List>
          <ListItem sx={{ mt: 1, pb: 0 }}>
            <ListItemText
              primary={'- Recommendation score breakdown'}
              primaryTypographyProps={{
                variant: 'subtitle1',
                sx: {
                  fontSize: '1.1rem',
                },
              }}
            />
          </ListItem>
          {data.recommendations.map((similarFan) => {
            const initialScore = similarFan.details.initialScore;
            const boostOnCommonTeamScore = similarFan.details
              .boostOnCommonTeamScore
              ? similarFan.details.boostOnCommonTeamScore
              : 0;
            const boostOnCommonPlayerScore = similarFan.details
              .boostOnCommonPlayerScore
              ? similarFan.details.boostOnCommonPlayerScore
              : 0;
            const boostOnCommonCatScore = similarFan.details
              .boostOnCommonCatScore
              ? similarFan.details.boostOnCommonCatScore
              : 0;
            const boostOnAgeDiffScore = similarFan.details.boostOnAgeDiffScore
              ? similarFan.details.boostOnAgeDiffScore
              : 0;
            const finalScore = similarFan.score;
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
                      <div>{`- Initial score: ${initialScore}`}</div>
                      <div>
                        {`- Boost score on commonly interested teams: ${boostOnCommonTeamScore}`}
                      </div>
                      <div>
                        {`- Boost score on commonly interested players: ${boostOnCommonPlayerScore}`}
                      </div>
                      <div>{`- Boost score on common fan's labels: ${boostOnCommonCatScore}`}</div>
                      <div>{`- Boost score on age difference: ${boostOnAgeDiffScore}`}</div>
                      <div>{`- Final score: ${finalScore}`}</div>
                    </>
                  }
                  secondaryTypographyProps={{ pl: 1 }}
                />
              </ListItem>
            );
          })}
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
