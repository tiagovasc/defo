import {Box, Button, Container, Grid, Paper, Typography, useTheme} from '@mui/material'
import type {NextPage} from 'next'
import Footer from 'components/Footer'
import {ACTIVE_NETOWORKS_COLLECTION, TAX_TIERS} from 'shared/utils/constants'
import {BigNumber, ethers} from 'ethers'
import {useEffect, useMemo, useState} from 'react'
import Navbar from 'components/Navbar'
import Head from 'next/head'
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import ContentBox from 'components/ContentBox'
import DonationsBox from 'components/DonationsBox'
import YieldGems from 'components/YieldGems/YieldGems';
import P2VaultBox from 'components/P2VaultBox'
import moment from 'moment'
import {useDiamondContext} from 'shared/context/DiamondContext/DiamondContextProvider'
import {Gem} from 'shared/types/DataTypes'
import {useGemsContext} from 'shared/context/GemContext/GemContextProvider'
import {InvalidNetworkView} from 'components/InvalidNetworkView/InvalidNetworkView'
import {useMoralis} from 'react-moralis'
import {ClaimModal} from 'components/ClaimModal/ClaimModal'
import {useWeb3} from 'shared/context/Web3/Web3Provider'
import {formatDecimalNumber} from 'shared/utils/format'
import {useStatsContext} from 'shared/context/StatsContext/StatsContextProvider'

