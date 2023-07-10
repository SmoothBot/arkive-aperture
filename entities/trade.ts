import { createEntity } from "https://deno.land/x/robo_arkiver/src/graphql/entity.ts";


interface ITrade {
	block: number,
  timestamp: number,
  trade: {
    strikeId: number
    expiry: number
    strikePrice: number
    optionType: number
    tradeDirection: number
    amount: number
    setCollateralTo: number
    spotPrice: number
    reservedFee: number
    totalCost: number    
    isForceClose: boolean,
  }
}

export const Trade = createEntity<ITrade>("Trade", {
	block: { type: Number, index: true },
	timestamp: { type: Number, index: true },
  trade: { 
    strikeId: Number,
    expiry: Number,
    strikePrice: Number,
    optionType: Number,
    tradeDirection: Number,
    amount: Number,
    setCollateralTo: Number,
    spotPrice: Number,
    reservedFee: Number,
    totalCost: Number, 
    isForceClose: Boolean,
  }
})
