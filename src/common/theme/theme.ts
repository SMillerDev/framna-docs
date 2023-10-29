import { createTheme } from "@mui/material/styles"

const theme = () => createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#000000"
    },
    secondary: {
      main: "#000000"
    }
  },
  typography: {
    button: {
      textTransform: "none"
    }
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: () => ({
          borderRadius: "20px"
        })
      }
    },
    MuiMenu: {
      styleOverrides: {
        root: ({ theme }) => ({
          margin: theme.spacing(0.5)
        })
      }
    },
    MuiList: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: 0,
          margin: 0,
          marginTop: theme.spacing(1),
          marginBottom: theme.spacing(1),
          "& li": {
            padding: 0,
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1)
          },
          "& li.Mui-selected": {
            background: "transparent",
            fontWeight: "bold"
          },
          "& li:hover, & li.Mui-selected.Mui-focusVisible, & li.Mui-selected:hover, && .Mui-selected, && .Mui-selected:hover, & .MuiListItemButton-root:hover": { 
            background: "transparent"
          },
          "& li:hover .hover-highlight, & li.Mui-selected:hover .hover-highlight": { 
            background: "rgba(0, 0, 0, 0.05)"
          }
        })
      }
    },
    MuiPopover: {
      defaultProps: {
        PaperProps: {
          elevation: 0,
          sx: {
            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            borderRadius: "12px"
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px"
        }
      }
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  }
})

export default theme
