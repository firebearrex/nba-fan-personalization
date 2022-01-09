import { useQuery } from '@apollo/client';
import { GET_CURRENT_TEAM } from '../../graphql/keymaker';
import {
  Avatar,
  Box,
  Divider,
  ListItem,
  ListItemAvatar,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';

export default function TeamInfo(props) {
  const { teamName } = props;
  // const currFan = useSelector((state) => state.currFan);
  const { loading, error, data } = useQuery(GET_CURRENT_TEAM, {
    fetchPolicy: 'no-cache',
    variables: { teamName: teamName },
  });

  if (loading) {
    return (
      // <Skeleton width={'100%'} style={{ height: '175px', marginTop: -40 }} />
      <Paper
        elevation={2}
        sx={{ flexGrow: 1, mb: 2, px: 4, py: 4, height: 41.979 }}
      >
        <Typography variant={'h5'} textAlign={'center'}>
          <Skeleton width={'15%'} height={100} sx={{ mt: '-30px' }} />
        </Typography>
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
  // console.log('The current team is:', currTeam);

  const teamCity = data.recommendations[0].details.teamCity;

  return (
    <Paper elevation={2} sx={{ display: 'block', mb: 2, px: 4, py: 4 }}>
      <ListItem sx={{ px: 0, py: 0 }}>
        <ListItemAvatar>
          <Avatar
            variant={'square'}
            alt={'Milwaukee Bucks Logo'}
            src={'https://cdn.nba.com/logos/nba/1610612749/primary/L/logo.svg'}
            sx={{ width: 64, height: 64 }}
          />
        </ListItemAvatar>
        <Box ml={1} display={'block'}>
          <Typography variant={'h4'} sx={{}}>
            {currTeam.fullName}
          </Typography>
          <Stack
            direction={'row'}
            justifyContent={'flex-start'}
            alignItems={'center'}
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}
          >
            <Typography
              variant={'body1'}
              color={'text.secondary'}
            >{`Rank: ${currTeam.rank}`}</Typography>
            <Typography
              variant={'body1'}
              color={'text.secondary'}
              sx={{ textTransform: 'capitalize' }}
            >{`City: ${teamCity}`}</Typography>
            <Typography variant={'body1'} color={'text.secondary'}>
              {`Abbr: ${currTeam.teamTriCode}`}
            </Typography>
          </Stack>
        </Box>
      </ListItem>
    </Paper>
  );
}
