import { RouletteBetTestData } from "@dtos/test-data";
import { RouletteBetColor } from "@enums/original-games";
import { BaseTestDataObjectFactory } from "test-data/base/base-test-data-object-factory";

export class RouletteBetTestDataObjectFactory extends BaseTestDataObjectFactory<
	RouletteBetTestData,
	RouletteBetTestDataObjectFactory,
	{ username: string }
> {
	public static override build(
		args: { username: string },
		overrides?: Partial<RouletteBetTestData>,
	): RouletteBetTestData {
		const base = this.default(args);

		return new RouletteBetTestData(
			overrides?.username ?? base.username,
			overrides?.betAmount ?? base.betAmount,
			overrides?.betColor ?? base.betColor,
		);
	}

	public static override default({
		username,
	}: {
		username: string;
	}): RouletteBetTestData {
		return new RouletteBetTestData(username, 10, RouletteBetColor.BLACK);
	}

	public static override random({
		username,
	}: {
		username: string;
	}): RouletteBetTestData {
		return this.default({ username });
	}
}
