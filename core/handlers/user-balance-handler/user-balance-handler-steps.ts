import { Unit } from "@enums/units";
import { Currency } from "@enums/currencies";
import { UserBalanceHandler } from "./user-balance-handler";
import { step } from "decorators/step";

export class UserBalanceHandlerSteps {
	constructor(private readonly handler: UserBalanceHandler) {}

	/**
	 * Calculates expected balance in USD after depositing crypto
	 *
	 * @param initialBalanceCoins - Initial balance in coins
	 * @param cryptoDepositAmount - Amount deposited in whole crypto units (e.g., "0.05" or 0.05 XRP)
	 * @param cryptoUnit - Crypto unit type (e.g., Unit.XRP_DROP)
	 * @returns Expected balance in USD after crypto deposit
	 */
	@step(`Calculate expected balance after crypto deposit`)
	public async calculateExpectedBalanceAfterCryptoDeposit(
		initialBalanceCoins: number,
		cryptoDepositAmount: string | number,
		cryptoUnit: Unit,
	): Promise<number> {
		const depositAmount =
			typeof cryptoDepositAmount === "string"
				? parseFloat(cryptoDepositAmount)
				: cryptoDepositAmount;

		const smallestUnit = this.handler.cryptoWholeToSmallestUnit(
			depositAmount,
			cryptoUnit,
		);

		const depositCoins = await this.handler.smallestCryptoUnitToCoins(
			smallestUnit,
			cryptoUnit,
		);

		const expectedBalanceCoins = initialBalanceCoins + depositCoins;

		return this.handler.coinsToFiatRounded(
			expectedBalanceCoins,
			Currency.USD,
		);
	}
}
