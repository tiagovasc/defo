import { FiberManualRecord } from "@mui/icons-material";
import { Grid, Paper, Typography, Box, useTheme, Button } from "@mui/material"
import { BigNumber, Contract, ethers } from "ethers";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDiamondContext } from "shared/context/DiamondContext/DiamondContextProvider";
import { useGemsContext } from "shared/context/GemContext/GemContextProvider";
import { useSnackbar } from "shared/context/Snackbar/SnackbarProvider";
import { useWeb3 } from "shared/context/Web3/Web3Provider";
import { GemTypeConfig, GemTypeMintWindow } from "shared/types/DataTypes";
import { BOOSTERS_TYPE, GEM_TYPE_NAMES } from "shared/utils/constants";
import { primaryColorMapper, secondaryColorMapper } from "../utils/colorMapper";

const YieldGemModalBox = ({ gemType, name, gemConfig, gemTypeMintWindow, handleCloseModal, deltaBoosts, omegaBoosts }: {
    gemType: 0 | 1 | 2,
    name: "Sapphire" | "Ruby" | "Diamond",
    gemConfig: GemTypeConfig,
    gemTypeMintWindow: () => Promise<GemTypeMintWindow>
    handleCloseModal: () => void
    deltaBoosts: BigNumber,
    omegaBoosts: BigNumber,
}) => {
    const theme = useTheme();
    const { diamondContract, config } = useDiamondContext()
    const snackbar = useSnackbar();

    const { signer, account } = useWeb3();
    const { updateGemsCollection } = useGemsContext()

    const [mintWindow, setMintWindow] = useState({
        leftHours: 0,
        availableMintCount: BigNumber.from(0)
    })

    useEffect(() => {
        const loadData = async () => {
            const currentGemMintWindow = await gemTypeMintWindow()
            const current = moment()
            const endOfMintLimitWindow = moment(currentGemMintWindow.endOfMintLimitWindow, "X") //.format("MMM DD YYYY HH:mm")

            const diffHours = endOfMintLimitWindow.diff(current, "hours")
            // const diffMinutes = endOfMintLimitWindow.diff(current, "minutes")

            setMintWindow({
                leftHours: diffHours,
                availableMintCount: currentGemMintWindow.mintCount
            })
        }
        loadData()
    }, [gemTypeMintWindow])


    const createYieldGem = async (gemType: 0 | 1 | 2) => {
        try {
            if (!config?.deployments) {
                console.log('MISSING DEPLOYMENTS');
                return
            }


            const defo = new Contract(config.deployments.defo.address, config.deployments.defo.abi, signer)
            const defoAllowance = await defo.allowance(account, config.deployments.diamond.address)
            const dai = new Contract(config.deployments?.dai.address, config.deployments.dai.abi, signer)
            const daiAllowance = await dai.allowance(account, config.deployments.diamond.address)

            if (defoAllowance.isZero()) {
                const tx = await defo.approve(config.deployments.diamond.address, ethers.constants.MaxUint256)
                await tx.wait()
            }

            if (daiAllowance.isZero()) {
                const tx = await dai.approve(config.deployments.diamond.address, ethers.constants.MaxUint256)
                await tx.wait()
            }

            const tx = await diamondContract.mint(gemType.toString())
            snackbar.execute("Creating, please wait.", "info")
            await tx.wait()

            await updateGemsCollection()
            snackbar.execute("Created", "success")
            handleCloseModal()
        } catch (error: any) {
            console.log(error)
            snackbar.execute(error?.reason || error?.message || "Error", "error")
        }
    }

    return (
        <>
            <Grid item xs={12} md={3.7} sx={{
                margin: {
                    xs: theme.spacing(2, 0),
                    md: 0
                },
            }} >
                <Paper
                    sx={{
                        padding: {
                            xs: theme.spacing(0.5),
                            md: theme.spacing(2),
                        },
                        height: "100%",
                        border: `solid 1px ${primaryColorMapper[gemType]}`
                    }}>
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: theme.spacing(2)

                    }}>
                        <FiberManualRecord sx={{
                            marginRight: {
                                xs: theme.spacing(0),
                                md: theme.spacing(1),
                            },
                            fontSize: "16px",
                            color: primaryColorMapper[gemType]
                        }} />
                        <Typography flexGrow={1} variant="body2" fontWeight={"bold"} color={primaryColorMapper[gemType]}>{name}</Typography>
                        {deltaBoosts.isZero() === false || omegaBoosts.isZero() === false ?
                            <Typography
                                variant="caption"
                                sx={{
                                    border: '1px solid #1E7E4C',
                                    borderRadius: '10px',
                                    padding: '5px 8px',
                                    backgroundColor: '#1E7E4C'
                                }}
                            >
                                Boost Available
                            </Typography>
                            :
                            <Box sx={{
                                padding: '5px 8px',
                                '::before': {
                                    content: '""',
                                    display: 'inline-block',
                                    height: '20px',
                                    width: '20px',
                                }
                            }} />
                        }
                    </Box>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        margin: theme.spacing(0.5, 0)
                    }}>
                        <Typography variant="body2" fontWeight={"600"}>Cost:</Typography>
                        <Typography variant="body2">
                            {ethers.utils.formatEther(gemConfig.price[1])} DEFO
                            +
                            {ethers.utils.formatEther(gemConfig.price[0])} DAI
                        </Typography>

                    </Box>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        margin: theme.spacing(0.5, 0)

                    }}>
                        <Typography variant="body2" fontWeight={"600"}>Reward:</Typography>
                        <Typography variant="body2" >{ethers.utils.formatEther(gemConfig.rewardAmountDefo)} DEFO/Week</Typography>
                    </Box>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        margin: theme.spacing(0.5, 0)
                    }}>
                        <Typography variant="body2" fontWeight={"600"}>Status:</Typography>
                        <Typography variant="body2">

                            {/* {+gemConfig.maxMintsPerLimitWindow - +(mintWindow.availableMintCount.toString())} / {gemConfig.maxMintsPerLimitWindow} */}
                            {+gemConfig.maxMintsPerLimitWindow - +(mintWindow.availableMintCount.toString()) > 0 ? "Available" : "Unavailable"}
                        </Typography>
                    </Box>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        margin: theme.spacing(0.5, 0)
                    }}>
                        <Typography variant="body2" fontWeight={"600"}>Refresh:</Typography>
                        <Typography variant="body2">{mintWindow.leftHours} hours</Typography>
                    </Box>
                    <Button
                        onClick={() => createYieldGem(gemType)}
                        variant='contained'
                        disabled={!gemConfig.isMintAvailable}
                        sx={{
                            color: "white",
                            backgroundColor: primaryColorMapper[gemType],
                            marginTop: theme.spacing(1),
                            "&:hover": {
                                backgroundColor: secondaryColorMapper[gemType],
                            }
                        }}
                    >CREATE</Button>
                </Paper>
            </Grid>
        </>
    )
}

export default YieldGemModalBox
