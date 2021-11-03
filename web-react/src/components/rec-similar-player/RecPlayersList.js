import React from 'react';

import { useQuery } from '@apollo/client';

import Box from '@mui/material/Box';

import { GET_RECOMMENDED_PLAYERS } from '../../graphql/keymaker';
import { Typography } from '@mui/material';

const RecPlayersList = (props) => {
  const { userEmail } = props;
  const { loading, error, data } = useQuery(GET_RECOMMENDED_PLAYERS, {
    fetchPolicy: 'no-cache',
    variables: { email: userEmail },
  });

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Oops, something went wrong...</Typography>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <h2>Recommended Players</h2>
      <ul>
        {data.recommendations.map((player, idx) => (
          <li key={idx}>{player.item.name}</li>
        ))}
      </ul>
    </Box>
  );
};

export default RecPlayersList;
