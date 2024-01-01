import {
    Box,
    CircularProgress,
    Container,
    Grid,
    Typography
} from '@mui/material';
import {useEffect, useState} from 'react';
import SimpleFooter from 'components/SimpleFooter';

const nftsBurned = 22 
const nftsAllocationIncrease = 4.47

const cacheTimeoutInMinutes = 30

const Portfolio = () => {
    const [vaultWorth, setVaultWorth] = useState<number | null>(null);

    const nftAmountMultiplier = nftsAllocationIncrease ? (nftsAllocationIncrease / 100) : 1
    const formatNftAmount = (value: number) => `$${Intl.NumberFormat().format(Math.round(value + (value * nftAmountMultiplier)))}`;
    const formatVaultAmount = (value: number) => `$${Intl.NumberFormat().format(Math.round(value))}`;

    useEffect(() => {
        const seshValueWorth = getVaultWorthSession()

        if(seshValueWorth) setVaultWorth(seshValueWorth)
        else fetchVaultWorth()

        function fetchVaultWorth() {
            fetch('/api/vault-worth', { 
                method: 'GET' 
            }).then((res) => {
                res.json().then((data) => {
                    if(typeof data?.vaultWorth === 'number') {
                        console.log(data)
                        saveVaultWorthSession(data.vaultWorth)
                        setVaultWorth(data.vaultWorth)
                    }
                })
            })
        }

        function getVaultWorthSession() {
            const tmp = sessionStorage.getItem('vault-worth')
            if(tmp) {
                const parsedTmp = JSON.parse(tmp)
                const { timestamp, value } = parsedTmp

                const validityMinutes = cacheTimeoutInMinutes
                const validityMs = validityMinutes * 60 * 1000
                const isNotExpired = Date.now() - timestamp < validityMs 
          
                if(isNotExpired) console.log(`Cached Value Worth: ${value}`)
                return isNotExpired ? value : undefined
            }
            return undefined
        }

        function saveVaultWorthSession(value) {
            sessionStorage.setItem('vault-worth', JSON.stringify({
                timestamp: Date.now(),
                value: value
            }))
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
    )
}

export default Portfolio
