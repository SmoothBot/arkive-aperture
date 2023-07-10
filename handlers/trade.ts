import { type EventHandlerFor } from "https://deno.land/x/robo_arkiver/mod.ts";
import { OptionMarketAbi } from "../abis/OptionMarketAbi.ts";
import { Trade } from "../entities/trade.ts";
import { formatUnits } from "npm:viem"


// deno-lint-ignore require-await
export const onTrade: EventHandlerFor<typeof OptionMarketAbi, 'Trade'> = async (
  { event, store, client },
) => {
  const timestamp = event.args.timestamp
  const trade = event.args.trade
  
  const rec = new Trade({
    block: Number(event.blockNumber),
    timestamp: Number(timestamp),
    trade: {
      strikeId: Number(trade.strikeId),
      expiry: Number(trade.expiry),
      strikePrice: parseFloat(formatUnits(trade.strikePrice, 18)),
      optionType: Number(trade.optionType),
      tradeDirection: Number(trade.tradeDirection),
      amount: Number(trade.amount),
      setCollateralTo: Number(trade.setCollateralTo),
      spotPrice: parseFloat(formatUnits(trade.spotPrice, 18)),
      reservedFee: Number(trade.reservedFee),
      totalCost: Number(trade.totalCost),
      isForceClose: trade.isForceClose,
    }
  })
  rec.save()
}