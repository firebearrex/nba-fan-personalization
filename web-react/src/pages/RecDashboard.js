import React, { useState } from 'react';
import { Container, Grid } from '@mui/material';
import RecTeamsList from '../components/rec-similar-team/RecTeamsList';
import RecFansList from '../components/rec-similar-fan/RecFansList';
import MyAppBar from '../components/MyAppBar';

// const drawerWidth = 240;

// const useStyles = makeStyles((theme) => {
//   return {
//     page: {
//       background: '#f9f9f9',
//       width: '100%',
//       height: '100%',
//       padding: theme.spacing(3),
//     },
//     root: {
//       display: 'flex',
//     },
//     drawer: {
//       width: drawerWidth,
//     },
//     drawerPaper: {
//       width: drawerWidth,
//     },
//     active: {
//       background: '#f4f4f4',
//     },
//     title: {
//       padding: theme.spacing(2),
//     },
//     appBar: {
//       width: `calc(100% - ${drawerWidth}px)`,
//       marginLeft: drawerWidth,
//     },
//     toolbar: theme.mixins.toolbar,
//     avatar: {
//       marginLeft: theme.spacing(2),
//     },
//   };
// });

export default function RecDashboard() {
  const [userEmailSelect, setUserEmailSelect] = useState('');
  const [selectSubmit, setSelectSubmit] = useState(false);
  const [userEmailInput, setUserEmailInput] = useState('');
  const [inputSubmit, setInputSubmit] = useState(false);

  // const { dataPopTeams } = useQuery(MOST_POPULAR_TEAMS, {
  //   fetchPolicy: 'no-cache',
  //   variables: {},
  // });
  //
  // const { dataPopPlayers } = useQuery(MOST_POPULAR_PLAYERS, {
  //   fetchPolicy: 'no-cache',
  //   variables: {},
  // });

  const handleUserEmailSelect = (event) => {
    event.preventDefault();

    const val = event.target.value;
    console.log(val);
    setUserEmailSelect(val);
    setInputSubmit(false);
    setSelectSubmit(true);
  };

  const handleUserInputChange = (event) => {
    const val = event.target.value;
    console.log(val);
    setUserEmailInput(val);
  };

  const handleUserEmailSubmit = (event) => {
    event.preventDefault();

    if (userEmailInput) {
      console.log('The submitted email is:', userEmailInput);
      setSelectSubmit(false);
      setInputSubmit(true);
    } else {
      alert("Please enter the fan's e-mail address before submitting.");
    }
  };

  return (
    <>
      <MyAppBar
        userEmailSelect={userEmailSelect}
        handleUserEmailSelect={handleUserEmailSelect}
        userEmailInput={userEmailInput}
        handleUserInputChange={handleUserInputChange}
        handleUserEmailSubmit={handleUserEmailSubmit}
      />
      <Container maxWidth={'xl'}>
        <Grid container spacing={2} sx={{ p: (theme) => theme.spacing(3) }}>
          <Grid item xs={12}>

          </Grid>
          <Grid item xs={12} sm={9} md={8}>
            {(selectSubmit || inputSubmit) && (
              <RecTeamsList
                userEmail={selectSubmit ? userEmailSelect : userEmailInput}
              />
            )}
            {/*{(selectSubmit || inputSubmit) && (*/}
            {/*  <RecPlayersList*/}
            {/*    userEmail={selectSubmit ? userEmailSelect : userEmailInput}*/}
            {/*  />*/}
            {/*)}*/}
          </Grid>
          <Grid item xs={12} sm={3} md={4}>
            {(selectSubmit || inputSubmit) && (
              <RecFansList
                userEmail={selectSubmit ? userEmailSelect : userEmailInput}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
