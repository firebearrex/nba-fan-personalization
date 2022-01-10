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
  ListItemText,
  Paper,
  Rating,
  Typography,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

import { MOST_POPULAR_TEAMS } from '../../graphql/keymaker';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => {
  return {
    linkText: {
      textDecoration: 'none',
    },
  };
});

const basePopLevel = 3;
const maxPopLevel = 15;

const getBaseScore = (data) => {
  return data.recommendations[data.recommendations.length - 1].score;
};

const getRange = (data) => {
  const fullScore = data.recommendations[0].score;
  const baseScore = data.recommendations[data.recommendations.length - 1].score;
  return fullScore - baseScore;
};

const getPopularity = (baseScore, range, recScore) => {
  const flexRangePopLevel = maxPopLevel - basePopLevel;
  return flexRangePopLevel * ((recScore - baseScore) / range) + basePopLevel;
};

/**
 * The React component.
 */
export default function MostPopularTeams() {
  const classes = useStyles();

  const { loading, error, data } = useQuery(MOST_POPULAR_TEAMS, {});

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

  const range = getRange(data);
  const baseScore = getBaseScore(data);

  return (
    <Paper elevation={2} sx={{ display: 'block', mb: 4, px: 4, py: 4 }}>
      {/* Section title */}
      <Typography variant={'h4'}>Top 10 Popular Teams</Typography>
      <Typography
        variant={'body2'}
        gutterBottom
        sx={{ color: (theme) => theme.palette.text.secondary }}
      >
        {`Note: The similarity score is calculated based on the sum of the total number of LIKES, FOLLOWS AND FAVORITE 
        relationships with fans. The LIKES type of relationship is given a weight of 1, while the FOLLOWS and FAVORITE 
        type of relationships are given a weight of 1.5 and 2 respectively.`}
      </Typography>

      {/* Recommendation Rank */}
      <List>
        <ListItem sx={{ px: 0, py: 0 }} divider={true}>
          <Box sx={{ py: 1, px: 2, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid
                item
                xs={4.5}
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
                  primary={'Popularity'}
                  primaryTypographyProps={{
                    fontWeight: 'bold',
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </ListItem>
        {data.recommendations.slice(0, 10).map((team, idx) => {
          const teamName = team.item.fullName;
          const recScore = team.score;
          const teamLogo = team.item.teamLogo;

          return (
            <Link
              to={`/teams/${team.item.name}`}
              key={idx}
              className={classes.linkText}
            >
              <ListItem sx={{ px: 0, py: 0 }}>
                <ListItemButton
                  divider={
                    // <Divider variant={'middle'} flexItem sx={{ my: 1 }} />
                    true
                  }
                >
                  <Grid
                    container
                    spacing={2}
                    alignItems={'center'}
                    sx={{ mt: -1.5 }}
                  >
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
                    <Grid
                      item
                      xs
                      // justifyContent={'center'}
                      alignItems={'center'}
                    >
                      <Rating
                        defaultValue={getPopularity(baseScore, range, recScore)}
                        max={maxPopLevel}
                        precision={0.5}
                        icon={<PersonIcon />}
                        emptyIcon={<PersonOutlineIcon />}
                        sx={{ color: 'rgb(29,66,138)' }}
                        readOnly={true}
                      />
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
}
