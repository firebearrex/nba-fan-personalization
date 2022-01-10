import React from 'react';
import { Box, Container, Grid } from '@mui/material';
import MyAppBar from '../components/MyAppBar';
import PlayerInfo from '../components/basic-info/PlayerInfo';
import { useParams } from 'react-router-dom';

export default function NBAPlayerPage() {
  const { playerName } = useParams();
  console.log("Current player's name:", playerName);

  return (
    <Box>
      <MyAppBar pageTitle={'NBA Player Page'} />
      <Container
        style={{
          padding: 0,
        }}
        maxWidth={'xl'}
      >
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <PlayerInfo playerName={playerName} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
