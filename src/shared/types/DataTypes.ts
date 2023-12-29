import { BigNumber } from "ethers";


interface GemTypeConfig {
    maintenanceFeeDai: BigNumber;
    rewardAmountDefo: BigNumber;
    price: [BigNumber, BigNumber];
    taperRewardsThresholdDefo: BigNumber;
    maxMintsPerLimitWindow: BigNumber;
    isMintAvailable: boolean
}

type GemsConfigState = {
    gem0: GemTypeConfig,
    gem1: GemTypeConfig,
    gem2: GemTypeConfig,
}

type GemTypeMintWindow = {
    mintCount: BigNumber,
    endOfMintLimitWindow: number
}

interface Gem {
    id: any,
    gemTypeId: number;
    booster: number;
    mintTime: Date;
    boostTime: number;
    lastRewardWithdrawalTime: Date;
    lastMaintenanceTime: Date;
    maintenanceFeeUntil: any;
    pendingMaintenanceFee: BigNumber;
    gemMaintenanceFeeDai: BigNumber;
    taxTier: number;
    rewardAmount: BigNumber;
    isClaimable: boolean;
    staked: BigNumber;
    nextTierDaysLeft: number | string | null; // null if next tier date is beyond maintenance fee until
    fi?: any;
}

interface ProtocolConfig {
    paymentTokens: string[];
    wallets: string[];
    incomeDistributionOnMint: string[];
    maintenancePeriod: number;
    rewardPeriod: number;
    taxScaleSinceLastClaimPeriod: number;
    taxRates: BigNumber[];
    charityContributionRate: BigNumber;
    vaultWithdrawalTaxRate: BigNumber;
    taperRate: BigNumber;
    mintLock: boolean;
    transferLock: boolean;
    // mint limit period for coutner reset
    mintLimitWindow: number;
}

export type { GemTypeConfig, GemsConfigState, GemTypeMintWindow, Gem, ProtocolConfig }