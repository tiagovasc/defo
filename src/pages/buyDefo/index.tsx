import { Box, Button, Container, Typography } from "@mui/material";
import Footer from "components/Footer";
import Navbar from "components/Navbar";
import Link from "next/link";
import { NextPage } from "next/types";

const BuyDefoWarningPage: NextPage = () => {

    return (
        <>
            <Navbar />
            <Container>
                <Box minHeight={'60vh'} textAlign='center'>
                    <Typography variant="h6">Read our whitepaper before buying the DEFO token so you understand how the protocol works.</Typography>

                    <Box mt={5}>
                        <a target="_blank" href="https://defo.app/whitepaper.pdf" rel="noopener noreferrer">
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                    color: "white",
                                    borderColor: "white",
                                    fontSize: '1.02rem',
                                    width: '260px',
                                    height: '55px',
                                    mr: 4,
                                    "&:hover": {
                                        color: "gray",
                                        borderColor: "gray",
                                    }
                                }}>
                                Read Whitepaper
                            </Button>
                        </a>

                        <a target="_blank" href="https://www.swapsicle.io/swap?outputCurrency=0xbb6ffece837a525a2eae033ff0161a7cdc60b693" rel="noopener noreferrer">
                            <Button
                                variant="outlined"
                                color="primary"
                                sx={{
                                    color: "white",
                                    borderColor: "white",
                                    fontSize: '1.02rem',
                                    width: '260px',
                                    height: '55px',
                                    "&:hover": {
                                        color: "gray",
                                        borderColor: "gray",
                                    }
                                }}>
                                Buy DEFO
                            </Button>
                        </a>
                    </Box>
                </Box>
            </Container>
            <Footer />
        </>
    )
}


export default BuyDefoWarningPage
