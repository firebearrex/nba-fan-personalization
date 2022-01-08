import React from 'react';
import { Grid } from '@mui/material';
import FanInfo from '../basic-info/FanInfo';
import RecTeamsList from '../rec-similar-team/RecTeamsList';
import RecPlayersList from '../rec-similar-player/RecPlayersList';
import RecFansList from '../rec-similar-fan/RecFansList';
import { useParams } from 'react-router-dom';

export default function NBAFanPageRecs() {
  const { fanEmail } = useParams();

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12}>
        <FanInfo userEmail={fanEmail} />
      </Grid>
      <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'stretch' }}>
        <RecTeamsList userEmail={fanEmail} />
      </Grid>
      <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'stretch' }}>
        <RecPlayersList userEmail={fanEmail} />
      </Grid>
      <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'stretch' }}>
        <RecFansList />
      </Grid>
    </Grid>
  );
}
