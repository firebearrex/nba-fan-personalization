import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import { useQuery } from '@apollo/client';
import MyAppBar from '../components/MyAppBar';
import { MOST_ACTIVE_FANS } from '../graphql/keymaker';
import { Route, useHistory } from 'react-router-dom';
import NBAFanPageRecs from '../components/layout/NBAFanPageRecs';
import MostPopularRec from '../components/layout/MostPopularRec';

// const drawerWidth = 240;

// const useStyles = makeStyles((theme) => {
//   return {
//     paper: {
//       padding: theme.spacing(2),
//       display: 'flex',
// overflow: 'auto',
// flexDirection: 'column',
//     },
//   };
//   page: {
//     background: '#f9f9f9',
//     width: '100%',
//     height: '100%',
//     padding: theme.spacing(3),
//   },
//   drawerPaper: {
//     width: drawerWidth,
//   },
//   active: {
//     background: '#f4f4f4',
//   },
//   title: {
//     padding: theme.spacing(2),
//   },
//   toolbar: theme.mixins.toolbar,
//   avatar: {
//     marginLeft: theme.spacing(2),
//   },
// };
// });

export default function NBAFanPage() {
  // const classes = useStyles();
  // const theme = useTheme();
  const history = useHistory();

  const [userEmailSelect, setUserEmailSelect] = useState('');
  // const [selectSubmit, setSelectSubmit] = useState(false);
  const [userEmailInput, setUserEmailInput] = useState('');
  // const [inputSubmit, setInputSubmit] = useState(false);
  // const [fanEmailSimilar, setFanEmailSimilar] = useState('');
  // const [similarFanSubmit, setSimilarFanSubmit] = useState(false);

  const { loading, error, data } = useQuery(MOST_ACTIVE_FANS, {});

  // const whichEmail = () => {
  //   if (userEmailSelect) return userEmailSelect;
  //   else if (userEmailInput) return userEmailInput;
  //   else if (fanEmailSimilar) return fanEmailSimilar;
  // };

  const handleUserEmailSelect = (e) => {
    e.preventDefault();

    const val = e.target.value;
    console.log(val);

    // setUserEmailInput('');
    // setFanEmailSimilar('');
    // setInputSubmit(false);
    // setSimilarFanSubmit(false);

    if (val !== '') {
      setUserEmailSelect(val);
      // setSelectSubmit(true);
      history.push(`/fans/${val}`);
    } else {
      // setUserEmailSelect('');
      // setSelectSubmit(false);
    }
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
      setUserEmailSelect('');
      // setFanEmailSimilar('');
      // setSelectSubmit(false);
      // setSimilarFanSubmit(false);
      // setInputSubmit(true);
      history.push(`/fans/${userEmailInput}`);
    } else {
      alert("Please enter the fan's e-mail address before submitting.");
    }
  };

  return (
    <Box>
      <MyAppBar pageTitle={'NBA Fan Page'} />
      <Container
        style={{
          padding: 0,
        }}
        maxWidth={'xl'}
      >
        <Paper elevation={2} sx={{ mb: 4, px: 4, py: 4 }}>
          <Stack
            direction={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            divider={
              <Divider orientation={'vertical'} flexItem>
                OR
              </Divider>
            }
            spacing={2}
          >
            <FormControl
              fullWidth
              component={'form'}
              variant={'standard'}
              noValidate
              autoComplete={'off'}
              sx={{
                mb: 0.5,
                flexDirection: 'row',
                alignItems: 'center',
                // backgroundColor: (theme) =>
                //   alpha(theme.palette.background.paper, 0.25),
                // '&:hover': {
                //   backgroundColor: (theme) =>
                //     alpha(theme.palette.grey['300'], 0.4),
                // },
              }}
            >
              <InputLabel id={'select-fan'}>
                Select a fan to view the recommendations
              </InputLabel>
              <Select
                color={'primary'}
                fullWidth
                labelId={'select-fan'}
                value={userEmailSelect}
                label={'Select a fan to view the recommendations'}
                onChange={handleUserEmailSelect}
              >
                <MenuItem value={''}>
                  <em>None</em>
                </MenuItem>
                {loading && (
                  <MenuItem>Retrieving the most active fans...</MenuItem>
                )}
                {!loading && (error || data.recommendations.length === 0) && (
                  <MenuItem>Sorry, something went wrong...</MenuItem>
                )}
                {!loading &&
                  !error &&
                  data.recommendations.map((fan) => (
                    <MenuItem key={fan.item.email} value={fan.item.email}>
                      {fan.item.displayName}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl
              fullWidth
              component={'form'}
              noValidate
              autoComplete={'off'}
              onSubmit={handleUserEmailSubmit}
              sx={{
                flexDirection: 'row',
              }}
            >
              <TextField
                id={'search'}
                label="Search by user's email to view the recommendations"
                value={userEmailInput}
                onChange={handleUserInputChange}
                type={'text'}
                sx={{ flexGrow: 1 }}
              />
              <Button
                size={'large'}
                type={'submit'}
                color={'success'}
                variant={'contained'}
                sx={{ height: 40, width: 100, my: 1, ml: 2 }}
              >
                Submit
              </Button>
            </FormControl>
          </Stack>
        </Paper>
        <Grid container>
          <Route exact path={'/fans/:fanEmail'}>
            <NBAFanPageRecs />
          </Route>
          <MostPopularRec />
        </Grid>
      </Container>
    </Box>
  );
}
