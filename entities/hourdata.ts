import { createEntity } from "https://deno.land/x/robo_arkiver/src/graphql/entity.ts";


interface IHourData {
	timestamp: number,
	glpPrice: number,
	ethPrice: number,
}

export const HourData = createEntity<IHourData>("HourData", {
	timestamp: { type: Number, index: true },
	glpPrice: Number,
	ethPrice: Number,
})