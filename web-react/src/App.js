import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { Route } from 'react-router-dom';
import RecDashboard from './pages/RecDashboard';
import { COLORS } from './constants/Constants';

const theme = createTheme({
  palette: {
    primary: {
      main: COLORS.primary,
    },
  },
  //   secondary: {
  //     main: COLORS.secondary,
  //   },
  // },
  // overrides: {
  //   MuiTooltip: {
  //     tooltip: {
  //       fontSize: '0.9em',
  //     },
  //   },
  // },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Route exact path={'/'}>
        <RecDashboard />
      </Route>
      {/*<Route exact path="/rec-similar-player">*/}
      {/*  <RecSimilarPlayers />*/}
      {/*</Route>*/}
      {/*<Route exact path="/rec-similar-team">*/}
      {/*  <RecSimilarTeams />*/}
      {/*</Route>*/}
      {/*<Route exact path="/rec-similar-fan">*/}
      {/*  <RecSimilarFans />*/}
      {/*</Route>*/}
    </ThemeProvider>
  );
}
