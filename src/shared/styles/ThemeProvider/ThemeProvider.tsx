
import { createTheme, CssBaseline, ThemeProvider as MThemeProvider } from "@mui/material"
import { ReactChild } from "react"

const ThemeProvider = ({ children }: {
    children: ReactChild | ReactChild[]
}) => {

    const theme = createTheme({
        palette: {
            mode: "dark",
            primary: {
                main: "#1f3665"
            },
            info: {
                main: "#03AC90"
            },
            warning: {
                main: "#C6E270"
            },
            error: {
                main: "#E0115F"
            },
            success: {
                main: "#2EBE73"
            },
            background: {
                paper: "rgba(255,255,255,0.005)"
            },
        },
        components: {
            MuiButtonBase: {
                defaultProps: {
                    disableRipple: true,
                    disableTouchRipple: true,
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        borderRadius: "10px"
                    }
                }
            },
            MuiDialog: {
                styleOverrides: { 
                    paper: { 
                        maxWidth: "none",
                        minWidth: "900px"
                    }
                }
            }
        }
    })

    return (
        <MThemeProvider
            theme={theme}
        >
            <CssBaseline />
            {children}
        </MThemeProvider>
    )
}

export default ThemeProvider