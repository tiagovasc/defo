import SnackbarContext from "./SnackbarContext"
import { Alert, AlertColor, Snackbar } from '@mui/material'
import { ReactChild, useContext, useState } from 'react'

const SnackbarProvider = ({ children }: { children: ReactChild }) => {

    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [severity, setSeverity] = useState<AlertColor>("info")

    const handleClose = () => {
        setOpen(false)
        setMessage("")
    }

    const execute = (message: string, severity: AlertColor) => {
        setMessage(message)
        setSeverity(severity)
        setOpen(true)
    }

    return (
        <SnackbarContext.Provider value={{
            execute,
        }} >
            {children}
            <Snackbar
                open={open}
                autoHideDuration={7000}
                onClose={handleClose}

            >
                <Alert variant="filled" onClose={handleClose} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    )
}


const useSnackbar = () => {
    const context = useContext(SnackbarContext);

    if(!context) { 
        throw new Error("useSnackbar can be used only within SnackbarProvider");
    }

    return context
}

export { useSnackbar, SnackbarProvider }