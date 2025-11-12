import { FreeSpinsPromotionTestData } from "@dtos/test-data";
import { BaseTestDataObjectFactory } from "test-data/base/base-test-data-object-factory";

export class FreeSpinsPromotionTestDataObjectFactory extends BaseTestDataObjectFactory<
	FreeSpinsPromotionTestData,
	FreeSpinsPromotionTestDataObjectFactory
> {
	public static override build(data: {
		rewardId: number;
		userId: number;
		gameCode: string;
		prepaidUuid: string;
		wagerThresholdCoins: number;
		freeSpinRounds: number;
		denominationCoins: number;
	}): FreeSpinsPromotionTestData {
		return new FreeSpinsPromotionTestData({
			rewardId: data.rewardId,
			userId: data.userId,
			gameCode: data.gameCode,
			prepaidUuid: data.prepaidUuid,
			wagerThresholdCoins: data.wagerThresholdCoins,
			freeSpinsRounds: data.freeSpinRounds,
			denominationCoins: data.denominationCoins,
		});
	}
}
