import { blueGrey, lightBlue, orange, red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

export const customTheme = createTheme({
  palette: {
    primary: {
      main: '#263238',
    },
    warning: red,
    success: lightBlue,
    error: orange,
    info: blueGrey,
    secondary: {
      main: '#cc7f2a',
    },
  },
  shape: {
    borderRadius: 6,
  },
  typography: {
    fontFamily: 'Quicksand',
  },
});