const Home: NextPage = () => {
    const theme = useTheme()
    const {Moralis} = useMoralis()

    const {isWeb3Enabled, account, chainId} = useWeb3()
    const {diamondContract} = useDiamondContext()
    const {gemsCollection} = useGemsContext()
    const {defoPrice, protocolConfig} = useStatsContext()

    const [selectedRows, setSelectedRows] = useState<string[]>([])
    const [claimRewardsModalOpen, setClaimRewardsModalOpen] = useState(false)

    const handleCloseClaimModal = () => {
        setClaimRewardsModalOpen(false)
    }

    const claimRewardsDisabled = () => {
        const isActive = ((selectedRows.length !== 0 && chainId && ACTIVE_NETOWORKS_COLLECTION.includes(chainId)))
        const isClaimable = areSelectedGemsClaimable();

        return !isActive || !isClaimable;
        // return !isActive;
    }

    useEffect(() => {
        setSelectedRows([])
    }, [account])

    useEffect(() => {
        let unsubscribeOnAccountChange: any;

        if (isWeb3Enabled) {
            unsubscribeOnAccountChange = Moralis.onAccountChanged((account: any) => {
                setSelectedRows([])
            })
        }

        return () => {
            if (unsubscribeOnAccountChange) {
                unsubscribeOnAccountChange()
            }
        }
    }, [isWeb3Enabled])


    const areSelectedGemsClaimable = () => {
        if (selectedRows.length === 0) {
            return false;
        }

        // check if every gem is claimable
        return selectedRows.every((gemId: any) => {
            const gem: Gem = gemsCollection.find((gem: Gem) => gem.id == gemId);
            return gem.isClaimable === true;
        })
    }

    const columns = useMemo((): GridColDef[] => {
        return [
            {
                flex: 0.8,
                field: 'name',
                headerName: 'Name',
                minWidth: 90,
                renderCell: (params) => {
                    const gem: Gem = params.row;
                    const boosterText = gem.booster === 1 ? 'Delta' : gem.booster === 2 ? 'Omega' : '';
                    if (gem.gemTypeId === 0) {
                        return `${boosterText} Sapphire`
                    } else if (gem.gemTypeId === 1) {
                        return `${boosterText} Ruby`
                    } else if (gem.gemTypeId === 2) {
                        return `${boosterText} Diamond`
                    }
                }
            },
            {
                flex: 1,
                field: 'created',
                headerName: 'Created',
                renderCell: (params) => {
                    const gem: Gem = params.row;
                    return moment(gem.mintTime, 'X').format('MMM DD YYYY HH:mm')
                }
            },
            {
                flex: 1,
                field: 'rewards',
                headerName: 'Rewards',
                renderCell: (params) => {
                    const gem: Gem = params.row;
                    const amount = formatDecimalNumber(+ethers.utils.formatEther(gem.rewardAmount), 3)
                    return `${amount} DEFO`
                }
            },
            {
                flex: 0.8,
                field: 'taxTier',
                headerName: 'Tax Tier',
                renderCell: (params) => {
                    const gem: Gem = params.row;
                    if (!chainId) {
                        return <></>
                    }
                    return (
                        <Typography variant="body2">{TAX_TIERS[chainId][gem.taxTier.toString()]}</Typography>
                    )
                }
            },
            {
                flex: 0.8,
                field: 'tierCountdown',
                headerName: 'Next Tier',
                // maxWidth: 100,
                renderCell: (params) => {
                    const gem: Gem = params.row;
                    return gem.nextTierDaysLeft;
                }
            },
            {
                flex: 1,
                field: 'feesDueIn',
                headerName: 'Fee pay date', // Fees due in
                renderCell: (params) => {
                    const gem: Gem = params.row;
                    const todayDate = moment()
                    const isExpired = gem.maintenanceFeeUntil.isBefore(todayDate)
                    return <Typography
                        variant="body2"
                        style={{color: isExpired ? 'red' : ''}}
                    >
                        {gem.maintenanceFeeUntil.format('MMM DD YYYY')} {/* HH:mm */}
                    </Typography>
                }
            },
            {
                flex: 1.5,
                field: 'maintenanceFee',
                headerName: 'Maintenance Fee',
                maxWidth: 140,
                align: 'center',
                renderCell: (params) => {
                    const gem: Gem = params.row;

                    return (<Box sx={{}}>
                        {ethers.utils.formatEther(gem.gemMaintenanceFeeDai.mul(0))} DAI
                    </Box>)
                }
            },
            {
                flex: 0.7,
                field: 'payClaim',
                headerName: 'Pay/Claim',
                // minWidth: 100,
                renderCell: (params) => {
                    const gem: Gem = params.row;
                    return (<Box sx={{}}>
                        <Button
                            onClick={() => {
                                setSelectedRows([gem.id])
                                setClaimRewardsModalOpen(true)
                            }}
                            // disabled={!gem.isClaimable}
                            variant="contained"
                            color="primary"
                            sx={{
                                color: 'white',
                                borderColor: 'white',
                                '&:hover': {
                                    color: 'gray',
                                    borderColor: 'gray',
                                }
                            }}>CLAIM</Button>
                    </Box>)
                }
            },
        ]
    }, [chainId])

    return (
        <Box height={'100%'}>
            <Head>
                <title>DEFO</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
                {/* <link rel="shortcut icon" href="/logo.png" /> */}
            </Head>
            <Navbar/>
            {isWeb3Enabled ?
                <>
                    {(chainId && ACTIVE_NETOWORKS_COLLECTION.includes(chainId)) ?
                        <Container>
                            <Typography variant="h4" fontWeight={'bold'}>
                                Welcome Philanthropist!
                            </Typography>
                            <Typography variant="body1" color={'gray'}>
                                Ready to make the world a better place for the less fortunate?
                            </Typography>

                            {diamondContract ?
                                <>
                                    {/* Donations */}
                                    <Grid
                                        container
                                        justifyContent={'space-between'}
                                        sx={{
                                            margin: theme.spacing(8, 0),
                                        }}
                                    >
                                        <Grid item xs={12} md={5.8}>
                                            <DonationsBox/>
                                        </Grid>

                                        <Grid item xs={12} md={5.8}>
                                            <YieldGems/>
                                        </Grid>
                                    </Grid>

                                    {/* P2 Vault */}
                                    <Grid
                                        container
                                        justifyContent={'space-between'}
                                    >
                                        <Grid item xs={12} md={7.9}>
                                            <P2VaultBox/>
                                        </Grid>

                                        <Grid item xs={12} md={3.75}>
                                            <ContentBox
                                                title="Rewards"
                                                color="#FCBD00"
                                            >
                                                <Grid
                                                    container
                                                    justifyContent={'space-between'}
                                                >
                                                    <Grid item xs={12}>
                                                        <Paper
                                                            sx={{
                                                                padding: {
                                                                    xs: theme.spacing(2),
                                                                    md: theme.spacing(2, 4)
                                                                },
                                                            }}>
                                                            <Typography variant="body2">PENDING DEFO
                                                                REWARDS</Typography>
                                                            <Box display={'flex'} alignItems="center">
                                                                {(() => {
                                                                    const rewardAmount = +ethers.utils.formatEther(
                                                                        gemsCollection.reduce(
                                                                            (n: BigNumber, {rewardAmount}: Gem) => rewardAmount.add(n),
                                                                            BigNumber.from(0))
                                                                    )
                                                                    const price = formatDecimalNumber(+rewardAmount * defoPrice, 2)

                                                                    return (
                                                                        <>
                                                                            <Typography
                                                                                sx={{margin: theme.spacing(1, 0)}}
                                                                                variant="h4" fontWeight={'600'}>
                                                                                {formatDecimalNumber(rewardAmount, 3)}
                                                                            </Typography>
                                                                            <Typography ml={1} variant="h6">
                                                                                (${price})
                                                                            </Typography>
                                                                        </>
                                                                    )
                                                                })()}
                                                            </Box>
                                                        </Paper>
                                                    </Grid>
                                                </Grid>
                                            </ContentBox>
                                        </Grid>

                                    </Grid>

                                    {/* GEM Table */}
                                    <Box
                                        sx={{
                                            margin: theme.spacing(8, 0)
                                        }}
                                    >

                                        <Grid container alignItems={'center'}>
                                            <Grid item xs={12} md="auto">
                                                <Typography>{selectedRows?.length || 0} nodes selected</Typography>
                                            </Grid>
                                            <Grid item>
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    // disabled={claimRewardsDisabled()}
                                                    onClick={
                                                        () => setClaimRewardsModalOpen(true)
                                                    }
                                                    variant="contained"
                                                    color="primary"
                                                    sx={{
                                                        color: 'white',
                                                        borderColor: 'white',
                                                        marginLeft: theme.spacing(1),
                                                        '&:hover': {
                                                            color: 'gray',
                                                            borderColor: 'gray',
                                                        }
                                                    }}>CLAIM REWARDS</Button>
                                            </Grid>
                                        </Grid>


                                        <Box sx={{
                                            height: '400px',
                                            marginTop: theme.spacing(2)
                                        }}>
                                            <DataGrid
                                                rows={gemsCollection}
                                                columns={columns}
                                                pageSize={5}
                                                rowsPerPageOptions={[5]}
                                                checkboxSelection
                                                hideFooterSelectedRowCount
                                                selectionModel={selectedRows}
                                                onSelectionModelChange={(newSelection: any) => {
                                                    setSelectedRows(newSelection);
                                                }}
                                                disableSelectionOnClick
                                                disableColumnFilter
                                                disableColumnMenu
                                                disableColumnSelector
                                                rowHeight={59}
                                                sx={{
                                                    border: 'none',
                                                    '.MuiDataGrid-columnHeaders': {
                                                        border: 'none'
                                                    },
                                                    '.MuiDataGrid-virtualScrollerContent': {
                                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                                        borderRadius: '10px'
                                                    },
                                                    '& .Mui-checked': {
                                                        color: '#2EBE73 !important',
                                                    }
                                                }}
                                            />
                                        </Box>

                                    </Box>
                                </>
                                :
                                <div>Please Connect using metamask</div>
                            }
                        </Container>
                        :
                        <InvalidNetworkView/>
                    }
                </>
                :
                <Box height="70%" textAlign={'center'}>
                    <h3>Connect your Metamask Wallet</h3>
                </Box>
            }
            <Footer/>

            {/* Claim Modal */}
            <ClaimModal
                selectedRows={selectedRows}
                isOpen={claimRewardsModalOpen}
                closeModal={handleCloseClaimModal}
            />
        </Box>
    )
}

export default Home
