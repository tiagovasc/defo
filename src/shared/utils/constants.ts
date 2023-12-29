import { BigNumber } from 'ethers'
import DAI_ABI from 'abi/DAI.json'
import DEFO_ABI from 'abi/DEFO.json'
import ConfigFacet from 'abi/facets/ConfigFacet.json'
import MaintenanceFacet from 'abi/facets/MaintenanceFacet.json'
import RewardsFacet from 'abi/facets/RewardsFacet.json'
import VaultFacet from 'abi/facets/VaultFacet.json'
import YieldGemFacet from 'abi/facets/YieldGemFacet.json'
import DonationsFacet from 'abi/facets/DonationsFacet.json'
import TransferLimitFacet from 'abi/facets/TransferLimitFacet.json'
import JoeRouterABI from "abi/JoeRouter.json"
import JoeFactoryABI from "abi/JoeFactory.json"
import JoePairABI from "abi/JoePair.json"

export const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID

export const RPC = {
    43114: "https://api.avax.network/ext/bc/C/rpc",
    43113: "https://api.avax-test.network/ext/bc/C/rpc",
    4: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
    1337: `http://localhost:8545`
}

export const CONTRACTS_ABI = [
    ...ConfigFacet,
    ...MaintenanceFacet,
    ...RewardsFacet,
    ...TransferLimitFacet,
    ...VaultFacet,
    ...YieldGemFacet,
    ...DonationsFacet
]

export enum SUPPORTED_NETWORKS_ENUM {
    AVAX_MAINNET = 'avax_mainnet',
    FUJI_TESTNET = 'fuji_testnet',
    HARDHAT = 'hardhat',
    RINKEBY = 'rinkeby',
}

export const NETWORK_MAPPER: { [key: number]: string } = {
    43114: SUPPORTED_NETWORKS_ENUM.AVAX_MAINNET,
    43113: SUPPORTED_NETWORKS_ENUM.FUJI_TESTNET,
    1337: SUPPORTED_NETWORKS_ENUM.HARDHAT,
    4: SUPPORTED_NETWORKS_ENUM.RINKEBY
}

export const ACTIVE_NETOWORKS_COLLECTION = [1337, 43113, 43114]


export const SUPPORTED_NETWORKS: { [key: string]: ConfigType } = {
    avax_mainnet: {
        chainName: "Avalanche Mainnet C-Chain",
        chainId: 43114,
        chainRPC: "https://api.avax.network/ext/bc/C/rpc",
        chainExplorer: "https://snowtrace.io/",
        nativeCurrency: {
            name: "AVAX",
            symbol: "AVAX",
            decimals: 18
        },
        deployments: {
            dai: {
                abi: DAI_ABI,
                address: "0xd586e7f844cea2f87f50152665bcbc2c279d8d70"
            },
            defo: {
                abi: DAI_ABI,
                address: "0xbb6ffeCE837a525A2eAE033ff0161a7CDC60B693"
            },
            diamond: {
                abi: CONTRACTS_ABI,
                address: "0xa47f856CD11513DB4E723c03990292f6c2FAC6b7"
            },
            dex: {
                router: {
                    abi: JoeRouterABI,
                    address: "0xC7f372c62238f6a5b79136A9e5D16A2FD7A3f0F5"
                },
                factory: {
                    abi: JoeFactoryABI
                },
                pair: {
                    abi: JoePairABI
                }
            }
        }
    },
    fuji_testnet: {
        chainName: "Avalanche FUJI C-Chain",
        chainId: 43113,
        chainRPC: "https://api.avax-test.network/ext/bc/C/rpc",
        chainExplorer: "https://testnet.snowtrace.io/",
        nativeCurrency: {
            name: "AVAX",
            symbol: "AVAX",
            decimals: 18
        },
        deployments: {
            dai: {
                abi: DAI_ABI,
                address: "0x3362FE2f7E17A5a9F90DaBE12E4A6E16E146F19a"
            },
            defo: {
                abi: DEFO_ABI,
                address: "0xA9D3adb2B5c7d89c56d74584E98ABcea1E4e6a4D"
            },
            diamond: {
                abi: CONTRACTS_ABI,
                address: "0xf0d26dD82f6beE798cB677ee17E5466d009193Eb"
            },
            dex: {
                router: {
                    abi: JoeRouterABI,
                    address: "0xd7f655E3376cE2D7A2b08fF01Eb3B1023191A901"
                },
                factory: {
                    abi: JoeFactoryABI
                },
                pair: {
                    abi: JoePairABI
                }
            }
        }
    },
    hardhat: {
        chainName: "Hardhat localhost",
        chainId: 1337,
        chainRPC: RPC[1337],
        chainExplorer: "https://testnet.snowtrace.io/",
        nativeCurrency: {
            name: "GO",
            symbol: "GO",
            decimals: 18
        },
        deployments: {
            dai: {
                abi: DAI_ABI,
                address: "0xd586e7f844cea2f87f50152665bcbc2c279d8d70"
            },
            defo: {
                abi: DEFO_ABI,
                address: "0xEFac7869B91F3dc100340a61dfE77839B89ba86D"
            },
            diamond: {
                abi: CONTRACTS_ABI,
                address: "0x93d14C3Ef7DdD5e4d28F435249D904b88ba1EAc7"
            }
        }
    },
    rinkeby: {
        chainName: "Rinkeby Test Network",
        chainId: 4,
        chainRPC: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
        chainExplorer: "https://rinkeby.etherscan.io/",
        nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18
        }
    }
}


