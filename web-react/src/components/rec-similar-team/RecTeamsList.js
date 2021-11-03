import React from 'react';

import { useQuery } from '@apollo/client';

import Box from '@mui/material/Box';

import { GET_RECOMMENDED_TEAMS } from '../../graphql/keymaker';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

const RecTeamsList = (props) => {
  const { userEmail } = props;
  const { loading, error, data } = useQuery(GET_RECOMMENDED_TEAMS, {
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
    <>
      <Box sx={{ display: 'block' }}>
        <Typography variant={'h4'}>Recommended Teams</Typography>
        <List>
          {data.recommendations.map((team) => (
            <ListItem button key={team.item.name}>
              {/*<ListItemIcon>{item.icon}</ListItemIcon>*/}
              <ListItemText primary={team.item.name} />
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );
};

export default RecTeamsList;
