import { Paper, Grid, Typography, useTheme } from "@mui/material"
import ContentBox from './ContentBox'
import { ethers } from "ethers"
import { useStatsContext } from "shared/context/StatsContext/StatsContextProvider"
import React from "react"
import { formatDecimalNumber } from "shared/utils/format"


export default React.memo(function DonationsBox()  {
    const theme = useTheme()
    const { donations, defoPrice } = useStatsContext()
    

    return (
        <ContentBox
            title="Donations"
            color="#FF3B5F"
        >
            <Grid
                container
                justifyContent={"space-between"}
                sx={{
                    height: "100%"
                }}
            >
                <Grid item xs={5.7}>
                    <Paper
                        sx={{
                            padding: {
                                xs: theme.spacing(1),
                                md: theme.spacing(2, 4)
                            },
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center"

                        }}>
                        {/* TOOD: get DEFO price */}
                        <Typography variant="body2">YOUR DONATIONS</Typography>
                        <Typography
                            sx={{ margin: theme.spacing(1, 0) }}
                            variant="h4"
                            fontWeight={"600"}
                        >
                            ${ formatDecimalNumber(+ethers.utils.formatEther(donations.userDonations)  * defoPrice, 2)}
                        </Typography>
                        {/* <Box sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center"
                        }}>
                            <Paper sx={{
                                display: "flex",
                                flexDirection: "row",
                                padding: theme.spacing(0.5),
                                marginRight: theme.spacing(1),
                                alignItems: "center",
                                backgroundColor: "rgba(46,190,115, 0.05)",
                                borderRadius: "5px"
                            }}>
                                <ArrowUpward
                                    sx={{
                                        fontSize: "12px",
                                        color: "#2EBE73"
                                    }}
                                />
                                <Typography sx={{
                                    fontSize: "12px",
                                    color: "#2EBE73"
                                }} >0%</Typography>
                            </Paper>
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    color: "gray"
                                }}
                            >last 7d</Typography>
                        </Box> */}
                    </Paper>
                </Grid>

                <Grid item xs={5.7}>
                    <Paper
                        sx={{
                            padding: {
                                xs: theme.spacing(1),
                                md: theme.spacing(2, 4)
                            },
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center"
                        }}>
                        <Typography variant="body2">TOTAL DONATIONS</Typography>
                        <Typography
                            sx={{ margin: theme.spacing(1, 0) }}
                            variant="h4"
                            fontWeight={"600"}
                        >   
                            
                            {/* {(+ethers.utils.formatEther(donations.totalDonations)).toFixed(3)} */}
                            ${ formatDecimalNumber(+ethers.utils.formatEther(donations.totalDonations)  * defoPrice, 2)}

                        </Typography>
                        {/* <Box sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center"
                        }}>
                            <Paper sx={{
                                display: "flex",
                                flexDirection: "row",
                                padding: theme.spacing(0.5),
                                marginRight: theme.spacing(1),
                                alignItems: "center",
                                backgroundColor: "rgba(46,190,115, 0.05)",
                                borderRadius: "5px"
                            }}>
                                <ArrowUpward
                                    sx={{
                                        fontSize: "12px",
                                        color: "#2EBE73"
                                    }}
                                />
                                <Typography sx={{
                                    fontSize: "12px",
                                    color: "#2EBE73"
                                }} >0%</Typography>
                            </Paper>
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    color: "gray"
                                }}
                            >last 7d</Typography>
                        </Box> */}
                    </Paper>
                </Grid>

            </Grid>
        </ContentBox>
    )
})