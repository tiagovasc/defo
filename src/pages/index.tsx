import {
    Box,
    CircularProgress,
    Container,
    Grid,
    Typography
} from '@mui/material';
import {useEffect, useState} from 'react';
import SimpleFooter from 'components/SimpleFooter';

const nftsBurned = 12 
const nftsAllocationIncrease = 4

const zerionUrl = 'https://api.zerion.io/v1/wallets/0xf99d8717c3c2bb5a4959fab7f152eddee56580e2/portfolio?currency=usd'
const zerionAuth = 'Basic emtfZGV2X2E4NmQ4MzVmMWNmNDRlMmVhMTc5MWYyZTNjZjI0NmE4OnprX2Rldl9hODZkODM1ZjFjZjQ0ZTJlYTE3OTFmMmUzY2YyNDZhOA=='

const thornodeAmountUrl = 'https://thornode.ninerealms.com/bank/balances/thor1s65q3qky0z003f9k7gzv7scutmkr7j0qpfrd0n'
const thornodePriceUrl = 'https://midgard.ninerealms.com/v2/stats'

const solanaAuth = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjExMTg3ZGUwLTc4MTItNGE3OS04ZjdjLWJlNDAwYTE2ZDg2MyIsIm9yZ0lkIjoiMzY1NTE1IiwidXNlcklkIjoiMzc1NjUzIiwidHlwZUlkIjoiMmY4MTdiNGMtNzA3MC00ZGJkLTk4OGItMGFhY2Q5NGJhZGE2IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDA3MzYwODQsImV4cCI6NDg1NjQ5NjA4NH0.WdqZAs3euBEvVHZz658m6xgKAN37Nf2Qk99IeqLlhI0'
const solanaAmountUrl = 'https://solana-gateway.moralis.io/account/mainnet/FtoHuLxaYDZXH1ESsU3EDbZSuFa3G1WKMSLBZdru5xYL/balance' 
const solanaPriceUrl = 'https://solana-gateway.moralis.io/token/mainnet/So11111111111111111111111111111111111111112/price'

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
            fetch(zerionUrl, {
                headers: {
                  accept: 'application/json',
                  authorization: zerionAuth
                },
                method: 'GET'
            }).then((res) => {
                res.json().then(
                    (datamain) => {
                        let zerionWorth = datamain.data.attributes.total.positions;
                        console.log(`zerionWorth: ${zerionWorth}`);
                        fetch(thornodeAmountUrl, {
                            'headers': {
                                'accept': 'application/json, text/plain, */*',
                                'accept-language': 'en-US,en;q=0.9',
                                'sec-ch-ua': '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
                                'sec-ch-ua-mobile': '?1',
                                'sec-ch-ua-platform': '"Android"',
                                'sec-fetch-dest': 'empty',
                                'sec-fetch-mode': 'cors',
                                'sec-fetch-site': 'cross-site'
                            },
                            'referrer': 'https://thorchain.net/',
                            'referrerPolicy': 'strict-origin-when-cross-origin',
                            'body': null,
                            'method': 'GET',
                            'mode': 'cors',
                            'credentials': 'omit'
                        }).then((res) => res.json().then((data) => {
                            const runAmount = data.result[0].amount / 100000000
                            console.log(`runAmount: ${runAmount}`)

                            fetch(thornodePriceUrl, {
                                method: 'GET'
                            }).then((res) => res.json().then((info) => {
                                let thorPrice = Number(info.runePriceUSD);
                                let thorWorth = (runAmount * thorPrice);
                                console.log(`thorPrice: ${thorPrice}`)
                                console.log(`thorWorth: ${thorWorth}`)

                                fetch(solanaAmountUrl, {
                                    method:'GET',
                                    headers: {
                                        accept: 'application/json',
                                        'x-api-key': solanaAuth
                                    }
                                }).then((res) => res.json().then((data) => {
                                    let solanaAmount = Number(data.solana)
                                    console.log(`solanaAmount: ${solanaAmount}`)

                                    fetch(solanaPriceUrl, {
                                        method: 'GET',
                                        headers: {
                                            accept: 'application/json',
                                            'x-api-key': solanaAuth 
                                        }
                                    }).then((res) => res.json().then((data) => {
                                        let solanaPrice = Number(data.usdPrice)                                                                                        
                                        let solanaWorth = solanaAmount * solanaPrice
                                        console.log(`solanaPrice: ${solanaPrice}`)
                                        console.log(`solanaWorth: ${solanaWorth}`)

                                        let freshVaultWorth = zerionWorth + thorWorth + solanaWorth
                                        console.log(`Fresh Vault Worth: ${freshVaultWorth}`)
                                        saveVaultWorthSession(freshVaultWorth)
                                        setVaultWorth(freshVaultWorth)
                                    }))
                                }))
                            }));
                        }));
                    })
            });
        }

        function getVaultWorthSession() {
            const tmp = sessionStorage.getItem('vault-worth')
            if(tmp) {
                const parsedTmp = JSON.parse(tmp)
                const { timestamp, value } = parsedTmp

                const validityMinutes = 30
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
