import { HiloBetTestData } from "@dtos/test-data";
import { HiloBetOption } from "@enums/hilo-bet-options";
import { HiloBetMultiplierByBetOption } from "@enums/original-games";
import { BaseTestDataObjectFactory } from "test-data/base/base-test-data-object-factory";

export class HiloBetTestDataObjectFactory extends BaseTestDataObjectFactory<
	HiloBetTestData,
	HiloBetTestDataObjectFactory,
	{ username: string }
> {
	public static override build(
		args: { username: string },
		overrides?: Partial<HiloBetTestData>,
	): HiloBetTestData {
		const base = this.default(args);

		return new HiloBetTestData(
			overrides?.username ?? base.username,
			overrides?.betAmount ?? base.betAmount,
			overrides?.betOption ?? base.betOption,
			overrides?.betMultiplierByBetOption ?? base.betMultiplierByBetOption,
		);
	}

	public static override default({
		username,
	}: {
		username: string;
	}): HiloBetTestData {
		return new HiloBetTestData(
			username,
			10,
			HiloBetOption.RED,
			HiloBetMultiplierByBetOption.RED,
		);
	}

	public static override random({
		username,
	}: {
		username: string;
	}): HiloBetTestData {
		return this.default({ username });
	}
}
