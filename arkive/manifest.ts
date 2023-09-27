import { Manifest } from "https://deno.land/x/robo_arkiver@v0.4.19/mod.ts";
import { hourDataHandler } from "./handlers/hourdata.ts";
import { HourData } from "./entities/hourdata.ts";
import { OptionMarketAbi } from "./abis/OptionMarketAbi.ts";
import { onTrade } from "./handlers/trade.ts";
import { Trade } from "./entities/trade.ts";
 


// LUSD/WEH Pair Data
const startBlockHeight = 7654800n

const manifest = new Manifest('aperture');
const arbitrum = manifest
	.addEntities([HourData, Trade])
	.addChain("arbitrum")

arbitrum
	.addBlockHandler({ blockInterval: 1000, startBlockHeight, handler: hourDataHandler })

arbitrum
  .addContract('OptionMarket', OptionMarketAbi)
  .addSources({ '0x919E5e0C096002cb8a21397D724C4e3EbE77bC15': startBlockHeight }) // 54905918n 
  .addEventHandlers({ 'Trade': onTrade })

export default manifest.build();