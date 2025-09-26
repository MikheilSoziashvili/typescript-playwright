import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class UserInfoRewardsAdminPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get newCustomRewardButton(): Locator {
		return this.page.locator("button", {
			hasText: "New Custom Reward",
		});
	}

	public get customRewardModalBody(): Locator {
		return this.page.getByTestId("modalBody");
	}

	public get rewardTypeDropdown(): Locator {
		return this.page
			.getByTestId("modalBody")
			.getByTestId("Input")
			.locator('[role="combobox"]');
	}

	public selectRewardType(reward: string): Locator {
		return this.page.locator("h6", { hasText: reward });
	}

	public get setRewardAmountInput(): Locator {
		return this.page.locator("input[type='text']");
	}

	public get xpChallengeEvRequiredInput(): Locator {
		return this.page.getByLabel("EV Required");
	}

	public get setRewardButton(): Locator {
		return this.page.locator("span", { hasText: "Set Reward" });
	}

	public pendingRewardsSection(section: string): Locator {
		return this.page.locator(
			"[class^='UserInfoRewards-styled__InnerContainer']",
			{
				hasText: `${section} Custom Rewards`,
			},
		);
	}

	public pendingRewardTiles(section: string): Locator {
		return this.pendingRewardsSection(section).locator(
			"[class^='Tile-styled__TileContainer']",
		);
	}

	public tileWithHeading(section: string, reward: string): Locator {
		return this.pendingRewardTiles(section).filter({
			has: this.page.locator("p", { hasText: reward }),
		});
	}

	public tileWithHeadingAndValue(
		section: string,
		reward: string,
		value: string,
	): Locator {
		return this.pendingRewardTiles(section)
			.filter({
				has: this.page.locator("p", { hasText: reward }),
			})
			.filter({
				has: this.page.locator("[class^='Tile-styled__TileValue']", {
					hasText: value,
				}),
			});
	}

	public revokeRewardButton(section: string, reward: string): Locator {
		const tile = this.pendingRewardTiles(section)
			.filter({ has: this.page.locator("p", { hasText: reward }) })
			.filter({
				has: this.page.locator("button", { hasText: "Revoke" }),
			});

		return tile.locator("button", { hasText: "Revoke" });
	}
}
