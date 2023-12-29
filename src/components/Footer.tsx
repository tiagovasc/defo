import { GitHub, Twitter } from "@mui/icons-material"
import { Box, Container, Divider, Grid, Icon, IconButton, Typography, useTheme } from "@mui/material"


const Footer = () => {

    const theme = useTheme()
    return (
        <Container>

            <Divider
                sx={{
                    margin: theme.spacing(4, 0)
                }}
            />


            <Grid
                container
                sx={{
                    margin: theme.spacing(4, 0),
                    alignItems: "center",
                    justifyContent: "space-between"
                }}
            >
                <Grid
                    item
                    xs={6}
                    md={"auto"}
                >
                    <Box
                        sx={{
                            width: "50%"
                        }}>
                        <a
                            href="https://defo.app/"
                            target={"_blank"}
                            rel="noreferrer"
                        >
                            <img
                                src="/logo.png"
                                style={{
                                    height: "auto",
                                    width: "100%"
                                }}
                                alt="logo"
                            />
                        </a>
                    </Box>
                </Grid>
                <Grid
                    item
                    xs={6}
                    md={"auto"}
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: {
                            xs: "flex-end",
                            md: "center"
                        },
                        alignItems: "center"
                    }}>
                    <IconButton
                        LinkComponent={"a"}
                        href="https://twitter.com/defo_app"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <Twitter />
                    </IconButton>
                    <IconButton
                        LinkComponent={"a"}
                        href="https://github.com/defoundationxyz"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <GitHub />
                    </IconButton>
                    <IconButton
                        LinkComponent={"a"}
                        href="https://discord.gg/wuH6R2vDpt"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <Icon
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "row"
                            }}>
                            <img
                                src="/discord.svg"
                                style={{
                                    height: "auto",
                                    width: "100%"
                                }}
                                alt="discord"
                            />
                        </Icon>
                    </IconButton>
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={"auto"}
                >
                    <Typography
                        sx={{
                            color: "gray",
                            textAlign: {
                                xs: "center",
                                md: "left"
                            }
                        }}
                    >© 2022 Decentralized Foundation.</Typography>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Footer