// change this to change the required network
export const ACTIVE_NETWORK = SUPPORTED_NETWORKS.hardhat


export const MIN_REWARD_TIME = (3600 * 24) * 7; // (seconds in a day) * count days


export const TAX_TIERS: any = {
    43114: {
        '0': "35%",
        '1': "35%",
        '2': "35%",
        '3': "20%",
        '4': "0%"
    },
    1337: {
        '0': "35%",
        '1': "35%",
        '2': "35%",
        '3': "20%",
        '4': "0%"
    },
    43113: {
        '0': "30%",
        '1': "20%",
        '2': "15%",
        '3': "10%",
        '4': "0%"
    }
}


export const GEM_TYPE_NAMES: any = {
    0: "Sapphire",
    1: "Ruby",
    2: "Diamond"
}

export type BOOSTER_INFO_TYPE = {
    name: string,
    rewardsBoost: number,
    maintenanceFeeReduction: number,
    vaultFeeReduction: number
}

export const BOOSTERS_TYPE: { [key: number | string]: BOOSTER_INFO_TYPE } = {
    0: {
        name: 'None',
        rewardsBoost: 0,
        maintenanceFeeReduction: 0,
        vaultFeeReduction: 0,
    },
    1: {
        name: 'Delta',
        rewardsBoost: 25,
        maintenanceFeeReduction: 25,
        vaultFeeReduction: 50,
    },
    2: {
        name: 'Omega',
        rewardsBoost: 50,
        maintenanceFeeReduction: 50,
        vaultFeeReduction: 90,
    }
}

export type ConfigType = {
    chainName: string,
    chainId: number,
    chainRPC: string,
    chainExplorer: string,
    forkNetwork?: SUPPORTED_NETWORKS_ENUM.AVAX_MAINNET,
    nativeCurrency: {
        name: string,
        symbol: string,
        decimals: number
    },

    deployments?: {
        dai: {
            address: string
            abi: any[]
        }
        defo: {
            address: string,
            abi: any[]
        },
        diamond: {
            address: string,
            abi: any[]
        },
        dex?: {
            router: {
                address: string,
                abi: any[]
            },
            factory: {
                abi: any[],
            },
            pair: {
                abi: any[]
            }
        }
    }
}


export type GemTypeMetadata = {
    LastMint: number;
    MaintenanceFee: number;
    RewardRate: BigNumber;
    DailyLimit: number;
    MintCount: number;
    DefoPrice: BigNumber;
    StablePrice: BigNumber;
}
