import { Manifest } from "https://deno.land/x/robo_arkiver@v0.4.7/mod.ts";
import { hourDataHandler } from "./handlers/hourdata.ts";
import { HourData } from "./entities/hourdata.ts";
import { OptionMarketAbi } from "./abis/OptionMarketAbi.ts";
import { onTrade } from "./handlers/trade.ts";
import { Trade } from "./entities/trade.ts";
import { glpRewardAbi } from "../abis/GLPRewardAbi.js";
import { onGLPEvent } from "./handlers/glprewards.js";
 


// LUSD/WEH Pair Data
const startBlockHeight = 54905918n

const manifest = new Manifest('aperture');
const arbitrum = manifest
	.addEntities([HourData, Trade])
	.chain("arbitrum")

arbitrum
	.addBlockHandler({ blockInterval: 100, startBlockHeight, handler: hourDataHandler })

arbitrum
  .contract('OptionMarket', OptionMarketAbi)
  .contract('GLPReward', glpRewardAbi)
  .addSources({ '0x919E5e0C096002cb8a21397D724C4e3EbE77bC15': 54905918n })
  .addEventHandlers({ 'Trade': onTrade })
  .addEventHandlers({'GLPEvent': onGLPEvent})

export default manifest.build();