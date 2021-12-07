import {
  AppBar,
  Box,
  Container,
  Grid,
  Toolbar,
  Typography,
} from '@mui/material';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  appBar: {
    minHeight: '80px',
    flexDirection: 'row',
    // backgroundColor: theme.palette.primary.dark,
  },
  linkText: {
    color: 'white',
    textDecoration: 'none',
    // width: '320px',
    flexGrow: 1,
  },
  navForm: {
    borderStyle: 'none',
  },
}));

export default function MyAppBar({ pageTitle }) {
  const classes = useStyles();
  // const theme = useTheme();
  return (
    <AppBar
      className={classes.appBar}
      position={'static'}
      elevation={2}
      sx={{
        mb: 4,
        flexDirection: 'row',
        bgcolor: 'rgb(29,66,138)',
      }}
    >
      <Toolbar
        sx={{
          flexGrow: 1,
        }}
      >
        <Container
          style={{
            padding: 0,
          }}
          maxWidth={'xl'}
        >
          <Grid container>
            <Grid item xs={12} md={3}>
              <Link to={'/'} className={classes.linkText}>
                <Box
                  display={'flex'}
                  // flexGrow={1}
                  flexDirection={'row'}
                  alignItems={'stretch'}
                  justifyContent={'flex-start'}
                  height={52}
                  width={320}
                >
                  <img
                    src="https://ak-static.cms.nba.com/wp-content/themes/nba-official/img/logoman.svg"
                    alt={'NBA Logo'}
                    // style={{ flexGrow: 0 }}
                  />
                  <Typography
                    // className={classes.pageTitle}
                    variant={'h4'}
                    component={'div'}
                    sx={{
                      ml: 2,
                      alignItems: 'center',
                      display: 'flex',
                      // flexGrow: 0,
                    }}
                  >
                    {pageTitle}
                  </Typography>
                </Box>
              </Link>
            </Grid>
            <Grid item xs={12} md={9} />
          </Grid>
        </Container>
      </Toolbar>
    </AppBar>
  );
}
