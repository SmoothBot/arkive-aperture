import { BlockHandler, Store } from "https://deno.land/x/robo_arkiver/mod.ts";
import { type PublicClient, type Block, Address } from "npm:viem";
import { HourData } from "../entities/hourdata.ts";
import { glpManagerAbi } from "../abis/GLPManagerAbi.ts";
import { glpRewardAbi } from "../abis/GLPRewardAbi.ts";
import { Univ2RouterAbi } from "../abis/Univ2RouterAbi.ts";
import erc20 from "../abis/erc20.ts";
import { ChainlinkOracleAbi } from "../abis/ChainlinkOracleAbi.ts";

const HOUR = 60 * 60 * 4

const GLP_PRICE_DECIMALS = 30
const STANDARD_DECIMALS = 18


const nearestHour = (now: number) => {
	return Math.floor(now / HOUR) * HOUR
}

const toNumber = (n: bigint, decimals: number = 0) => {
	return Number(n) / (10 ** decimals)
}

const GMX: Address = '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a'
const USDC: Address = '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8'

export const hourDataHandler: BlockHandler = async ({ block, client, store }: {
	block: Block;
	client: PublicClient;
	store: Store;
}): Promise<void> => {
	const now = Number(block.timestamp)
	const nowHour = nearestHour(Number(now))
	const last = await HourData.findOne({}).sort({ timestamp: -1 })
	const lastHour = last?.timestamp ?? (nearestHour(now) - HOUR)

	const isNewManager = block.number! > 7654800n
	const mgr = (isNewManager ? '0x3963FfC9dff443c2A94f21b129D429891E32ec18' : '0x321F653eED006AD1C29D174e17d96351BDe22649') as Address // Use the new one after it was deployed
	const glpToken = '0x4277f8F2c384827B5273592FF7CeBd9f2C1ac258' as Address
	const ethOracleAddress = '0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612' // https://docs.chain.link/data-feeds/price-feeds/addresses?network=arbitrum
	const glpRewardTracker = '0x4e971a87900b931fF39d1Aad67697F49835400b6'
	const sushiRouter = '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'

	if (lastHour < nowHour) {
		// for every hour that passes, we capture a snapshot of eth and glp prices
		const [
			glpAum, 
			glpTotalSupply, 
			latestAnswer,
			cumulativeRewardPerToken,
			amountsOut,
		] = await client.multicall({
			contracts: [
				{ abi: glpManagerAbi, address: mgr, functionName: 'getAum', args: [true] },
				{ abi: erc20, address: glpToken, functionName: 'totalSupply' },
				{ abi: ChainlinkOracleAbi, address: ethOracleAddress, functionName: "latestAnswer" },
				{ abi: glpRewardAbi, address: glpRewardTracker, functionName: "cumulativeRewardPerToken" },
				{ abi: Univ2RouterAbi, address: sushiRouter, functionName: "getAmountsOut", args: [10n ** 18n,[GMX, USDC]] },
			],
			blockNumber: block.number!,
		})
		const gmxPrice = toNumber(amountsOut.result[1], 6)
		console.log(cumulativeRewardPerToken.result, amountsOut.result[1])

		const glpPrice = Number(glpAum.result! / glpTotalSupply.result!) / (10 ** (GLP_PRICE_DECIMALS - STANDARD_DECIMALS))
		const ethPrice = Number(latestAnswer.result!) / 1e8
		console.log(`Block #${block.number} | eth $${ethPrice} | glp $${glpPrice}`)
		const glpSupply = toNumber(glpTotalSupply.result, 18)
		const gmxCumulativeRewards = toNumber(cumulativeRewardPerToken.result, 30)
		const emissions = last?.gmxCumulativeRewards !== undefined ? 
			(gmxCumulativeRewards - last.gmxCumulativeRewards) * glpSupply : 0

		const rec = new HourData({
			timestamp: nowHour,
			glpTotalSupply: glpSupply,
			gmxCumulativeRewards,
			gmxEmissions: emissions,
			gmxEmissionsUsd: emissions,
			gmxPrice,
			glpPrice,
			ethPrice,
		})
		await rec.save()
	}
}