import { useQuery } from '@apollo/client';
import { GET_CURRENT_PLAYER } from '../../graphql/keymaker';
import { Box, Divider, Paper, Stack, Typography } from '@mui/material';
import React from 'react';

export default function PlayerInfo(props) {
  const { playerName } = props;
  // const currFan = useSelector((state) => state.currFan);
  const { loading, error, data } = useQuery(GET_CURRENT_PLAYER, {
    // fetchPolicy: 'no-cache',
    variables: { playerName: playerName },
  });

  if (loading) {
    return (
      <Paper
        elevation={2}
        sx={{ display: 'block', mb: 2, px: 4, py: 4, height: 201.944 }}
      >
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

  const currPlayer = data.recommendations[0].item;
  console.log('currPlayer:', currPlayer);
  const playerTeam = data.recommendations[0].details.playsFor
    ? data.recommendations[0].details.playsFor.fullName
    : '';
  console.log('playerTeam:', playerTeam);
  return (
    <Paper elevation={2} sx={{ display: 'block', mb: 2, px: 4, py: 4 }}>
      <Typography variant={'h4'} gutterBottom>
        {`Player Information`}
      </Typography>
      <Box ml={2}>
        <Typography variant={'h5'} sx={{ mt: 2, mb: 1 }}>
          - Basics:
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
            {'Name: ' + currPlayer.name}
          </Typography>
          <Typography
            variant={'body1'}
          >{`Rank: ${currPlayer.rank}`}</Typography>
          <Typography variant={'body1'}>
            {`League: ${currPlayer.league}`}
          </Typography>
        </Stack>

        <Typography variant={'h5'} sx={{ mt: 2, mb: 1 }}>
          - Plays for:
        </Typography>
        <Stack
          direction="row"
          justifyContent={'flex-start'}
          alignItems={'center'}
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
          sx={{ ml: 3 }}
        >
          <Typography variant={'body1'}>{playerTeam}</Typography>
        </Stack>
      </Box>
    </Paper>
  );
}
