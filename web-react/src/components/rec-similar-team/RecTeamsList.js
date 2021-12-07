import React from 'react';

import { useQuery } from '@apollo/client';

import { GET_RECOMMENDED_TEAMS } from '../../graphql/keymaker';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

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
        {`Note: The similarity score is calculated based on factors including 
        "Liked by Similar Fans", "Common City" as well as "Excluding 
        Already Followed Teams".`}
      </Typography>
      <Typography variant={'h5'} sx={{ mt: 3, mb: -1 }}>
        Recommendation Rank:
      </Typography>
      <List>
        {data.recommendations.map((team) => (
          <Link
            to={`/teams/${team.item.name}`}
            key={team.item.name}
            className={classes.linkText}
          >
            <ListItem>
              <ListItemButton divider={true}>
                <ListItemText
                  primary={team.item.name}
                  secondary={
                    <>
                      <span>- Team City: {team.details.teamCity}</span>
                    </>
                  }
                  primaryTypographyProps={{
                    color: (theme) => theme.palette.text.primary,
                  }}
                  secondaryTypographyProps={{ pl: 1 }}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
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
        {data.recommendations.map((team) => {
          const initialScore = team.details.initialScore;
          const boostOnCityScore = team.details.boostOnCityScore
            ? team.details.boostOnCityScore
            : 0;
          const finalScore = team.score;
          return (
            <ListItem
              key={team.item.name}
              divider={true}
              sx={{ ml: 2, mr: 2, width: 'auto' }}
            >
              <ListItemText
                primary={team.item.name}
                secondary={
                  <>
                    <span>- Initial score: {initialScore}</span>
                    <br />
                    <span>
                      - Boost score on common city: {boostOnCityScore}
                    </span>
                    <br />
                    <span>- Final score: {finalScore}</span>
                  </>
                }
                secondaryTypographyProps={{ pl: 1 }}
              />
            </ListItem>
          );
        })}
        <ListItem sx={{ mt: 1, pb: 0 }}>
          <ListItemText
            primary={'- Recommendations made on the similar fans:'}
            primaryTypographyProps={{
              variant: 'subtitle1',
              sx: {
                fontSize: '1.1rem',
              },
            }}
          />
        </ListItem>
        {data.recommendations[0].details.similarFans.map((similarFan) => {
          // const fanCity = data.recommendations[0].details.fanCity;
          return (
            <ListItem
              key={similarFan.email}
              divider={true}
              sx={{ ml: 2, mr: 2, width: 'auto' }}
            >
              <ListItemText
                primary={similarFan.displayName}
                secondary={
                  <>
                    <span>- Email: {similarFan.email}</span>
                    {/*<div>*/}
                    {/*  - Fan&apos;s cities:&nbsp;*/}
                    {/*  {fanCity.map((city, idx) => {*/}
                    {/*    return city + (idx === fanCity.length - 1 ? '' : ' | ');*/}
                    {/*  })}*/}
                    {/*</div>*/}
                  </>
                }
                secondaryTypographyProps={{ pl: 1 }}
              />
            </ListItem>
          );
        })}
        <ListItem sx={{ mt: 1, pb: 0 }}>
          <ListItemText
            primary={'- Common city between the fan and the team:'}
            primaryTypographyProps={{
              variant: 'subtitle1',
              sx: {
                fontSize: '1.1rem',
              },
            }}
          />
        </ListItem>
        {data.recommendations.map((team) => {
          const commonCity = team.details.commonCity
            ? team.details.commonCity
            : 'None';
          return (
            <ListItem
              key={team.item.name}
              divider={true}
              sx={{ ml: 2, mr: 2, width: 'auto' }}
            >
              <ListItemText
                primary={team.item.name}
                secondary={'- ' + commonCity}
                secondaryTypographyProps={{ pl: 1 }}
              />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};

export default RecTeamsList;
