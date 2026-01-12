import { BaseTestDataObjectFactory } from "test-data/base/base-test-data-object-factory";
import {
	RoyaltyUpLevelRanksTestData,
	RoyaltyUpLevelRanksTestDataParams,
} from "@dtos/test-data/royalty-up-level-ranks-test-data";
import { RewardsRoyaltyUpRanks } from "@enums/rewards-royalty-up-ranks";

export class RoyaltyUpLevelRanksTestDataObjectFactory extends BaseTestDataObjectFactory<
	RoyaltyUpLevelRanksTestData,
	RoyaltyUpLevelRanksTestDataObjectFactory
> {
	/**
	 * Builds a new RoyaltyUpLevelRanksTestData instance with required and optional overrides.
	 *
	 * @param required - Required properties (currentLevel).
	 * @param overrides - Optional property overrides for customizing the data.
	 * @returns A new RoyaltyUpLevelRanksTestData instance.
	 */
	public static override build(
		required: { currentLevel: RewardsRoyaltyUpRanks },
		overrides?: Partial<
			Omit<RoyaltyUpLevelRanksTestDataParams, "currentLevel">
		>,
	): RoyaltyUpLevelRanksTestData {
		const base = this.default();

		return new RoyaltyUpLevelRanksTestData({
			currentLevel: required.currentLevel,
			requiredXpToUpgrade:
				overrides?.requiredXpToUpgrade ?? base.requiredXpToUpgrade,
			newLevel: overrides?.newLevel ?? base.newLevel,
			rewardAmount: overrides?.rewardAmount ?? base.rewardAmount,
			userBeXp: overrides?.userBeXp ?? base.userBeXp,
			rankXp: overrides?.rankXp ?? base.rankXp,
		});
	}

	/**
	 * Creates a default RoyaltyUpLevelRanksTestData instance.
	 *
	 * @returns A RoyaltyUpLevelRanksTestData instance with default values.
	 */
	public static override default(): RoyaltyUpLevelRanksTestData {
		return new RoyaltyUpLevelRanksTestData({
			currentLevel: RewardsRoyaltyUpRanks.UNRANKED,
			requiredXpToUpgrade: "1,000.00",
			newLevel: RewardsRoyaltyUpRanks.BRONZE_1,
			rewardAmount: "$1.50",
			userBeXp: 1000000,
			rankXp: 0,
		});
	}

	/**
	 * Creates preconfigured RoyaltyUpLevelRanksTestData instances for common scenarios.
	 *
	 * @returns An object containing preconfigured test data instances.
	 */
	public static override preconfigured(): {
		unrankedToBronze1: RoyaltyUpLevelRanksTestData;
	} {
		return {
			unrankedToBronze1: new RoyaltyUpLevelRanksTestData({
				currentLevel: RewardsRoyaltyUpRanks.UNRANKED,
				requiredXpToUpgrade: "2,000.00",
				newLevel: RewardsRoyaltyUpRanks.BRONZE_1,
				rewardAmount: "$2.00",
				userBeXp: 1500000,
				rankXp: 1000,
			}),
		};
	}
}
