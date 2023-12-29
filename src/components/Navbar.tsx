import { AppBar, Box, Button, Container, Grid, Toolbar, Typography, useTheme } from "@mui/material"
import { useWeb3 } from "shared/context/Web3/Web3Provider"
import Link from "next/link"
import { useDiamondContext } from "shared/context/DiamondContext/DiamondContextProvider"
import { Contract, ethers } from "ethers"
import { useSnackbar } from "shared/context/Snackbar/SnackbarProvider"
import { SUPPORTED_NETWORKS } from "shared/utils/constants"

const Navbar = () => {
    const theme = useTheme()

    const snackbar = useSnackbar()
    const { connectWeb3, account, isWeb3Enabled, signer, chainId } = useWeb3()
    const { config } = useDiamondContext()


    const handleConnect = async () => {
        await connectWeb3()
    }

    const handleMintDai = async () => {
        const daiInstance = new Contract(config.deployments.dai.address, config.deployments.dai.abi, signer)

        try {
            const tx = await daiInstance.mint(account, ethers.utils.parseEther("1000"))
            snackbar.execute("Minting DAI", "info")
            await tx.wait()
            snackbar.execute("Minted successfully", "success")
        } catch (error) {
            console.log('Error while minting DAI');
            console.log(error);
        }
    }

    return (
        <AppBar
            position="relative"
            color="transparent"
            elevation={0}
            sx={{
                marginBottom: theme.spacing(4)
            }}>
            <Toolbar
                component={Container}
            >
                <Grid
                    container
                    alignItems={"center"}
                    justifyContent="space-between"
                    sx={{
                        margin: theme.spacing(2, 0),
                    }}>
                    <Grid
                        item
                        xs={3}
                        md={3}
                    >
                        <Box
                            sx={{
                                width: {
                                    xs: "80%",
                                    md: "50%"
                                },
                                display: "flex",
                                alignItems: "center"
                            }}>
                            <Link href="/">
                                <a>
                                    <img
                                        src="/logo.png"
                                        style={{
                                            height: "auto",
                                            width: "100%"
                                        }}
                                        alt="logo"
                                    />
                                </a>
                            </Link>
                        </Box>
                    </Grid>
                    <Grid
                        item
                        container
                        xs={9}
                        md={4}
                        justifyContent="space-between"
                        alignItems={"center"}
                    >
                        {chainId === SUPPORTED_NETWORKS.fuji_testnet.chainId ?
                            <>
                                <Grid item>
                                    <a onClick={handleMintDai} target={"_blank"} style={{ cursor: 'pointer' }}>
                                        <Typography fontWeight={"500"}>Mint DAI</Typography>
                                    </a>
                                </Grid>
                                {/* <Grid item>
                                    <Link
                                        href={"https://testnet.snowtrace.io/address/0xd7f655E3376cE2D7A2b08fF01Eb3B1023191A901#writeContract"}
                                    >
                                        <a target={"_blank"}>
                                            <Typography fontWeight={"500"}>Swap DEFO</Typography>
                                        </a>
                                    </Link>
                                </Grid> */}
                            </>
                            :
                            <>
                                <Grid item>
                                    <Link href="https://www.swapsicle.io/swap?outputCurrency=0xd586e7f844cea2f87f50152665bcbc2c279d8d70">
                                        <a>
                                            <Typography fontWeight={"500"}>Buy DAI</Typography>
                                        </a>
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="/buyDefo">
                                        <a>
                                            <Typography fontWeight={"500"}>Buy DEFO</Typography>
                                        </a>
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="https://dexscreener.com/avalanche/0x22cf679582b2d95648322bd581a3ed65555220a5">
                                        <a target={"_blank"}>
                                            <Typography fontWeight={"500"}>DEFO Chart</Typography>
                                        </a>
                                    </Link>
                                </Grid>
                            </>
                        }

                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={3}
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: {
                                xs: "space-between",
                                md: "flex-end"
                            }
                        }}>
                        {!isWeb3Enabled ?
                            <Button
                                variant="contained"
                                onClick={handleConnect}
                                sx={{
                                    margin: theme.spacing(1),
                                    padding: theme.spacing(2),
                                    width: {
                                        xs: "100%",
                                        md: "auto"
                                    }
                                }}
                            >
                                Connect Wallet
                            </Button>
                            :
                            <Button
                                disabled
                                variant="contained"
                                onClick={() => {
                                    window.location.reload()
                                }}
                                sx={{
                                    margin: theme.spacing(1),
                                    padding: theme.spacing(2),
                                    width: {
                                        xs: "100%",
                                        md: "auto"
                                    }
                                }}
                            >
                                {account?.substring(0, 6)}...
                            </Button>
                        }
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar

