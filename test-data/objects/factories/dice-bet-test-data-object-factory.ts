import { getRandomNumber } from "@core/utils/utils";
import { DiceBetTestData } from "@dtos/test-data";
import { BaseTestDataObjectFactory } from "test-data/base/base-test-data-object-factory";

export class DiceBetTestDataObjectFactory extends BaseTestDataObjectFactory<
	DiceBetTestData,
	DiceBetTestDataObjectFactory
> {
	public static override build(
		overrides?: Partial<DiceBetTestData>,
	): DiceBetTestData {
		const base = this.default();

		return new DiceBetTestData({
			betAmount: overrides?.betAmount ?? base.betAmount,
			multiplier: overrides?.multiplier ?? base.multiplier,
		});
	}

	public static override default(): DiceBetTestData {
		return new DiceBetTestData({ betAmount: 10, multiplier: 1.5 });
	}

	public static override preconfigured(): {
		normalBetMinMultiplier: DiceBetTestData;
	} {
		return {
			normalBetMinMultiplier: new DiceBetTestData({
				betAmount: 10,
				multiplier: 1.1,
			}),
		};
	}

	public static override random(): DiceBetTestData {
		return new DiceBetTestData({
			betAmount: getRandomNumber(1),
			multiplier: getRandomNumber(1),
		});
	}
}
