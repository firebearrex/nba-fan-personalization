import React from 'react';
// import { useSelector } from 'react-redux';
import {
  Divider,
  Grid,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_CURRENT_FAN } from '../../graphql/keymaker';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';

export default function FanInfo(props) {
  const { userEmail } = props;
  // const currFan = useSelector((state) => state.currFan);
  const { loading, error, data } = useQuery(GET_CURRENT_FAN, {
    // fetchPolicy: 'no-cache',
    variables: { email: userEmail },
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

  const currFan = data.recommendations[0].item;
  console.log(currFan);

  const fanAddr = data.recommendations[0].details.fanAddr
    ? data.recommendations[0].details.fanAddr
    : {};
  // console.log("The fan's addresses:", fanAddr);

  const favoriteTeams = data.recommendations[0].details.favoriteTeams
    ? data.recommendations[0].details.favoriteTeams
    : [];
  // console.log("The fan's favorite teams:", favoriteTeams);

  const favoritePlayers = data.recommendations[0].details.favoritePlayers
    ? data.recommendations[0].details.favoritePlayers
    : [];
  // console.log("The fan's favorite players:", favoritePlayers);

  return (
    <Paper elevation={2} sx={{ display: 'block', mb: 2, px: 4, py: 4 }}>
      <Typography variant={'h4'} gutterBottom>
        {`Selected Fan Profile`}
      </Typography>
      <Divider sx={{ mt: 1, mb: 1 }} />
      <Box pt={1} ml={2} mr={2}>
        <Typography variant={'h5'} sx={{ mt: 2, mb: 1 }}>
          - Personal info:
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
            {'Name: ' + currFan.displayName}
          </Typography>
          <Typography variant={'body1'}>{'Email: ' + currFan.email}</Typography>
          <Typography variant={'body1'}>
            {`Gender: ${currFan.gender === 'm' ? 'Male' : 'Female'}`}
          </Typography>
        </Stack>
        <Divider variant={'fullWidth'} sx={{ mt: 1, mb: 1 }} />
        <Typography variant={'h5'} sx={{ mt: 2, mb: 1 }}>
          - Address:
        </Typography>
        <Stack
          direction="row"
          justifyContent={'flex-start'}
          alignItems={'center'}
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
          sx={{ ml: 3 }}
        >
          <Typography variant={'body1'} sx={{ textTransform: 'capitalize' }}>
            {`Country: ${fanAddr.country ? fanAddr.country : 'null'}`}
          </Typography>
          <Typography variant={'body1'} sx={{ textTransform: 'capitalize' }}>
            {`City: ${fanAddr.city ? fanAddr.city : 'null'}`}
          </Typography>
          <Typography variant={'body1'}>
            {`Zipcode: ${fanAddr.zipCode ? fanAddr.zipCode : 'null'}`}
          </Typography>
        </Stack>
        <Divider variant={'fullWidth'} sx={{ mt: 1, mb: 1 }} />
        <Typography variant={'h5'} sx={{ mt: 2, mb: 1 }}>
          - Favorite Teams:
        </Typography>
        <Grid container spacing={2} sx={{ ml: -3 }}>
          {favoriteTeams.slice(0, 3).map((team, idx) => {
            return (
              <Grid key={idx} item xs={2} justifyContent={'center'}>
                <Link
                  to={`/teams/${team.name}`}
                  style={{ textDecoration: 'none' }}
                >
                  <ListItemButton divider={true}>
                    <ListItemText
                      primary={team.fullName}
                      primaryTypographyProps={{
                        color: (theme) => theme.palette.text.primary,
                        textAlign: 'center',
                      }}
                      // style={{ textTransform: 'capitalize' }}
                    />
                  </ListItemButton>
                </Link>
              </Grid>
            );
          })}
        </Grid>
        <Typography variant={'h5'} sx={{ mt: 2, mb: 1 }}>
          - Favorite Players:
        </Typography>
        <Grid container spacing={2} sx={{ ml: -3 }}>
          {favoritePlayers.slice(0, 5).map((player, idx) => {
            return (
              <Grid key={idx} item xs={2} justifyContent={'center'}>
                <Link
                  to={`/players/${player.name}`}
                  style={{ textDecoration: 'none' }}
                >
                  <ListItemButton divider={true}>
                    <ListItemText
                      primary={player.name.toLowerCase()}
                      primaryTypographyProps={{
                        color: (theme) => theme.palette.text.primary,
                        textAlign: 'center',
                      }}
                      style={{ textTransform: 'capitalize' }}
                    />
                  </ListItemButton>
                </Link>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Paper>
  );
}
