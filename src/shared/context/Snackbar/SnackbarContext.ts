import { createContext } from "react";
import { AlertColor } from '@mui/material'


const SnackbarContext = createContext({
    execute: (message: string, severity: AlertColor) => {
        console.log(message, severity)
    }
});

export default SnackbarContext