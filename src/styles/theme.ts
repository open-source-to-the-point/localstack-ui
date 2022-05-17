import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#1ba2ec",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red[400],
    },
  },
});

export default theme;
