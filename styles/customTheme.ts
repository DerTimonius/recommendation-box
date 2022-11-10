import { blueGrey, lightBlue, orange, red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

export const customTheme = createTheme({
  palette: {
    primary: {
      main: '#283593',
    },
    warning: red,
    success: lightBlue,
    error: orange,
    info: blueGrey,
    secondary: {
      main: '#c33a4d',
    },
  },
  shape: {
    borderRadius: 6,
  },
  typography: {
    fontFamily: 'Quicksand',
  },
});
