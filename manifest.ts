import { Manifest } from "https://deno.land/x/robo_arkiver@v0.4.7/mod.ts";
import { hourDataHandler } from "./handlers/hourdata.ts";
import { HourData } from "./entities/hourdata.ts";


// LUSD/WEH Pair Data
const startBlockHeight = 100000000n

const manifest = new Manifest('aperture');
const arbitrum = manifest
	.addEntities([HourData])
	.chain("arbitrum")

arbitrum
	.addBlockHandler({ blockInterval: 100, startBlockHeight, handler: hourDataHandler })

export default manifest.build();