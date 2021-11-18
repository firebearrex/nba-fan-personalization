import React from 'react';
import { useQuery } from '@apollo/client';
import { MOST_POPULAR_TEAMS } from '../../graphql/keymaker';
import { List, ListItem, ListItemText, Paper, Typography } from '@mui/material';

export default function MostPopularTeams() {
  const { loading, error, data } = useQuery(MOST_POPULAR_TEAMS, {});

  if (loading) {
    return (
      <Paper elevation={2} sx={{ display: 'block', mb: 4, px: 4, py: 4 }}>
        <Typography variant={'h5'}>Loading...</Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={2} sx={{ display: 'block', mb: 4, px: 4, py: 4 }}>
        <Typography variant={'h5'}>Oops, something went wrong...</Typography>
      </Paper>
    );
  }

  if (data.recommendations.length === 0) {
    return (
      <Paper elevation={2} sx={{ display: 'block', mb: 4, px: 4, py: 4 }}>
        <Typography variant={'h5'}>
          No relevant results have been found...
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ display: 'block', mb: 4, px: 4, py: 4 }}>
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
      <List>
        {data.recommendations.map((team) => (
          <ListItem button key={team.item.name}>
            <ListItemText primary={team.item.name} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
