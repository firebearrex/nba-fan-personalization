import {
  AppBar,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => {
  return {
    pageTitle: {
      flexGrow: 1,
    },
    navForm: {
      borderStyle: 'none',
    },
  };
});

export default function MyAppBar(props) {
  const classes = useStyles();
  const {
    userEmailSelect,
    handleUserEmailSelect,
    userEmailInput,
    handleUserInputChange,
    handleUserEmailSubmit,
  } = props;
  return (
    <AppBar position={'static'} elevation={2} color="primary">
      <Toolbar
        sx={{
          display: 'flex',
        }}
      >
        <Typography
          className={classes.pageTitle}
          variant={'h5'}
          component="div"
          sx={{
            display: { xs: 'none', sm: 'block' },
          }}
        >
          NBA Fans Personalization
        </Typography>
        <FormControl
          style={{
            borderStyle: 'none',
          }}
          variant={'filled'}
          size={'small'}
          className={classes.navForm}
          noValidate
          autoComplete="off"
          sx={{
            minWidth: 250,
            mr: (theme) => theme.spacing(1),
            backgroundColor: (theme) => alpha(theme.palette.common.white, 0.3),
            '&:hover': {
              backgroundColor: (theme) =>
                alpha(theme.palette.common.white, 0.5),
            },
            borderRadius: (theme) => theme.shape.borderRadius / 2,
            border: 0,
            // borderColor: (theme) => theme.palette.primary.main,
          }}
        >
          <InputLabel
            style={{
              borderStyle: 'none',
            }}
            id="select-fan"
          >
            Select a fan
          </InputLabel>
          <Select
            style={{
              borderStyle: 'none',
            }}
            labelId="select-fan"
            value={userEmailSelect}
            label="Select a fan"
            onChange={handleUserEmailSelect}
            sx={{
              borderRadius: (theme) => theme.shape.borderRadius / 2,
              border: 0,
            }}
          >
            {/* TODO: List of fans */}
            <MenuItem value={'cortezmark@hotmail.com'}>Kyle Stewart</MenuItem>
            <MenuItem value={'kcollins@aguilar-chandler.info'}>
              Patricia Cruz
            </MenuItem>
            <MenuItem value={'lopezdrew@gmail.com'}>Cheryl Marshall</MenuItem>
          </Select>
        </FormControl>
        <FormControl
          component={'form'}
          variant={'filled'}
          size={'small'}
          className={classes.navForm}
          // margin={'normal'}
          noValidate
          autoComplete="off"
          onSubmit={handleUserEmailSubmit}
          sx={{
            // display: 'flex',
            minWidth: 500,
            // my: (theme) => theme.spacing(1),
            backgroundColor: (theme) => alpha(theme.palette.common.white, 0.3),
            '&:hover': {
              backgroundColor: (theme) =>
                alpha(theme.palette.common.white, 0.5),
            },
            borderRadius: (theme) => theme.shape.borderRadius / 2,
            border: 0,
            // borderColor: (theme) => theme.palette.primary.main,
          }}
        >
          <TextField
            id="search"
            label="User's email"
            value={userEmailInput}
            onChange={handleUserInputChange}
            margin="normal"
            variant="outlined"
            type="text"
          />
          <Button
            size={'small'}
            type={'submit'}
            color={'success'}
            variant={'contained'}
          >
            Submit
          </Button>
        </FormControl>
      </Toolbar>
    </AppBar>
  );
}
