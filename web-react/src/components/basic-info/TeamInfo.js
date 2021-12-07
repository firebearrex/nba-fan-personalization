import { useQuery } from '@apollo/client';
import { GET_CURRENT_TEAM } from '../../graphql/keymaker';
import { Box, Divider, Paper, Stack, Typography } from '@mui/material';
import React from 'react';

export default function TeamInfo(props) {
  const { teamName } = props;
  // const currFan = useSelector((state) => state.currFan);
  const { loading, error, data } = useQuery(GET_CURRENT_TEAM, {
    // fetchPolicy: 'no-cache',
    variables: { teamName: teamName },
  });

  if (loading) {
    return (
      <Paper elevation={2} sx={{ display: 'block', mb: 2, px: 4, py: 4 }}>
        <Typography variant={'h5'}>Loading...</Typography>
      </Paper>
    );
  }

  if (error) {
    console.log(error);
    return (
      <Paper elevation={2} sx={{ display: 'block', mb: 2, px: 4, py: 4 }}>
        <Typography variant={'h5'}>Oops, something went wrong...</Typography>
      </Paper>
    );
  }

  if (data.recommendations.length === 0) {
    return (
      <Paper elevation={2} sx={{ display: 'block', mb: 2, px: 4, py: 4 }}>
        <Typography variant={'h5'}>
          No relevant results have been found...
        </Typography>
      </Paper>
    );
  }

  const currTeam = data.recommendations[0].item;
  console.log(currTeam);

  return (
    <Paper elevation={2} sx={{ display: 'block', mb: 2, px: 4, py: 4 }}>
      <Typography variant={'h4'} gutterBottom>
        {`Current Team's Information`}
      </Typography>
      <Box ml={2}>
        <Typography variant={'h5'} sx={{ mt: 2, mb: 1 }}>
          - Basic Info:
        </Typography>
        <Stack
          direction="row"
          justifyContent={'flex-start'}
          alignItems={'center'}
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
          sx={{ ml: 3 }}
        >
          <Typography variant={'body1'}>
            {'Team Name: ' + currTeam.name}
          </Typography>
          <Typography variant={'body1'}>{'Rank: ' + currTeam.rank}</Typography>
          <Typography variant={'body1'}>
            {`TriCode: ${currTeam.teamTriCode}`}
          </Typography>
        </Stack>
      </Box>
    </Paper>
  );
}
