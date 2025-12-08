import { createTheme } from "@mui/material/styles";

// Add custom background types
declare module "@mui/material/styles" {
  interface TypeBackground {
    primary: string;
    secondary: string;
  }
}

const paletteTheme = createTheme({
  palette: {
    primary: {
      main: "#1e3a8a",
      dark: "#152860",
      light: "#dbeafe",
    },
    secondary: {
      main: "#14b7a5",
      dark: "#0e8073",
      light: "#cbfbf1",
    },
    text: {
      primary: "#4a5a6d",
      secondary: "#99a1af"
    },
    background: {
        default: '#ffffff',
        paper: '#ffffff',
        primary: '#eff6ff',
        secondary: '#f0fdfa'
    }
  },
  spacing: 8,
  shape: {
    borderRadius: 8,
  },
});

export const theme = createTheme(paletteTheme, {
  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontFamily: '"Inter"', // Must explicitly override default MUI Typography font family
      fontSize: "1.5rem",
      fontWeight: 500,
      color: paletteTheme.palette.primary.main,
    },
    h2: {
      fontFamily: '"Inter"',
      fontSize: "1.25rem",
      fontWeight: 500,
      color: paletteTheme.palette.primary.main,
    },
    h3: {
      fontFamily: '"Inter"',
      fontSize: "1rem",
      fontWeight: 500,
      color: paletteTheme.palette.primary.main,
    },
    h4: {
      fontFamily: '"Inter"',
      fontSize: "0.8rem",
      fontWeight: 500,
      color: paletteTheme.palette.primary.main,
    },
    subtitle1: {
      fontFamily: '"Inter"',
      fontSize: "0.75rem",
      fontWeight: 300,
      color: paletteTheme.palette.text.primary,
    },
    subtitle2: {
      fontFamily: '"Inter"',
      fontSize: "0.875rem",
      fontWeight: 300,
      color: paletteTheme.palette.text.primary,
    },
    body1: {
      fontFamily: '"Inter"',
      fontSize: "1rem",
      color: paletteTheme.palette.text.primary,
    },
    body2: {
      fontFamily: '"Inter"',
      fontSize: "0.875rem",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained'
      },
      styleOverrides: {
        root: {
          backgroundColor: paletteTheme.palette.primary.main,
          paddingTop: 12,
          paddingBottom: 12,
          paddingLeft: 32,
          paddingRight: 32,
          textTransform: "none",
          fontFamily: '"Inter"',
          fontWeight: 400,
          fontSize: "1rem",
          borderRadius: 12
        }
      }
    }
  }
});
