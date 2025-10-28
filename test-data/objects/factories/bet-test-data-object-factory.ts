import { getRandomNumber } from "@core/utils/utils";
import { BetTestData } from "@dtos/test-data";
import { BaseTestDataObjectFactory } from "test-data/base/base-test-data-object-factory";

export class BetTestDataObjectFactory extends BaseTestDataObjectFactory<
	BetTestData,
	BetTestDataObjectFactory,
	{ username: string }
> {
	public static override build(
		args: { username: string },
		overrides?: Partial<BetTestData>,
	): BetTestData {
		const base = this.default(args);

		return new BetTestData(
			overrides?.username ?? base.username,
			overrides?.betAmount ?? base.betAmount,
			overrides?.autoCashoutMultiplier ?? base.autoCashoutMultiplier,
		);
	}

	public static override default({
		username,
	}: {
		username: string;
	}): BetTestData {
		return new BetTestData(username, 1, 1);
	}

	public static override preconfigured({ username }: { username: string }): {
		normalBetMinMultiplier: BetTestData;
		normalBetMediumMultiplier: BetTestData;
	} {
		return {
			normalBetMinMultiplier: new BetTestData(username, 10, 1.1),
			normalBetMediumMultiplier: new BetTestData(username, 10, 1.5),
		};
	}

	public static override random({
		username,
	}: {
		username: string;
	}): BetTestData {
		return new BetTestData(
			username,
			getRandomNumber(1),
			getRandomNumber(1),
		);
	}
}
