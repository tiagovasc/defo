import { Close, HelpOutline } from '@mui/icons-material'
import { Paper, IconButton, Grid, Typography, Box, Tooltip, Button, Modal, useTheme } from '@mui/material'
import ContentBox from 'components/ContentBox'
import { ethers, BigNumber, Contract } from 'ethers'
import { useMemo, useState } from 'react'
import { useDiamondContext } from 'shared/context/DiamondContext/DiamondContextProvider'
import { useGemsContext } from 'shared/context/GemContext/GemContextProvider'
import { useSnackbar } from 'shared/context/Snackbar/SnackbarProvider'
import { useStatsContext } from 'shared/context/StatsContext/StatsContextProvider'
import { useWeb3 } from 'shared/context/Web3/Web3Provider'
import { Gem } from 'shared/types/DataTypes'
import { GEM_TYPE_NAMES, SUPPORTED_NETWORKS } from 'shared/utils/constants'
import { formatDecimalNumber } from 'shared/utils/format'


export const ClaimModal = ({
    selectedRows,
    isOpen,
    closeModal
}: { selectedRows: any, isOpen: boolean, closeModal: () => void }) => {
    const { gemsCollection, updateGemsCollection } = useGemsContext()
    const { diamondContract, config } = useDiamondContext()
    const {
        updateDonations, updateStake,
        protocolConfig,
        defoPrice,
    } = useStatsContext()
    const { chainId, account, signer } = useWeb3()

    const snackbar = useSnackbar()
    const theme = useTheme()

    const [selectedVaultStrategy, setSelectedVaultStrategy] = useState(20)


    // CORE
    const handlePayFee = async (gemIds: string[]) => {
        const selectedGems = gemsCollection.filter((gem: Gem) => gemIds.includes(gem.id))
        const gemsToPayMaint = selectedGems.filter((gem: Gem) => !gem.pendingMaintenanceFee.isZero())
        try {
            ///todo avoid code copy, this is a quickfix for maintenance for presold gems
            const dai = new Contract(config.deployments?.dai.address, config.deployments.dai.abi, signer)
            const daiAllowance = await dai.allowance(account, config.deployments.diamond.address)
            if (daiAllowance.isZero()) {
                const tx = await dai.approve(config.deployments.diamond.address, ethers.constants.MaxUint256)
                await tx.wait()
            }
            const tx = await diamondContract.batchMaintain(gemIds);
            snackbar.execute('Paying Maintenance Fee on progress, please wait.', 'info')
            await tx.wait()
            await updateDonations()
            await updateGemsCollection()
            // closeModal()
        } catch (error: any) {
            console.log('ERROR while paying the fee');
            snackbar.execute(error?.data?.message || error?.message || error?.error?.message || error?.reason || 'ERROR', 'error')
        }
    }

    const handleBatchClaimRewards = async (gemIds: string[]) => {
        if (!areSelectedGemsClaimable()) {
            snackbar.execute('Selected gem/s are not eligable for claim yet or fee is not paid', 'error');
            return
        }

        try {
            const tx = gemIds.length === 1 ? await diamondContract.claimReward(gemIds[0]) : await diamondContract.batchClaimReward(gemIds);
            snackbar.execute('Claiming on progress, please wait.', 'info')
            await tx.wait()
            await updateDonations()
            await updateGemsCollection()
            closeModal()
        } catch (error: any) {
            console.log(error)
            snackbar.execute(error?.data?.message || error?.message || error?.error?.message || error?.reason || 'ERROR', 'error')
        }
    }

    const handleAddToVaultStrategy = async (gemIds: string[], vaultStrategyPercentage: number) => {
        if (!areSelectedGemsClaimable()) {
            snackbar.execute('Selected gem/s are not eligable for claim yet or fee is not paid', 'error');
            return
        }

        try {
            const addToVaultAndClaimTx = await diamondContract.batchStakeAndClaim(gemIds, vaultStrategyPercentage * 100);
            snackbar.execute('Adding to the vault on progress, please wait.', 'info')
            await addToVaultAndClaimTx.wait()
            await updateDonations()
            await updateStake()
            await updateGemsCollection()
            closeModal()
        } catch (error: any) {
            console.log(error)
            snackbar.execute(error?.error?.message || error?.data?.message || error?.reason || 'ERROR', 'error')
        }
    }

    const handleAddToVault = async (gemIds: string[], vaultStrategyPercentage: number) => {
        if (!areSelectedGemsClaimable()) {
            snackbar.execute('Selected gem/s are not eligable for claim yet or fee is not paid', 'error');
            return
        }

        try {
            const selectedGems = gemsCollection.filter((gem: Gem) => gemIds.includes(gem.id))
            const gemAmounts = gemIds.map((gemId: string) => {
                const currentGem = selectedGems.find((gem: Gem) => gem.id === gemId)
                const amount = currentGem.rewardAmount.div(100).mul(vaultStrategyPercentage)
                return amount;
            })

            const addToVaultTx = await diamondContract.batchStakeReward(gemIds, gemAmounts);
            snackbar.execute('Adding to the vault on progress, please wait.', 'info')
            await addToVaultTx.wait()
            await updateDonations()
            await updateStake()
            await updateGemsCollection()
            closeModal()
        } catch (error: any) {
            console.log(error)
            snackbar.execute(error?.error?.message || error?.data?.message || error?.reason || 'ERROR', 'error')
        }
    }


    // HELPERS
    const areSelectedGemsClaimable = () => {
        return gemsCollection
            .filter((gem: Gem) => selectedRows.includes(gem.id))
            .some((gem: Gem) => gem.isClaimable)
    }

    const shouldSelectedGemsPayMaintFee = () => {
        return !gemsCollection
            .filter((gem: Gem) => selectedRows.includes(gem.id))
            .some((gem: Gem) => !gem.pendingMaintenanceFee.isZero());
    }

    const pendingRewards = useMemo(() => {
        return gemsCollection
            .filter((gem: Gem) => selectedRows.includes(gem.id))
            .reduce(
                (
                    n: BigNumber,
                    { rewardAmount }: Gem
                ) => {
                    return rewardAmount.add(n)
                },
                BigNumber.from(0)
            )
    }, [gemsCollection, selectedRows])

    const charityTax = useMemo(() => {
        return gemsCollection
            .filter((gem: Gem) => selectedRows.includes(gem.id))
            .reduce(
                (
                    n: BigNumber,
                    { rewardAmount }: Gem
                ) => rewardAmount.add(n),
                BigNumber.from(0)
            ).div(100).mul(5)
    }, [gemsCollection, selectedRows])

    const tierTax = useMemo(() => {
        return gemsCollection
            .filter((gem: Gem) => selectedRows.includes(gem.id))
            .reduce(
                (
                    n: BigNumber,
                    { rewardAmount, taxTier }: Gem
                ) => {
                    // if (taxTier === 0) {
                    //     return n.add(BigNumber.from(0))
                    // }
                    const taxTierPercentage = +(protocolConfig.taxRates[taxTier].toString()) / 100
                    const calculatedAmount = rewardAmount.div(100).mul(taxTierPercentage)
                    return n.add(calculatedAmount)
                },
                BigNumber.from(0)
            )
    }, [gemsCollection, selectedRows])

    const pendingMaintenanceFee = useMemo(() => {
        return gemsCollection
            .filter((gem: Gem) => selectedRows.includes(gem.id))
            .reduce(
                (
                    n: BigNumber,
                    { pendingMaintenanceFee }: Gem
                ) => pendingMaintenanceFee.add(n),
                BigNumber.from(0)
            )
    }, [gemsCollection, selectedRows])

    const maintenanceFee = useMemo(() => {
        return gemsCollection
            .filter((gem: Gem) => selectedRows.includes(gem.id))
            .reduce(
                (
                    n: BigNumber,
                    { gemMaintenanceFeeDai }: Gem
                ) => gemMaintenanceFeeDai.add(n),
                BigNumber.from(0)
            )
    }, [gemsCollection, selectedRows])

    const claimableAmount = useMemo(() => {
        return pendingRewards.sub(tierTax.add(charityTax))
    }, [gemsCollection, selectedRows])

    const handleTransferGem = async (gemIds: string[]) => {
        if (gemIds.length === 0) {
            return;
        }
        try {
            const tx = await diamondContract.batchtransferToStabilizer(gemIds)
            snackbar.execute('Transfer is executing, please wait', 'info')
            await tx.wait()
            await updateDonations()
            await updateStake()
            await updateGemsCollection()
        } catch (error: any) {
            console.log('Error while transfer gem');
            console.log(error);
            snackbar.execute(error?.data?.message || error?.message || error?.error?.message || error?.reason || 'ERROR', 'error')
        }
    }

    const displayMaintFeeForGems = () => {
        const selectedGems = gemsCollection.filter((gem: Gem) => selectedRows.includes(gem.id))

        return (
            <Box>
                {selectedGems.map((gem: Gem) => {
                    const boosterText = gem.booster === 1 ? 'Delta' : gem.booster === 2 ? 'Omega' : '';
                    const isGemFeePaid = gem.pendingMaintenanceFee.isZero()
                    return (
                        <Box key={gem.id} display="flex" justifyContent={'space-between'}>
                            <Typography variant="body2" mr={2} mb={0.5} sx={{ color: isGemFeePaid ? '#2EBE73' : 'red' }}>
                                {`${boosterText} ${GEM_TYPE_NAMES[gem.gemTypeId]}`}
                                :
                            </Typography>
                            <Typography variant="body2">
                                {formatDecimalNumber(+ethers.utils.formatEther(gem.gemMaintenanceFeeDai), 2)} DAI
                            </Typography>
                        </Box>
                    )
                })}
                <Box mt={1}>
                    <Box display="flex" justifyContent={'space-between'}>
                        {/* <Typography variant="body1" fontWeight={"bold"} mr={1}>
                            Due now:
                        </Typography>
                        <Typography variant="body1" fontWeight={"bold"}>
                            0.00 DAI
                        </Typography> */}
                    </Box>
                    <Box display="flex" justifyContent={'space-between'}>
                        <Typography variant="body1" fontWeight={'bold'} mr={1}>
                            Total:
                        </Typography>
                        <Typography variant="body1" fontWeight={'bold'}>
                            {formatDecimalNumber(+ethers.utils.formatEther(maintenanceFee), 2)} DAI
                        </Typography>
                    </Box>
                </Box>
            </Box>
        )
    }

    return (
        <Modal
            open={isOpen}
            onClose={() => closeModal()}
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}
            BackdropProps={{
                sx: {
                    backdropFilter: 'blur(3px)',
                    backgroundColor: 'rgba(0,0,30,0.4)'
                }
            }}
        >
            <Paper
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '50%',
                    width: {
                        xs: '90%',
                        md: '55%'
                    },
                    backgroundColor: '#1f1d2b',
                    padding: theme.spacing(4),
                    position: 'relative',
                    overflow: 'hidden',
                    outline: 0,
                    border: 'solid 1px rgba(255,255,255,0.1)',
                    borderRadius: '20px'
                }}>
                <IconButton
                    onClick={() => closeModal()}
                    sx={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        backgroundColor: theme.palette.primary.main,
                        '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                        },
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        borderTopRightRadius: '10%'
                    }}>
                    <Close />
                </IconButton>
                <ContentBox
                    title="Claim Rewards"
                    color="#03AC90"
                >
                    <Grid
                        container
                        justifyContent={'space-between'}
                        alignItems="start"
                    >

                        <Grid item xs={12} md={5.5} mb={5}>
                            <Typography variant="body1">PENDING REWARDS</Typography>
                            <Grid container alignItems="center">
                                <Grid item>
                                    <Typography
                                        variant="h4"
                                        fontWeight={'500'}
                                        sx={{
                                            marginRight: theme.spacing(1)
                                        }}>
                                        {formatDecimalNumber(+ethers.utils.formatEther(pendingRewards), 3)} DEFO</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="h6" fontWeight={'500'}>
                                        (${formatDecimalNumber(+ethers.utils.formatEther(pendingRewards) * defoPrice, 2)})
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={5.5}>
                            <Box sx={{ textAlign: 'end' }}>
                                <Tooltip
                                    title="All pending rewards will be claimed to your wallet after taxes are deducted.">
                                    <span>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            endIcon={<HelpOutline />}
                                            onClick={() => handleBatchClaimRewards(selectedRows)}
                                            disabled={!areSelectedGemsClaimable()}
                                            sx={{
                                                width: 'auto',
                                                marginLeft: {
                                                    xs: theme.spacing(0),
                                                    md: theme.spacing(2)
                                                },
                                                marginRight: theme.spacing(1),

                                            }}>CLAIM</Button>
                                    </span>
                                </Tooltip>

                                <Tooltip
                                    title="This will put all your available rewards in the Vault, with 0% claim tax.">
                                    <span>
                                        <Button
                                            onClick={() => handleAddToVault(selectedRows, 100)}
                                            disabled={!areSelectedGemsClaimable()}
                                            variant="outlined"
                                            color={'info'}
                                            endIcon={<HelpOutline />}
                                            sx={{
                                                color: 'white',
                                                borderColor: 'white',
                                                width: 'auto',
                                                '&:hover': {
                                                    color: 'gray',
                                                    borderColor: 'gray',
                                                }
                                            }}>VAULT</Button>
                                    </span>
                                </Tooltip>

                                <Button
                                    onClick={() => handlePayFee(selectedRows)}
                                    disabled={shouldSelectedGemsPayMaintFee()}
                                    variant="contained"
                                    color="secondary"
                                    sx={{
                                        mt: 2,
                                        width: 245,
                                        backgroundColor: '#FCBD00',
                                        '&:hover': {
                                            backgroundColor: '#b58802',
                                        }
                                    }}
                                >
                                    Pay Maintenance fee
                                </Button>
                                <Box display={'flex'} justifyContent="end" mt={1.5}>
                                    {/* { displayMaintFeeForGems() } */}
                                    <>
                                        <Typography fontWeight={'bold'} variant="body2" mr={6}>Maintenance
                                            Fee:</Typography>
                                        <Typography variant="body2">
                                            {formatDecimalNumber(+ethers.utils.formatEther(pendingMaintenanceFee), 2)} DAI
                                        </Typography>
                                    </>
                                </Box>
                            </Box>
                            <Box>

                            </Box>
                        </Grid>
                        <Grid item xs={12} md={5.5} mb={5}>
                            <Grid container justifyContent={'space-between'}>
                                <Grid>
                                    <Typography fontWeight={'bold'} variant="body2">CHARITY TAX:</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body2">
                                        {(() => {
                                            const formattedAmount = ethers.utils.formatEther(charityTax)
                                            const price = formatDecimalNumber(+formattedAmount * defoPrice, 2)
                                            return <>{`${formatDecimalNumber(+formattedAmount, 3)} DEFO ($${price})`}</>
                                        })()}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Grid container justifyContent={'space-between'}>
                                <Grid item>
                                    <Typography fontWeight={'bold'} variant="body2">CLAIM TAX TIER:</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body2" ml={0.2}>
                                        {(() => {
                                            const formattedAmount = ethers.utils.formatEther(tierTax)
                                            const price = formatDecimalNumber(+formattedAmount * defoPrice, 2)
                                            if (+formattedAmount < 0) {
                                                return <>0.00 DEFO</>
                                            }
                                            return <>{`${formatDecimalNumber(+formattedAmount, 3)} DEFO ($${price})`}</>
                                        })()}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <hr />
                            <Grid container justifyContent={'space-between'}>
                                <Grid item>
                                    <Typography fontWeight={'bold'} variant="body2">CLAIMABLE:</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body2">
                                        {(() => {
                                            const formattedAmount = ethers.utils.formatEther(claimableAmount)
                                            const price = formatDecimalNumber(+formattedAmount * defoPrice, 2)
                                            if (+formattedAmount < 0) {
                                                return <>0.00 DEFO</>
                                            }
                                            return <>{`${formatDecimalNumber(+formattedAmount, 3)} DEFO ($${price})`}</>
                                        })()}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Vault Strategy */}
                        <Grid item xs={12} md={12}>

                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '200px',
                                // alignItems: "center",
                                marginBottom: theme.spacing(2)
                            }}>
                                {/* <Tooltip
                                    title="Do not use this feature unless you have talked with the DEFO team. This is only meant to be used for compromised wallets. You will lose your NFTs">
                                    <Button
                                        onClick={() => handleTransferGem(selectedRows)}
                                        variant="contained"
                                        color="primary"
                                        endIcon={<HelpOutline/>}
                                        sx={{
                                            color: 'white',
                                            borderColor: 'white',
                                            marginBottom: '20px',
                                            padding: 1,
                                            '&:hover': {
                                                color: 'gray',
                                                borderColor: 'gray',
                                            }
                                        }}>Transfer Gem</Button>

                                </Tooltip> */}
                                <Tooltip
                                    title="This will send the selected percentage towards the Vault and the rest will be claimed.">
                                    <Button
                                        onClick={() => handleAddToVaultStrategy(selectedRows, selectedVaultStrategy)}
                                        variant="outlined"
                                        endIcon={<HelpOutline />}
                                        color={'info'}
                                        sx={{
                                            padding: 1,
                                        }}
                                    >Hybrid Vault ({selectedVaultStrategy}%)</Button>
                                </Tooltip>
                            </Box>


                            {/* percentage list */}
                            <Grid
                                container
                                justifyContent={'space-between'}
                            >
                                <Grid item md={2.8}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        onClick={() => setSelectedVaultStrategy(20)}
                                        color={selectedVaultStrategy === 20 ? 'info' : 'primary'}
                                        sx={selectedVaultStrategy === 20 ? {
                                            borderRadius: '10px',
                                            padding: theme.spacing(1, 2),
                                            borderWidth: '2px',
                                            '&:hover': {
                                                borderWidth: '2px'
                                            }
                                        } : {
                                            color: 'white',
                                            borderColor: 'white',
                                            borderRadius: '10px',
                                            padding: theme.spacing(1, 2),
                                            '&:hover': {
                                                color: 'gray',
                                                borderColor: 'gray',
                                            }
                                        }}>20%</Button>
                                </Grid>

                                <Grid item md={2.8}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        onClick={() => setSelectedVaultStrategy(40)}
                                        color={selectedVaultStrategy === 40 ? 'info' : 'primary'}
                                        sx={selectedVaultStrategy === 40 ? {
                                            borderRadius: '10px',
                                            padding: theme.spacing(1, 2),
                                            borderWidth: '2px',
                                            '&:hover': {
                                                borderWidth: '2px'
                                            }
                                        } : {
                                            color: 'white',
                                            borderColor: 'white',
                                            borderRadius: '10px',
                                            padding: theme.spacing(1, 2),
                                            '&:hover': {
                                                color: 'gray',
                                                borderColor: 'gray',
                                            }
                                        }}>40%</Button>
                                </Grid>

                                <Grid item md={2.8}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        onClick={() => setSelectedVaultStrategy(60)}
                                        color={selectedVaultStrategy === 60 ? 'info' : 'primary'}
                                        sx={selectedVaultStrategy === 60 ? {
                                            borderRadius: '10px',
                                            padding: theme.spacing(1, 2),
                                            borderWidth: '2px',
                                            '&:hover': {
                                                borderWidth: '2px'
                                            }
                                        } : {
                                            color: 'white',
                                            borderColor: 'white',
                                            borderRadius: '10px',
                                            padding: theme.spacing(1, 2),
                                            '&:hover': {
                                                color: 'gray',
                                                borderColor: 'gray',
                                            }
                                        }}>60%</Button>
                                </Grid>

                                <Grid item md={2.8}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        onClick={() => setSelectedVaultStrategy(80)}
                                        color={selectedVaultStrategy === 80 ? 'info' : 'primary'}
                                        sx={selectedVaultStrategy === 80 ? {
                                            borderRadius: '10px',
                                            padding: theme.spacing(1, 2),
                                            borderWidth: '2px',
                                            '&:hover': {
                                                borderWidth: '2px'
                                            }
                                        } : {
                                            color: 'white',
                                            borderColor: 'white',
                                            borderRadius: '10px',
                                            padding: theme.spacing(1, 2),
                                            '&:hover': {
                                                color: 'gray',
                                                borderColor: 'gray',
                                            }
                                        }}>80%</Button>
                                </Grid>

                            </Grid>

                        </Grid>

                    </Grid>
                </ContentBox>

            </Paper>
        </Modal>
    )
}
