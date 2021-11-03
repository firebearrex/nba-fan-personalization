import React from 'react';

import { useQuery } from '@apollo/client';

import Box from '@mui/material/Box';

import { GET_SIMILAR_FANS } from '../../graphql/keymaker';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

const RecFansList = (props) => {
  const { userEmail } = props;
  const { loading, error, data } = useQuery(GET_SIMILAR_FANS, {
    fetchPolicy: 'no-cache',
    variables: { email: userEmail },
  });

  if (loading) {
    return <Typography sx={{ p: 2 }}>Loading...</Typography>;
  }

  if (error) {
    return <Typography sx={{ p: 2 }}>Oops, something went wrong...</Typography>;
  }

  if (data.recommendations.length === 0) {
    return (
      <Typography sx={{ p: 2 }}>
        No relevant results have been found...
      </Typography>
    );
  }

  return (
    <>
      <Box sx={{ display: 'block' }}>
        <Typography variant={'h4'}>Recommended Similar Fans</Typography>
        <List>
          {data.recommendations.map((fan) => (
            <ListItem button key={fan.item.displayName}>
              {/*<ListItemIcon>{item.icon}</ListItemIcon>*/}
              <ListItemText primary={fan.item.displayName} />
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );
};

export default RecFansList;
