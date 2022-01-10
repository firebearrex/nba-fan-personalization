import { useQuery } from '@apollo/client';
import { GET_CURRENT_PLAYER } from '../../graphql/keymaker';
import {
  Avatar,
  Box,
  Divider,
  Link,
  ListItem,
  ListItemAvatar,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
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
  // console.log('currPlayer:', currPlayer);
  const playerTeam = data.recommendations[0].details.playsFor
    ? data.recommendations[0].details.playsFor
    : '';
  // console.log('playerTeam:', playerTeam);

  return (
    <Paper elevation={2} sx={{ display: 'block', mb: 2, px: 4, py: 4 }}>
      <ListItem sx={{ px: 0, py: 0 }}>
        <ListItemAvatar>
          <Avatar
            variant={'square'}
            color={'transparent'}
            sx={{ width: 200, height: 200 }}
          />
        </ListItemAvatar>
        <Box ml={2} display={'block'}>
          <Typography variant={'h4'} style={{ textTransform: 'capitalize' }}>
            {`${currPlayer.name
              .toLowerCase()
              .split(' ')
              .slice(0, -1)
              .join(' ')} `}
          </Typography>
          <Typography
            variant={'h4'}
            style={{ textTransform: 'capitalize', fontWeight: 'bold' }}
          >
            {`${currPlayer.name.toLowerCase().split(' ').slice(-1)[0]}`}
          </Typography>
          <Stack
            direction={'row'}
            justifyContent={'flex-start'}
            alignItems={'center'}
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}
            mt={1}
          >
            <Box display={'flex'} alignItems={'center'}>
              <Avatar
                variant={'square'}
                alt={`${playerTeam.fullName} Logo`}
                src={playerTeam.teamLogo}
                sx={{ width: 32, height: 32 }}
              />
              <Typography variant={'body1'} color={'text.secondary'}>
                {`${playerTeam.fullName}`}
              </Typography>
            </Box>
            <Typography variant={'body1'} color={'text.secondary'}>
              {`Position: ${
                currPlayer.position ? currPlayer.position : 'null'
              }`}
            </Typography>
            <Link
              component={'a'}
              href={`https://www.lineups.com/nba/player-stats/${currPlayer.name
                .toLowerCase()
                .split(' ')
                .join('-')}`}
              variant={'body1'}
              target="_blank"
              rel="noreferrer noopener"
              // color={'text.secondary'}
            >
              {`More info`}
            </Link>
          </Stack>
        </Box>
      </ListItem>
    </Paper>
  );
}
