import React from 'react';
// import { useSelector } from 'react-redux';
import { Paper, Typography } from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_CURRENT_FAN } from '../../graphql/keymaker';
import recDashboardUtils from '../../utils/rec-dashboard-utils';

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
      <ul
        style={{
          paddingInlineStart: '30px',
        }}
      >
        <Typography component={'li'} variant={'body1'}>
          {'Name: ' + currFan.displayName}
        </Typography>
        <Typography component={'li'} variant={'body1'}>
          {'Email: ' + currFan.email}
        </Typography>
        <Typography component={'li'} variant={'body1'}>
          {`Gender: ${currFan.gender === 'm' ? 'Male' : 'Female'}`}
        </Typography>
        <Typography component={'li'} variant={'body1'}>
          {`City: `}
          {fanCities.map((city, idx) => {
            return city + (idx === fanCities.length - 1 ? '' : ' | ');
          })}
        </Typography>
        <Typography component={'li'} variant={'body1'}>
          {`Zipcode: `}
          {zipCodes.map((zipcode, idx) => {
            return zipcode + (idx === zipCodes.length - 1 ? '' : ' | ');
          })}
        </Typography>
        <Typography component={'li'} variant={'body1'}>
          {`State: `}
          {zipCodes.map((zipcode, idx) => {
            return (
              recDashboardUtils.getStateByZip(zipcode) +
              (idx === zipCodes.length - 1 ? '' : ' | ')
            );
          })}
        </Typography>
        <Typography component={'li'} variant={'body1'}>
          {`Similar Fans (based on SIMILAR relationship): `}
          {similarFans.map((similarFan, idx) => {
            return (
              similarFan.displayName +
              (idx === similarFans.length - 1 ? '' : ' | ')
            );
          })}
        </Typography>
      </ul>
    </Paper>
  );
}
