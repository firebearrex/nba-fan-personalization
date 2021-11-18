import { AppBar, Container, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => {
  return {
    appBar: {
      minHeight: '80px',
      flexDirection: 'row',
      flexGrow: 1,
    },
    pageTitle: {
      flexGrow: 1,
    },
    navForm: {
      borderStyle: 'none',
    },
  };
});

export default function MyAppBar() {
  const classes = useStyles();
  // const theme = useTheme();

  return (
    <AppBar
      className={classes.appBar}
      position={'static'}
      elevation={2}
      sx={{ mb: 4, flexDirection: 'row' }}
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
          <Typography
            className={classes.pageTitle}
            variant={'h4'}
            component={'div'}
            sx={{
              display: { xs: 'none', sm: 'block' },
              flexGrow: 1,
            }}
          >
            NBA Fan Page
          </Typography>
        </Container>
      </Toolbar>
    </AppBar>
  );
}
