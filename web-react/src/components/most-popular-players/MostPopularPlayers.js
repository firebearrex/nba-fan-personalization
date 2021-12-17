import React from 'react';
import { useQuery } from '@apollo/client';
import { MOST_POPULAR_PLAYERS } from '../../graphql/keymaker';
import {
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Rating,
  Tooltip,
  Typography,
} from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

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
export default function MostPopularPlayers() {
  const classes = useStyles();

  const { loading, error, data } = useQuery(MOST_POPULAR_PLAYERS, {});

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
      <Typography variant={'h4'}>Top 10 Popular Players</Typography>
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
                <ListItemText primary={'Popularity'} />
              </Grid>
            </Grid>
          </Box>
        </ListItem>
        {data.recommendations.slice(0, 10).map((player) => {
          const playerName = player.item.name;
          const recScore = player.score;

          return (
            <Link
              to={`/players/${playerName}`}
              key={playerName}
              className={classes.linkText}
              // style={{ textDecoration: 'none' }}
            >
              <ListItem sx={{ px: 0, py: 0 }}>
                <ListItemButton
                  divider={
                    <Divider variant={'middle'} flexItem sx={{ my: 1 }} />
                  }
                >
                  <Grid
                    container
                    spacing={2}
                    alignItems={'center'}
                    sx={{ mt: -1.5 }}
                  >
                    <Grid item xs={5}>
                      <ListItemText
                        primary={playerName}
                        primaryTypographyProps={{
                          color: (theme) => theme.palette.text.primary,
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs
                      justifyContent={'center'}
                      alignItems={'stretch'}
                    >
                      <Tooltip title={playerName} followCursor={true}>
                        <Rating
                          defaultValue={getPopularity(
                            baseScore,
                            range,
                            recScore
                          )}
                          max={maxPopLevel}
                          precision={0.5}
                          icon={<PersonIcon />}
                          emptyIcon={<PersonOutlineIcon />}
                          sx={{ color: 'rgb(29,66,138)' }}
                          readOnly={true}
                        />
                      </Tooltip>
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
