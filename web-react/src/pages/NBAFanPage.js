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

export default function NBAFanPage() {
  const history = useHistory();

  const [userEmailSelect, setUserEmailSelect] = useState('');
  const [userEmailInput, setUserEmailInput] = useState('');

  const { loading, error, data } = useQuery(MOST_ACTIVE_FANS, {});

  const handleUserEmailSelect = (e) => {
    e.preventDefault();

    const val = e.target.value;
    console.log(val);

    if (val !== '') {
      setUserEmailSelect(val);
      setUserEmailInput('');
      history.push(`/fans/${val}`);
    } else {
      setUserEmailSelect('');
      history.push(`/`);
    }
  };

  const handleUserInputChange = (event) => {
    const val = event.target.value;
    // console.log(val);
    setUserEmailInput(val);
  };

  const handleUserEmailSubmit = (event) => {
    event.preventDefault();

    if (userEmailInput) {
      // console.log('The submitted email is:', userEmailInput);
      setUserEmailSelect('');
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
              }}
            >
              <InputLabel id={'select-fan'} sx={{ fontSize: '1.1rem' }}>
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
              {/* The InputLabelProps setting is for making the label text larger */}
              <TextField
                InputLabelProps={{
                  sx: {
                    fontSize: '1.1rem',
                    zIndex: 2,
                    width: 'auto',
                    bgcolor: 'background.paper',
                    pr: '5px',
                  },
                }}
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
