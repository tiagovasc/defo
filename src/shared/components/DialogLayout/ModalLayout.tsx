import { Close } from "@mui/icons-material";
import { Box, Button, IconButton, Modal, Paper, useTheme } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import ContentBox from "components/ContentBox";
import { forwardRef, useImperativeHandle, useState } from "react";


// eslint-disable-next-line react/display-name
const ModalLayout = forwardRef(({ children }: any, ref) => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    useImperativeHandle(ref, () => ({
        handleClose,
        handleOpen
    }))

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                BackdropProps={{
                    sx: {
                        backdropFilter: "blur(3px)",
                        backgroundColor: 'rgba(0,0,30,0.4)'
                    }
                }}
            >
                <Paper
                    sx={{
                        backgroundColor: "#1f1d2b"
                    }}
                >
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            position: "absolute",
                            zIndex: 1,
                            right: 0,
                            top: 0,
                            backgroundColor: theme.palette.primary.main,
                            "&:hover": {
                                backgroundColor: theme.palette.primary.dark,
                            },
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                            borderTopRightRadius: "10%"
                        }}>
                        <Close />
                    </IconButton>
                    <Box sx={{
                        padding: theme.spacing(4),
                    }}>
                        <ContentBox
                            title="Create Yield Gem"
                            color='#C6E270'

                        >
                            <>
                                {children}
                            </>
                        </ContentBox>
                    </Box>
                </Paper>
            </Dialog>
        </>
    )
})

export default ModalLayout;
