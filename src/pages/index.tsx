import {
    Box,
    CircularProgress,
    Container,
    Grid,
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import SimpleFooter from 'components/SimpleFooter';

const nftsBurned = 38;
const nftsAllocationIncrease = 11.76;

const cacheTimeoutInHours = 1; 

const Portfolio = () => {
    const [vaultWorth, setVaultWorth] = useState<number | null>(null);
    const [tokenDetails, setTokenDetails] = useState<{ name: string; ticker: string; value: number }[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const nftAmountMultiplier = nftsAllocationIncrease ? (nftsAllocationIncrease / 100) : 1;
    const formatNftAmount = (value: number) => `$${Intl.NumberFormat('en-US').format(Math.round(value + (value * nftAmountMultiplier)))}`;
    const formatVaultAmount = (value: number) => `$${Intl.NumberFormat('en-US').format(Math.round(value))}`;
    const formatTokenValue = (value: number) => `$${Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)}`;

    useEffect(() => {
        const cachedData = getCachedVaultWorth();
        if (cachedData) {
            setVaultWorth(cachedData.vaultWorth);
            setTokenDetails(cachedData.tokenDetails);
            setIsLoading(false);
        } else {
            fetchVaultWorth();
        }

        function fetchVaultWorth() {
            fetch('/api/vault-worth', { method: 'GET' })
                .then(res => res.json())
                .then(data => {
                    if (typeof data?.vaultWorth === 'number' && Array.isArray(data?.tokenDetails)) {
                        cacheVaultWorth(data.vaultWorth, data.tokenDetails);
                        setVaultWorth(data.vaultWorth);
                        setTokenDetails(data.tokenDetails);
                        setIsLoading(false);
                    }
                })
                .catch(error => console.error('Failed to fetch vault worth:', error));
        }

        function getCachedVaultWorth() {
            const cache = localStorage.getItem('vault-worth');
            if (cache) {
                const { timestamp, vaultWorth, tokenDetails } = JSON.parse(cache);
                const age = (Date.now() - timestamp) / (1000 * 60 * 60); // Convert age to hours
                if (age < cacheTimeoutInHours) {
                    console.log('Using cached data:', { vaultWorth, tokenDetails });
                    return { vaultWorth, tokenDetails };
                } else {
                    console.log('Cache is outdated.');
                    localStorage.removeItem('vault-worth');
                }
            }
            return null;
        }

        function cacheVaultWorth(vaultWorth, tokenDetails) {
            const cache = {
                timestamp: Date.now(),
                vaultWorth,
                tokenDetails
            };
            localStorage.setItem('vault-worth', JSON.stringify(cache));
        }
    }, []);

    return (
        <Box height={'100%'} minHeight={'100vh'} display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
            <Container>
                <Box textAlign={'center'}>
                    <img src="/logo_updated.png" alt="logo" width="150" height="150"/>
                    <Typography variant="h2" sx={{fontWeight: 500, color: 'white'}}>
                        DEFO
                    </Typography>
                    <Grid container textAlign="center" width={'100%'} spacing={0}
                          sx={{color: 'white', mt: 5, mb: 5}}>
                        <Grid item xs={6}>
                            <Typography variant="h4"
                                        sx={{textAlign: 'right', marginRight: '30px', marginBottom: '30px'}}>Vault
                                Worth:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h4"
                                        sx={{textAlign: 'left'}}>{vaultWorth != null ? formatVaultAmount(vaultWorth) :
                                <CircularProgress size={30}/>}</Typography>
                        </Grid>

                        {/* Container for token details with a bottom margin */}
                        <Grid container spacing={0} sx={{ mb: 2 }}>
                            {tokenDetails.length === 0 && isLoading ? (
                                
                                ['Loading...'].map((token, index) => (
                                    <Grid container key={index} spacing={0} sx={{ mb: 0 }}>
                                        <Grid item xs={6}>
                                            <Typography sx={{ textAlign: 'right', marginRight: '30px', fontWeight: 600 }}>
                                                {token}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography sx={{ textAlign: 'left' }}>
                                                <CircularProgress size={20}/>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                ))
                            ) : (
                                tokenDetails.map((token, index) => (
                                    <Grid container key={index} spacing={0} sx={{ mb: 0 }}>
                                        <Grid item xs={6}>
                                            <Typography sx={{ textAlign: 'right', marginRight: '30px', fontWeight: 600 }}>
                                                {token.name} ({token.ticker}):
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography sx={{ textAlign: 'left' }}>
                                                {isLoading ? <CircularProgress size={20}/> : formatTokenValue(token.value)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                ))
                            )}
                        </Grid>

                        <Grid item xs={6}>
                            <Typography
                                sx={{
                                    fontWeight: 600,
                                    textAlign: 'right',
                                    marginRight: '30px'
                                }}>Emerald:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography
                                sx={{textAlign: 'left'}}>{vaultWorth != null ? formatNftAmount(vaultWorth * 0.0135) :
                                <CircularProgress size={10}/>}</Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography
                                sx={{
                                    fontWeight: 600,
                                    textAlign: 'right',
                                    marginRight: '30px'
                                }}>Diamond:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography
                                sx={{textAlign: 'left'}}>{vaultWorth != null ? formatNftAmount(vaultWorth * 0.0045) :
                                <CircularProgress size={10}/>}</Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography
                                sx={{fontWeight: 600, textAlign: 'right', marginRight: '30px'}}>Ruby:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography
                                sx={{textAlign: 'left'}}>{vaultWorth != null ? formatNftAmount(vaultWorth * 0.0015) :
                                <CircularProgress size={10}/>}</Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography
                                sx={{
                                    fontWeight: 600,
                                    textAlign: 'right',
                                    marginRight: '30px'
                                }}>Sapphire:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography
                                sx={{textAlign: 'left'}}>{vaultWorth != null ? formatNftAmount(vaultWorth * 0.0005) :
                                <CircularProgress size={10}/>}</Typography>
                        </Grid>

                    </Grid>
                    {(nftsBurned || nftsAllocationIncrease) && (
                        <Typography
                            sx={{
                                color: 'gray',
                                textAlign: 'center'
                            }}>
                            {nftsBurned} NFTs burned 
                            <br />
                            Treasury allocation increased by {nftsAllocationIncrease}%
                        </Typography>
                    )}
                </Box>
            </Container>
            <SimpleFooter/>
        </Box>
    );
};

export default Portfolio;
