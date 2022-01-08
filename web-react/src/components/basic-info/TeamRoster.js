import React from 'react';
import {
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Skeleton,
  Typography,
} from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_TEAM_ROSTER } from '../../graphql/keymaker';
import { Link } from 'react-router-dom';

export default function TeamRoster(props) {
  const { teamName } = props;
  const { loading, error, data } = useQuery(GET_TEAM_ROSTER, {
    // fetchPolicy: 'no-cache',
    variables: { teamName: teamName },
  });

  if (loading) {
    return (
      <Paper
        elevation={2}
        sx={{
          flexGrow: 1,
          mb: 2,
          px: 4,
          py: 4,
          maxHeight: '1095.71px',
        }}
      >
        {/*<Typography variant={'h5'}>Loading...</Typography>*/}
        <Typography variant={'h5'}>Team Roster</Typography>
        <Divider sx={{ mt: 1, mb: 1 }} />
        <Skeleton
          width={'100%'}
          style={{ height: '1730px', marginTop: -376 }}
        />
      </Paper>
    );
  }

  if (error) {
    console.log(error);
    return (
      <Paper
        elevation={2}
        sx={{
          flexGrow: 1,
          mb: 2,
          px: 4,
          py: 4,
        }}
      >
        <Typography variant={'h5'}>Oops, something went wrong...</Typography>
      </Paper>
    );
  }

  if (data.recommendations.length === 0) {
    return (
      <Paper
        elevation={2}
        sx={{
          flexGrow: 1,
          mb: 2,
          px: 4,
          py: 4,
        }}
      >
        <Typography variant={'h5'}>
          No relevant results have been found...
        </Typography>
      </Paper>
    );
  }

  console.log('Team Roster:', data.recommendations);

  return (
    <Paper
      elevation={2}
      sx={{
        flexGrow: 1,
        mb: 2,
        px: 4,
        py: 4,
      }}
    >
      <Typography variant={'h5'}>Team Roster</Typography>
      <Divider sx={{ mt: 1, mb: 1 }} />
      <List>
        <ListItem sx={{ px: 0, py: 0 }} divider={true}>
          <Box sx={{ py: 1, px: 2, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid
                item
                xs={7}
                justifyContent={'center'}
                alignItems={'center'}
                style={{ paddingTop: 8, paddingBottom: 8 }}
              >
                <ListItemText primary={'Name'} />
              </Grid>
              <Divider orientation={'vertical'} variant={'middle'} flexItem />
              <Grid
                item
                xs
                justifyContent={'center'}
                alignItems={'center'}
                style={{ paddingTop: 8, paddingBottom: 8 }}
              >
                <ListItemText primary={'Position'} />
              </Grid>
            </Grid>
          </Box>
        </ListItem>
        {data.recommendations.map((player) => {
          const playerName = player.item.name.toLowerCase();
          const playerPos = player.item.position;

          return (
            <Link
              to={`/players/${playerName}`}
              key={playerName}
              style={{ textDecoration: 'none' }}
            >
              <ListItem sx={{ px: 0, py: 0 }}>
                <ListItemButton divider={true}>
                  <Grid container spacing={2} alignItems={'center'}>
                    <Grid item xs={7}>
                      <ListItemText
                        primary={playerName}
                        primaryTypographyProps={{
                          color: (theme) => theme.palette.text.primary,
                        }}
                        style={{ textTransform: 'capitalize' }}
                      />
                    </Grid>
                    <Grid item xs>
                      <ListItemText
                        primary={playerPos}
                        primaryTypographyProps={{
                          color: (theme) => theme.palette.text.primary,
                        }}
                      />
                    </Grid>
                  </Grid>
                </ListItemButton>
              </ListItem>
            </Link>
          );
        })}
      </List>
    </Paper>
  );
}
