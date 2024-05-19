declare module 'pulsar_sdk_js';

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
