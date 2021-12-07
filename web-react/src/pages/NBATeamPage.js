import React from 'react';
import { Box, Container, Grid } from '@mui/material';
import MyAppBar from '../components/MyAppBar';
import { useParams } from 'react-router-dom';
import TeamInfo from '../components/basic-info/TeamInfo';

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
        <Grid container>
          <Grid item xs={12}>
            <TeamInfo teamName={teamName} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
