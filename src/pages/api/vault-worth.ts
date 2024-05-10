const zerionUrl = 'https://api.zerion.io/v1/wallets/0x1bdb97985913d699b0fbd1aacf96d1f855d9e1d0/portfolio?currency=usd'
const zerionAuth = 'Basic emtfZGV2X2E4NmQ4MzVmMWNmNDRlMmVhMTc5MWYyZTNjZjI0NmE4OnprX2Rldl9hODZkODM1ZjFjZjQ0ZTJlYTE3OTFmMmUzY2YyNDZhOA=='

const thornodeAmountUrl = 'https://thornode.ninerealms.com/bank/balances/thor1s65q3qky0z003f9k7gzv7scutmkr7j0qpfrd0n'
const thornodePriceUrl = 'https://midgard.ninerealms.com/v2/stats'

const solanaAuth = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjExMTg3ZGUwLTc4MTItNGE3OS04ZjdjLWJlNDAwYTE2ZDg2MyIsIm9yZ0lkIjoiMzY1NTE1IiwidXNlcklkIjoiMzc1NjUzIiwidHlwZUlkIjoiMmY4MTdiNGMtNzA3MC00ZGJkLTk4OGItMGFhY2Q5NGJhZGE2IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDA3MzYwODQsImV4cCI6NDg1NjQ5NjA4NH0.WdqZAs3euBEvVHZz658m6xgKAN37Nf2Qk99IeqLlhI0'
const solanaAmountUrl = 'https://solana-gateway.moralis.io/account/mainnet/FtoHuLxaYDZXH1ESsU3EDbZSuFa3G1WKMSLBZdru5xYL/balance' 
const solanaPriceUrl = 'https://solana-gateway.moralis.io/token/mainnet/So11111111111111111111111111111111111111112/price'

export default async function handler(req, handlerRes) {
  // Handle the GET request
  if (req.method === 'GET') {
    // You can perform any logic here before sending the response
    try {
            await fetch(zerionUrl, {
                headers: {
                  accept: 'application/json',
                  authorization: zerionAuth
                },
                method: 'GET'
            }).then(async(res) => {
                await res.json().then(
                    async(datamain) => {
                        let zerionWorth = datamain.data.attributes.total.positions;
                        console.log(`zerionWorth: ${zerionWorth}`);
                        await fetch(thornodeAmountUrl, {
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
                        }).then(async (res) => res.json().then(async (data) => {
                            const runAmount = data.result[0].amount / 100000000
                            console.log(`runAmount: ${runAmount}`)

                            await fetch(thornodePriceUrl, {
                                method: 'GET'
                            }).then(async(res) => res.json().then(async(info) => {
                                let thorPrice = Number(info.runePriceUSD);
                                let thorWorth = (runAmount * thorPrice);
                                console.log(`thorPrice: ${thorPrice}`)
                                console.log(`thorWorth: ${thorWorth}`)

                                await fetch(solanaAmountUrl, {
                                    method:'GET',
                                    headers: {
                                        accept: 'application/json',
                                        'x-api-key': solanaAuth
                                    }
                                }).then(async(res) => res.json().then(async(data) => {
                                    let solanaAmount = Number(data.solana)
                                    console.log(`solanaAmount: ${solanaAmount}`)

                                    await fetch(solanaPriceUrl, {
                                        method: 'GET',
                                        headers: {
                                            accept: 'application/json',
                                            'x-api-key': solanaAuth 
                                        }
                                    }).then(async(res) => res.json().then((data) => {
                                        let solanaPrice = Number(data.usdPrice)                                                                                        
                                        let solanaWorth = solanaAmount * solanaPrice
                                        console.log(`solanaPrice: ${solanaPrice}`)
                                        console.log(`solanaWorth: ${solanaWorth}`)

                                        let vaultWorth = zerionWorth + thorWorth + solanaWorth
                                        console.log(`Fresh Vault Worth: ${vaultWorth}`)
                                        handlerRes.status(200).json({ 
                                            vaultWorth, zerionWorth, runAmount, thorPrice, thorWorth, solanaAmount, solanaPrice, solanaWorth
                                        })
                                    }))
                                }))
                            }));
                        }));
                    })
            });
    } catch(err) {
        handlerRes.status(400).json({ message: 'Something went wrong.' });
    }
    // Send a JSON response
  } else {
    // Handle other HTTP methods
    handlerRes.status(405).json({ error: 'Method Not Allowed' });
  }
}
