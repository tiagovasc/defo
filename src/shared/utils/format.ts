import { BigNumber } from "ethers";
import { GemTypeMetadata } from "./constants";

export const getBalance = (balance: BigNumber, decimals = 18) => Number(balance.div(BigNumber.from(10).pow(decimals)));

export const getHoursFromSecondsInRange = (number: number) => {
	const seconds = Math.round(number / 100) * 100;
	const hours = Math.floor(seconds / 3600);
	return hours;
}

export const getGemTypes = (rawGemMetadata: any): GemTypeMetadata => {
	return {
		LastMint: rawGemMetadata[0],
		MaintenanceFee: rawGemMetadata[1],
		RewardRate: rawGemMetadata[2],
		DailyLimit: rawGemMetadata[3],
		MintCount: rawGemMetadata[4],
		DefoPrice: rawGemMetadata[5],
		StablePrice: rawGemMetadata[6],
	}
}

export const formatDecimalNumber = (num: number, toDecimal: number): any => {
	const re: any = new RegExp('^-?\\d+(?:\.\\d{0,' + (toDecimal || -1) + '})?');
	const result: any = (num.toString().match(re));
	let formattedNumber = result[0]
	// console.log('formattedNumber: ', formattedNumber);
	const numParts = formattedNumber.split(".")
	
	if (numParts.length < 2) { 
		let decimalsString = ''
		for (let i = 0; i < toDecimal; i++) {
			decimalsString += '0'
		}
		formattedNumber = `${formattedNumber}.${decimalsString}`;
	} else if(numParts[1].length < toDecimal) {
		// add zero's at the end	
		// 5.67 => 5.670
		let decimalsString = numParts[1].toString()
		for (let i = 0; i < toDecimal - numParts[1].length; i++) {
			decimalsString += '0'
		}
		formattedNumber = `${numParts[0]}.${decimalsString}`
	}
	// console.log('after: ', formattedNumber);
	return formattedNumber;
}

export const formatNumber = (num: number) => {
	return Math.round((num + Number.EPSILON) * 100) / 100;
}