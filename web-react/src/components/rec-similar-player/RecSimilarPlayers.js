import React, { useState } from 'react';

import { Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import RecPlayersList from './RecPlayersList';

export default function RecSimilarPlayers() {
  const [userEmail, setUserEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleUserEmailChange = (event) => {
    const val = event.target.value;
    console.log(val);
    setUserEmail(val);
  };

  const handleUserEmailSubmit = (event) => {
    event.preventDefault();

    if (userEmail) {
      console.log(userEmail);
      setSubmitted(true);
    }
  };

  return (
    <>
      <Box
        component="form"
        sx={{ width: '100%' }}
        noValidate
        autoComplete="off"
        onSubmit={handleUserEmailSubmit}
      >
        <Typography variant={'h2'} color={'primary'} gutterBottom>
          Given a fan, what other players might they be interested in?
        </Typography>
        <TextField
          id="search"
          label="User's email"
          value={userEmail}
          onChange={handleUserEmailChange}
          margin="normal"
          variant="outlined"
          type="text"
          fullWidth
        />
        <Button type="submit" color="primary" variant="contained" size="large">
          Submit
        </Button>
      </Box>
      {submitted && <RecPlayersList userEmail={userEmail} />}
    </>
  );
}
