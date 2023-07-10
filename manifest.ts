import { Manifest } from "https://deno.land/x/robo_arkiver@v0.4.7/mod.ts";
import { hourDataHandler } from "./handlers/hourdata.ts";
import { HourData } from "./entities/hourdata.ts";
import { OptionMarketAbi } from "./abis/OptionMarketAbi.ts";
import { onTrade } from "./handlers/trade.ts";
import { Trade } from "./entities/trade.ts";


// LUSD/WEH Pair Data
const startBlockHeight = 100000000n

const manifest = new Manifest('aperture');
const arbitrum = manifest
	.addEntities([HourData, Trade])
	.chain("arbitrum")

arbitrum
	.addBlockHandler({ blockInterval: 100, startBlockHeight, handler: hourDataHandler })

arbitrum
  .contract('OptionMarket', OptionMarketAbi)
  .addSources({ '0x919E5e0C096002cb8a21397D724C4e3EbE77bC15': 54905918n })
  .addEventHandlers({ 'Trade': onTrade })

export default manifest.build();