import { alpha } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import { Kanit } from "next/font/google";
const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "700"],
});

export const brand = {
  50: "#F0F7FF",
  100: "#CEE5FD",
  200: "#9CCCFC",
  300: "#55A6F6",
  400: "#0A66C2",
  500: "#0959AA",
  600: "#064079",
  700: "#033363",
  800: "#02294F",
  900: "#021F3B",
};

export const secondary = {
  50: "#F9F0FF",
  100: "#E9CEFD",
  200: "#D49CFC",
  300: "#B355F6",
  400: "#750AC2",
  500: "#6709AA",
  600: "#490679",
  700: "#3B0363",
  800: "#2F024F",
  900: "#23023B",
};

export const gray = {
  50: "#FBFCFE",
  100: "#EAF0F5",
  200: "#D6E2EB",
  300: "#BFCCD9",
  400: "#94A6B8",
  500: "#5B6B7C",
  600: "#4C5967",
  700: "#364049",
  800: "#131B20",
  900: "#090E10",
};

export const green = {
  50: "#F6FEF6",
  100: "#E3FBE3",
  200: "#C7F7C7",
  300: "#A1E8A1",
  400: "#51BC51",
  500: "#1F7A1F",
  600: "#136C13",
  700: "#0A470A",
  800: "#042F04",
  900: "#021D02",
};

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      light: brand[200],
      main: brand[500],
      dark: brand[800],
      contrastText: brand[50],
      ...(mode === "dark" && {
        contrastText: brand[100],
        light: brand[300],
        main: brand[400],
        dark: brand[800],
      }),
    },
    secondary: {
      light: secondary[300],
      main: secondary[500],
      dark: secondary[800],
      ...(mode === "dark" && {
        light: secondary[400],
        main: secondary[500],
        dark: secondary[900],
      }),
    },
    warning: {
      main: "#F7B538",
      dark: "#F79F00",
      ...(mode === "dark" && { main: "#F7B538", dark: "#F79F00" }),
    },
    error: {
      light: red[50],
      main: red[500],
      dark: red[700],
      ...(mode === "dark" && {
        light: "#D32F2F",
        main: "#D32F2F",
        dark: "#B22A2A",
      }),
    },
    success: {
      light: green[300],
      main: green[400],
      dark: green[800],
      ...(mode === "dark" && {
        light: green[400],
        main: green[500],
        dark: green[700],
      }),
    },
    grey: {
      50: gray[50],
      100: gray[100],
      200: gray[200],
      300: gray[300],
      400: gray[400],
      500: gray[500],
      600: gray[600],
      700: gray[700],
      800: gray[800],
      900: gray[900],
    },
    divider: mode === "dark" ? alpha(gray[600], 0.3) : alpha(gray[300], 0.5),
    background: {
      default: "#fff",
      paper: gray[50],
      ...(mode === "dark" && { default: gray[900], paper: gray[800] }),
    },
    text: {
      primary: gray[800],
      secondary: gray[600],
      ...(mode === "dark" && { primary: "#fff", secondary: gray[400] }),
    },
    action: {
      selected: `${alpha(brand[200], 0.2)}`,
      ...(mode === "dark" && {
        selected: alpha(brand[800], 0.2),
      }),
    },
  },
  typography: {
    // fontFamily: ['"Kanit", "sans-serif"'].join(","),
    fontFamily: kanit.style.fontFamily,
    h1: {
      fontSize: 60,
      fontWeight: 600,
      lineHeight: 78 / 70,
      letterSpacing: -0.2,
    },
    h2: {
      fontSize: 48,
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: 42,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: 36,
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h5: {
      fontSize: 20,
      fontWeight: 600,
    },
    h6: {
      fontSize: 18,
    },
    subtitle1: {
      fontSize: 18,
    },
    subtitle2: {
      fontSize: 16,
    },
    body1: {
      fontWeight: 400,
      fontSize: 15,
    },
    body2: {
      fontWeight: 400,
      fontSize: 14,
    },
    caption: {
      fontWeight: 400,
      fontSize: 12,
    },
  },
});

