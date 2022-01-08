import { useQuery } from '@apollo/client';
import { GET_CURRENT_TEAM } from '../../graphql/keymaker';
import { Paper, Skeleton, Typography } from '@mui/material';
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
  console.log('The current team is:', currTeam);
  // const teamRoster = data.recommendations[0].details.teamRoster;
  // console.log(teamRoster);

  return (
    <Paper elevation={2} sx={{ display: 'block', mb: 2, px: 4, py: 4 }}>
      <Typography variant={'h4'}>{currTeam.fullName}</Typography>
      {/*<Box ml={2}>*/}
      {/*  <Typography variant={'h5'} sx={{ mt: 2, mb: 1 }}>*/}
      {/*    - Basics:*/}
      {/*  </Typography>*/}
      {/*  <Stack*/}
      {/*    direction="row"*/}
      {/*    justifyContent={'flex-start'}*/}
      {/*    alignItems={'center'}*/}
      {/*    divider={<Divider orientation="vertical" flexItem />}*/}
      {/*    spacing={2}*/}
      {/*    sx={{ ml: 3 }}*/}
      {/*  >*/}
      {/*    <Typography variant={'body1'}>{'Name: ' + currTeam.name}</Typography>*/}
      {/*    <Typography variant={'body1'}>{'Rank: ' + currTeam.rank}</Typography>*/}
      {/*    <Typography variant={'body1'}>*/}
      {/*      {`TriCode: ${currTeam.teamTriCode}`}*/}
      {/*    </Typography>*/}
      {/*  </Stack>*/}
      {/*<Typography variant={'h5'} sx={{ mt: 2, mb: 1 }}>*/}
      {/*  - Team Roster:*/}
      {/*</Typography>*/}
      {/*<Stack*/}
      {/*  direction="row"*/}
      {/*  justifyContent={'flex-start'}*/}
      {/*  alignItems={'center'}*/}
      {/*  divider={<Divider orientation="vertical" flexItem />}*/}
      {/*  spacing={2}*/}
      {/*  sx={{ ml: 3 }}*/}
      {/*>*/}
      {/*  {teamRoster.map((player) => {*/}
      {/*    return (*/}
      {/*      <Typography key={player.name} variant={'body1'}>*/}
      {/*        {player.name}*/}
      {/*      </Typography>*/}
      {/*    );*/}
      {/*  })}*/}
      {/*</Stack>*/}
      {/*</Box>*/}
    </Paper>
  );
}
