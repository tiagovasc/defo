import {GitHub, Twitter} from '@mui/icons-material'
import {Box, Container, Divider, Grid, Icon, IconButton, Typography, useTheme} from '@mui/material'
import {Icon as OpenSeaIcon} from '@iconify/react';

const SimpleFooter = () => {

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
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <Grid
                    item
                    xs={12}
                    md={'auto'}
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: {
                            xs: 'center',
                            md: 'center'
                        },
                        alignItems: 'center'
                    }}>
                    <IconButton
                        LinkComponent={'a'}
                        href="https://opensea.io/collection/defo-vault"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <OpenSeaIcon icon="simple-icons:opensea"/>
                    </IconButton>
                    <IconButton
                        LinkComponent={'a'}
                        href="https://twitter.com/defo_app"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <Twitter/>
                    </IconButton>
                    <IconButton
                        LinkComponent={'a'}
                        href="https://github.com/defoundationxyz/defo-contract"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <GitHub/>
                    </IconButton>
                    <IconButton
                        LinkComponent={'a'}
                        href="https://discord.gg/wuH6R2vDpt"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <Icon
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                flexDirection: 'row'
                            }}>
                            <img
                                src="/discord.svg"
                                style={{
                                    height: 'auto',
                                    width: '100%'
                                }}
                                alt="discord"
                            />
                        </Icon>
                    </IconButton>
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={'auto'}
                >
                    <Typography
                        sx={{
                            color: 'gray',
                            textAlign: {
                                xs: 'center',
                                md: 'left'
                            }
                        }}
                    >© 2022 Decentralized Foundation.</Typography>
                </Grid>
            </Grid>
        </Container>
    )
}

export default SimpleFooter

