import { type EventHandlerFor } from "https://deno.land/x/robo_arkiver/mod.ts";
import { glpRewardAbi } from "../abis/GLPRewardAbi.js";
import { Trade } from "../entities/trade.js";
import { formatUnits } from "npm:viem"


// deno-lint-ignore require-await
export const onGLPEvent: EventHandlerFor<typeof glpRewardAbi, 'GLPEvent'> = async (
  { event, store, client },
  ) => {
    console.log(event.args)
    
    const rec = new GLPEvent ({
      GLPReward: Object(event.args)
    })
    rec.save()
  }