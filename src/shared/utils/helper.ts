import { BigNumber, ethers } from "ethers";
import moment from "moment";
import { GemsConfigState, GemTypeConfig } from "shared/types/DataTypes";
import { BOOSTERS_TYPE, MIN_REWARD_TIME } from "./constants";

export async function getIsEligableForClaim(diamondContract: any, provider: any, gemId: number) {
    const gem = await diamondContract.GemOf(gemId);

    const blockNumber = await provider.getBlockNumber();
    const timestamp = await (await provider.getBlock(blockNumber)).timestamp
    const rewardPoints = timestamp - gem[1]; // in seconds - 86 400 => 1 day
    return rewardPoints > MIN_REWARD_TIME;
}


export const getNextTier = async (provider: any, lastRewardWithdrawalTime: any, taxScaleSinceLastClaimPeriodDays: number) => {
    const startTierDate = moment(lastRewardWithdrawalTime, 'X');

    const currBlock = await getCurrentBlock(provider);
    const todayDate = moment.unix(currBlock.timestamp)

    // console.log('startTierCountDate: ', startTierDate.format("MMM DD YYYY"));
    // console.log('todayDate: ', todayDate.format("MMM DD YYYY"));
    // console.log('taxScaleSinceLastClaimPeriodDays: ', taxScaleSinceLastClaimPeriodDays);

    // todayDate.diff(startTierDate, "month") >= 1
    const hasNoTierTax = todayDate.diff(startTierDate, "days") >= taxScaleSinceLastClaimPeriodDays * 4
    if (hasNoTierTax) {
        return null;
    }

    let nextTierDate = startTierDate.clone();
    while (nextTierDate.isSameOrBefore(todayDate)) {
        nextTierDate.add(taxScaleSinceLastClaimPeriodDays, 'days') // taxScale
    }
    // console.log('nextTierDate: ', nextTierDate.format("MMM DD YYYY"));

    const leftDays = nextTierDate.diff(todayDate, 'day')
    const leftHours = nextTierDate.diff(todayDate, 'hours')

    if (leftDays === 1) {
        return `${leftDays} day left`
    } else if (leftDays > 1) {
        return `${leftDays} days left`
    } else {
        return leftHours === 1 ? `${leftHours} hour left` : `${leftHours} hours left`
    }
    // return leftDays >= 1 ? `${leftDays} days left` : `${leftHours} hours left`
    // return leftDays === 7 ? 7 : leftDays + 1;
}

// Delta => -25%
// Omega => -50%

export const getMaintenanceFeeDaiForGem = (gemsConfig: GemsConfigState, gemTypeId: 0 | 1 | 2, booster: 0 | 1 | 2) => {

    let currentGemConfig: GemTypeConfig;
    if (gemTypeId === 0) {
        currentGemConfig = gemsConfig.gem0;
    } else if (gemTypeId === 1) {
        currentGemConfig = gemsConfig.gem1;
    } else if (gemTypeId === 2) {
        currentGemConfig = gemsConfig.gem2;
    } else {
        return BigNumber.from(0)
    }

    if (booster !== 0 && booster !== 1 && booster !== 2) {
        return currentGemConfig.maintenanceFeeDai
    }

    const feePercentage = 100 - BOOSTERS_TYPE[booster].maintenanceFeeReduction;
    return currentGemConfig.maintenanceFeeDai.div(100).mul(feePercentage)

}

export const getCurrentBlock = async (provider: any) => {
    return await provider.getBlock("latest");
}