export default function getLPTheme(mode) {
  return {
    ...getDesignTokens(mode),
    palette: {
      background: {
        default: "#EEEEEE",
      },
    },
    components: {
      MuiAccordion: {
        defaultProps: {
          elevation: 0,
          disableGutters: true,
        },
        styleOverrides: {
          root: ({ theme }) => ({
            padding: 8,
            overflow: "clip",
            backgroundColor: "#fff",
            border: "1px solid",
            borderColor: gray[100],
            ":before": {
              backgroundColor: "transparent",
            },
            "&:first-of-type": {
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            },
            "&:last-of-type": {
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            },
            ...(theme.palette.mode === "dark" && {
              backgroundColor: gray[900],
              borderColor: gray[800],
            }),
          }),
        },
      },
      MuiAccordionSummary: {
        styleOverrides: {
          root: ({ theme }) => ({
            border: "none",
            borderRadius: 8,
            "&:hover": { backgroundColor: gray[100] },
            ...(theme.palette.mode === "dark" && {
              "&:hover": { backgroundColor: gray[800] },
            }),
          }),
        },
      },
      MuiAccordionDetails: {
        styleOverrides: {
          root: { mb: 20, border: "none" },
        },
      },
      MuiToggleButtonGroup: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: "10px",
            boxShadow: `0 4px 16px ${alpha(gray[400], 0.2)}`,
            "& .Mui-selected": {
              color: brand[500],
            },
            ...(theme.palette.mode === "dark" && {
              "& .Mui-selected": {
                color: "#fff",
              },
              boxShadow: `0 4px 16px ${alpha(brand[700], 0.5)}`,
            }),
          }),
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            padding: "12px 16px",
            textTransform: "none",
            borderRadius: "10px",
            fontWeight: 500,
            ...(theme.palette.mode === "dark" && {
              color: gray[400],
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.5)",
              "&.Mui-selected": { color: brand[300] },
            }),
          }),
        },
      },

      MuiCard: {
        styleOverrides: {
          root: ({ theme, ownerState }) => ({
            backgroundColor: gray[50],
            borderRadius: 10,
            border: `1px solid ${alpha(gray[200], 0.8)}`,
            boxShadow: "none",
            transition: "background-color, border, 80ms ease",
            ...(ownerState.variant === "outlined" && {
              background: `linear-gradient(to bottom, #FFF, ${gray[50]})`,
              "&:hover": {
                borderColor: brand[300],
                boxShadow: `0 0 24px ${brand[100]}`,
              },
            }),
            ...(theme.palette.mode === "dark" && {
              backgroundColor: alpha(gray[800], 0.6),
              border: `1px solid ${alpha(gray[700], 0.3)}`,
              ...(ownerState.variant === "outlined" && {
                background: `linear-gradient(to bottom, ${gray[900]}, ${alpha(
                  gray[800],
                  0.5
                )})`,
                "&:hover": {
                  borderColor: brand[700],
                  boxShadow: `0 0 24px ${brand[800]}`,
                },
              }),
            }),
          }),
        },
      },

      MuiDivider: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderColor: `${alpha(gray[200], 0.8)}`,
            ...(theme.palette.mode === "dark" && {
              borderColor: `${alpha(gray[700], 0.4)}`,
            }),
          }),
        },
      },
      MuiLink: {
        defaultProps: {
          underline: "none",
        },
        styleOverrides: {
          root: ({ theme }) => ({
            color: brand[600],
            fontWeight: 500,
            position: "relative",
            textDecoration: "none",
            "&::before": {
              content: '""',
              position: "absolute",
              width: 0,
              height: "1px",
              bottom: 0,
              left: 0,
              backgroundColor: brand[200],
              opacity: 0.7,
              transition: "width 0.3s ease, opacity 0.3s ease",
            },
            "&:hover::before": {
              width: "100%",
              opacity: 1,
            },
            ...(theme.palette.mode === "dark" && {
              color: brand[200],
            }),
          }),
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: "99px",
            color: gray[500],
            fontWeight: 500,
            ...(theme.palette.mode === "dark" && {
              color: gray[300],
            }),
          }),
        },
      },

      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              fontSize: "16px",
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: "10px",
          },
        },
        defaultProps: {
          MenuProps: {
            PaperProps: {
              style: {
                maxHeight: 48 * 4.5 + 8,
              },
            },
          },
        },
      },
    },
  };
}
