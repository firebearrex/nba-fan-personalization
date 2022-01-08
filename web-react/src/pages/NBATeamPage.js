import React from 'react';
import { Box, Container, Grid } from '@mui/material';
import MyAppBar from '../components/MyAppBar';
import { useParams } from 'react-router-dom';
import TeamInfo from '../components/basic-info/TeamInfo';
import TeamRoster from '../components/basic-info/TeamRoster';
import MostImportantFansForTeam from '../components/most-important-fans/MostImportantFansForTeam';

export default function NBATeamPage() {
  const { teamName } = useParams();
  console.log(teamName);
  return (
    <Box>
      <MyAppBar pageTitle={'NBA Team Page'} />
      <Container
        style={{
          padding: 0,
        }}
        maxWidth={'xl'}
      >
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <TeamInfo teamName={teamName} />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: 'flex', alignItems: 'stretch', minHeight: 450 }}
          >
            <TeamRoster teamName={teamName} />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: 'flex', alignItems: 'stretch', minHeight: 450 }}
          >
            <MostImportantFansForTeam teamName={teamName} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
