// utility/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#7A288A", // A vibrant purple
    },
    secondary: {
      main: "#FF69B4", // A bright pink
    },
    background: {
      default: "#F7F7F7", // A light beige
      paper: "#FFFFFF",
    },
    text: {
      primary: "#333333", // A dark grey
      secondary: "#666666", // A medium grey
    },
  },
  
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      lineHeight: 1.2, // Add line height for better readability
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 600,
      lineHeight: 1.3, // Add line height for better readability
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 500,
      lineHeight: 1.4, // Add line height for better readability
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 400,
      lineHeight: 1.5, // Add line height for better readability
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6, // Add line height for better readability
    },
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: "none", // Remove uppercase transformation
        borderRadius: 8, // Add a subtle border radius
        padding: "12px 24px", // Add padding for better spacing
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Add a subtle box shadow
        "&:hover": {
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Increase box shadow on hover
        },
        "&:active": {
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Decrease box shadow on active
        },
      },
      contained: {
        backgroundColor: "#7A288A", // Set background color to primary color
        color: "#FFFFFF", // Set text color to white
        "&:hover": {
          backgroundColor: "#6c5ce7", // Darken background color on hover
        },
        "&:active": {
          backgroundColor: "#7A288A", // Reset background color on active
        },
      },
      outlined: {
        borderColor: "#7A288A", // Set border color to primary color
        "&:hover": {
          borderColor: "#6c5ce7", // Darken border color on hover
        },
      },
    },
  },
});

export default theme;
