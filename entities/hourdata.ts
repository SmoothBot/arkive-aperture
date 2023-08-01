import { createEntity } from "https://deno.land/x/robo_arkiver/src/graphql/entity.ts";


interface IHourData {
	timestamp: number,
	glpTotalSupply: number,
	gmxCumulativeRewards: number,
	gmxEmissions: number,
	gmxEmissionsUsd: number,
	gmxPrice: number,
	glpPrice: number,
	ethPrice: number,
}

export const HourData = createEntity<IHourData>("HourData", {
	timestamp: { type: Number, index: true },
	glpTotalSupply: Number,
	gmxCumulativeRewards: Number,
	gmxEmissions: Number,
	gmxEmissionsUsd: Number,
	gmxPrice: Number,
	glpPrice: Number,
	ethPrice: Number,
})