import React from 'react';
import { Grid } from '@mui/material';
import MostPopularTeams from './most-popular-teams/MostPopularTeams';
import MostPopularPlayers from './most-popular-players/MostPopularPlayers';

export default function MostPopularRec() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'stretch' }}>
        <MostPopularTeams />
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'stretch' }}>
        <MostPopularPlayers />
      </Grid>
    </Grid>
  );
}
