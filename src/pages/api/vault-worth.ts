declare module 'pulsar_sdk_js';

import { PulsarSDK, ChainKeys } from 'pulsar_sdk_js';

const chains = [ChainKeys.ETHEREUM, ChainKeys.ARBITRUM];
const responses_list: any[] = [];
const wallet_addr = '0x1bdb97985913d699b0fbd1aacf96d1f855d9e1d0';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZWFtX2lkIjoiNjY0MjAwYzQ3YmU0MGJkMjhhMTJkNzE2Iiwia2V5X2dlbmVyYXRlZF9hdCI6MTcxNTYwMTYyMC45OTgwNzgzfQ.-ZqUbth4UylmACODsG6CT2lHR074f73XTFXvhnThtHw';
const sdk = new PulsarSDK(API_KEY);

interface Token {
  denom: string;
  name: string;
  chain_properties: {
    chain: string;
  };
}

interface Balance {
  usd_value: string;
  token: Token;
}

interface TokenInfo {
  name: string;
  platforms: Set<string>;
  usd_value: number;
}

async function getWalletBalances(chain: string): Promise<void> {
  const balances = sdk.balances.getWalletBalances(wallet_addr, chain);
  for await (const balance of balances) {
    responses_list.push(balance);
  }
}

async function fetchAllBalances(): Promise<{ [key: string]: TokenInfo }> {
  const responses_list: any[] = [];
  for (const chain of chains) {
    await getWalletBalances(chain);
  }

  const tokens_info: { [key: string]: TokenInfo } = {};

  responses_list.forEach(response => {
    if (response.stats) {
      response.stats.forEach((token: Balance) => {
        const usd_value = parseFloat(token.usd_value);
        if (usd_value > 1000) {
          const denom = token.token.denom;
          const name = token.token.name;
          const platform = token.token.chain_properties.chain;
          if (!tokens_info[denom]) {
            tokens_info[denom] = { name: name, platforms: new Set<string>(), usd_value: 0 };
          }
          tokens_info[denom].platforms.add(platform);
          tokens_info[denom].usd_value += usd_value;
        }
      });
    }

    if (response.balances) {
      response.balances.forEach((balance: Balance) => {
        const usd_value = parseFloat(balance.usd_value);
        if (usd_value > 1000) {
          const denom = balance.token.denom;
          const name = balance.token.name;
          const platform = balance.token.chain_properties.chain;
          if (!tokens_info[denom]) {
            tokens_info[denom] = { name: name, platforms: new Set<string>(), usd_value: 0 };
          }
          tokens_info[denom].platforms.add(platform);
          tokens_info[denom].usd_value += usd_value;
        }
      });
    }

    if (response.stats) {
      response.stats.forEach((integration: { balances: Balance[] }) => {
        if (integration.balances) {
          integration.balances.forEach((balance: Balance) => {
            const usd_value = parseFloat(balance.usd_value);
            if (usd_value > 1000) {
              const denom = balance.token.denom;
              const name = balance.token.name;
              const platform = balance.token.chain_properties.chain;
              if (!tokens_info[denom]) {
                tokens_info[denom] = { name: name, platforms: new Set<string>(), usd_value: 0 };
              }
              tokens_info[denom].platforms.add(platform);
              tokens_info[denom].usd_value += usd_value;
            }
          });
        }
      });
    }
  });

  return tokens_info;
}

function sumTokenValues(tokens_info: { [key: string]: TokenInfo }): number {
  let totalValue = 0;

  Object.values(tokens_info).forEach(info => {
    totalValue += info.usd_value;
  });

  return totalValue;
}

const zerionUrl = 'https://api.zerion.io/v1/wallets/0x1bdb97985913d699b0fbd1aacf96d1f855d9e1d0/portfolio?currency=usd'
const zerionAuth = 'Basic emtfZGV2X2E4NmQ4MzVmMWNmNDRlMmVhMTc5MWYyZTNjZjI0NmE4OnprX2Rldl9hODZkODM1ZjFjZjQ0ZTJlYTE3OTFmMmUzY2YyNDZhOA=='

const thornodeAmountUrl = 'https://thornode.ninerealms.com/bank/balances/thor1s65q3qky0z003f9k7gzv7scutmkr7j0qpfrd0n'
const thornodePriceUrl = 'https://midgard.ninerealms.com/v2/stats'

const solanaAuth = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjExMTg3ZGUwLTc4MTItNGE3OS04ZjdjLWJlNDAwYTE2ZDg2MyIsIm9yZ0lkIjoiMzY1NTE1IiwidXNlcklkIjoiMzc1NjUzIiwidHlwZUlkIjoiMmY4MTdiNGMtNzA3MC00ZGJkLTk4OGItMGFhY2Q5NGJhZGE2IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDA3MzYwODQsImV4cCI6NDg1NjQ5NjA4NH0.WdqZAs3euBEvVHZz658m6xgKAN37Nf2Qk99IeqLlhI0'
const solanaAmountUrl = 'https://solana-gateway.moralis.io/account/mainnet/FtoHuLxaYDZXH1ESsU3EDbZSuFa3G1WKMSLBZdru5xYL/balance' 
const solanaPriceUrl = 'https://solana-gateway.moralis.io/token/mainnet/So11111111111111111111111111111111111111112/price'

export default async function handler(req: any, handlerRes: any) {
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
                                    }).then(async(res) => res.json().then(async(data) => {
                                        let solanaPrice = Number(data.usdPrice)                                                                                        
                                        let solanaWorth = solanaAmount * solanaPrice
                                        console.log(`solanaPrice: ${solanaPrice}`)
                                        console.log(`solanaWorth: ${solanaWorth}`)

                                        // Fetching and summing balances from PulsarSDK
                                        const tokens_info = await fetchAllBalances();
                                        const pulsarWorth = sumTokenValues(tokens_info);
                                        console.log(`pulsarWorth: ${pulsarWorth}`);

                                        let vaultWorth = zerionWorth + thorWorth + solanaWorth + pulsarWorth;
                                        console.log(`Fresh Vault Worth: ${vaultWorth}`)
                                        handlerRes.status(200).json({ 
                                            vaultWorth, zerionWorth, runAmount, thorPrice, thorWorth, solanaAmount, solanaPrice, solanaWorth, pulsarWorth
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
