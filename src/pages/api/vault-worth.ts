declare module 'pulsar_sdk_js';

import { PulsarSDK, ChainKeys } from 'pulsar_sdk_js';
import axios from 'axios';

const chains = [ChainKeys.ETHEREUM, ChainKeys.ARBITRUM];
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

async function getWalletBalances(chain: string, responses_list: any[]): Promise<void> {
  const balances = sdk.balances.getWalletBalances(wallet_addr, chain);
  for await (const balance of balances) {
    responses_list.push(balance);
  }
}

async function fetchAllBalances(): Promise<{ [key: string]: TokenInfo }> {
  const responses_list: any[] = []; 

  for (const chain of chains) {
    await getWalletBalances(chain, responses_list);
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

async function fetchThornodeBalances() {
  const response = await axios.get('https://thornode.ninerealms.com/cosmos/bank/v1beta1/balances/thor1s65q3qky0z003f9k7gzv7scutmkr7j0qpfrd0n');
  return response.data.balances;
}

async function fetchRunePrice() {
  const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=thorchain&vs_currencies=usd');
  return parseFloat(response.data.thorchain.usd);
}

async function calculateThornodeValuesInUSD() {
  const balances = await fetchThornodeBalances();
  const runePrice = await fetchRunePrice();

  const usdValues = balances.map(balance => {
    const amount = parseFloat(balance.amount) / 1e8;
    const usdValue = amount * runePrice;
    return {
      denom: balance.denom,
      amount,
      usdValue
    };
  });

  return usdValues;
}

export default async function handler(req: any, handlerRes: any) {
  if (req.method === 'GET') {
    try {
      const tokens_info = await fetchAllBalances();
      const pulsarWorth = sumTokenValues(tokens_info);
      console.log(`pulsarWorth: ${pulsarWorth}`);

      const tokenDetails = Object.keys(tokens_info).map(denom => {
        const info = tokens_info[denom];
        return { name: info.name, ticker: denom, value: Math.floor(info.usd_value) };
      });

      const thornodeValues = await calculateThornodeValuesInUSD();
      const thornodeWorth = thornodeValues.reduce((sum, token) => sum + token.usdValue, 0);

      const totalVaultWorth = pulsarWorth + thornodeWorth;

      const thornodeTokenDetails = thornodeValues.map(token => ({
        name: 'Rune',
        ticker: 'RUNEUSDT',
        value: Math.floor(token.usdValue)
      }));

      handlerRes.status(200).json({ 
        vaultWorth: totalVaultWorth, 
        tokenDetails: [...tokenDetails, ...thornodeTokenDetails]
      });
    } catch (err) {
      console.error('Failed to fetch data:', err);
      handlerRes.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    handlerRes.status(405).json({ error: 'Method Not Allowed' });
  }
}
