import React from 'react';
// import { useSelector } from 'react-redux';
import { Divider, Paper, Stack, Typography } from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_CURRENT_FAN } from '../../graphql/keymaker';
import recDashboardUtils from '../../utils/rec-dashboard-utils';
import { Box } from '@mui/system';

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

  const fanCities = data.recommendations[0].details.fanCities;
  console.log(fanCities);

  const zipCodes = data.recommendations[0].details.zipcodes;
  console.log(zipCodes);

  const similarFans = data.recommendations[0].details.similarFans;
  console.log(similarFans);

  return (
    <Paper elevation={2} sx={{ display: 'block', mb: 2, px: 4, py: 4 }}>
      <Typography variant={'h4'} gutterBottom>
        {`Current Fan's Information`}
      </Typography>
      <Box ml={2}>
        <Typography variant={'h5'} sx={{ mt: 2, mb: 1 }}>
          - Personal Info:
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
          <Typography variant={'body1'}>
            {`City: `}
            {fanCities.map((city, idx) => {
              return city + (idx === fanCities.length - 1 ? '' : ' | ');
            })}
          </Typography>
          <Typography variant={'body1'}>
            {`Zipcode: `}
            {zipCodes.map((zipcode, idx) => {
              return zipcode + (idx === zipCodes.length - 1 ? '' : ' | ');
            })}
          </Typography>
          <Typography variant={'body1'}>
            {`State: `}
            {zipCodes.map((zipcode, idx) => {
              return (
                recDashboardUtils.getStateByZip(zipcode)[1] +
                (idx === zipCodes.length - 1 ? '' : ' | ')
              );
            })}
          </Typography>
        </Stack>
      </Box>
    </Paper>
  );
}
