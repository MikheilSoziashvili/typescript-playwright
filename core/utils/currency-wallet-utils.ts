import { Currency } from "@enums/currencies";
import { Unit } from "@enums/units";

export const walletMap: Record<string, Unit> = {
	USD: Unit.COINS,
	BTC: Unit.BTC_SATOSHI,
	ETH: Unit.ETH_GWEI,
	LTC: Unit.LTC_LITOSHI,
	TRX: Unit.TRX_SUN,
	XRP: Unit.XRP_DROP,
	DOGE: Unit.DOGE_SHIBE,
	SOL: Unit.SOL_LAMPORT,
};

export function toCurrencyEnum(value: string): Currency {
	return Currency[value as keyof typeof Currency];
}

export function toWalletUnit(wallet: string): Unit {
	return walletMap[wallet];
}
