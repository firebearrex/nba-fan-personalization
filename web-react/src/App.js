import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { Route } from 'react-router-dom';
import NBAFanPage from './pages/NBAFanPage';
import { COLORS } from './constants/Constants';
import NBATeamPage from './pages/NBATeamPage';
import NBAPlayerPage from './pages/NBAPlayerPage';

const theme = createTheme({
  palette: {
    primary: {
      main: COLORS.main,
      dark: COLORS.dark,
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
      <Route exact path={['/', '/fans/:fanEmail']}>
        <NBAFanPage />
      </Route>
      <Route exact path={'/teams/:teamName'}>
        <NBATeamPage />
      </Route>
      <Route exact path={'/players/:playerName'}>
        <NBAPlayerPage />
      </Route>
    </ThemeProvider>
  );
}
