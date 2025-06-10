import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class KothMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get kothPageContent(): Locator {
		return this.page.getByTestId("koth-game-page-content");
	}

	public get kothBannerContainer(): Locator {
		return this.kothPageContent.getByTestId("koth-hero-container");
	}

	public get kothBannerImage(): Locator {
		return this.kothPageContent.getByTestId("koth-hero-banner");
	}

	public get kothBannerCurrencyAmount(): Locator {
		return this.kothBannerContainer
			.getByTestId("koth-prize-display")
			.locator("span.currency-amount");
	}

	public get kothBannerTimerContainer(): Locator {
		return this.page.locator(
			"(//div[contains(@class,'Page-styled')]//div[1]//div[last()]//span)[1]",
		);
	}

	public get kothGameContainer(): Locator {
		return this.kothPageContent.getByTestId("koth-content-container");
	}

	public get kothProfileCardLeftContainer(): Locator {
		return this.kothPageContent.getByTestId("koth-profile-card-container");
	}

	public get kothProfileCardUsername(): Locator {
		return this.kothProfileCardLeftContainer.getByTestId(
			"koth-profile-card-username-text",
		);
	}

	public get kothProfileCardWageredAmount(): Locator {
		return this.kothProfileCardLeftContainer.getByTestId(
			"koth-profile-card-wagered-amount",
		);
	}

	public get kothUsersCardRightContainer(): Locator {
		return this.kothPageContent.getByTestId("koth-users-card-container");
	}

	public get currentUserMarkKothUsersCardRightContainer(): Locator {
		return this.kothUsersCardRightContainer.locator(
			'[data-testid*="current-user-mark"]',
		);
	}

	public getUserWageredAmountUsersCardsRightContainerByUsername(
		username: string,
	): Locator {
		const userCard = this.getKothUserCardByUsername(username);
		const userCardInfo = this.getKothUserCardInfoContainer(userCard);
		return this.getKothUserCardWagerAmount(userCardInfo);
	}

	private getKothUserCardByUsername(username: string): Locator {
		return this.kothUsersCardRightContainer
			.locator(
				`[data-testid*="koth-users-card"][data-testid*="-username"]`,
			)
			.filter({ hasText: username });
	}

	private getKothUserCardInfoContainer(userCard: Locator): Locator {
		return userCard.locator(
			'xpath=ancestor::div[contains(@data-testid,"koth-users-card") and contains(@data-testid,"-info")]',
		);
	}

	private getKothUserCardWagerAmount(cardInfo: Locator): Locator {
		return cardInfo.locator("span.currency-amount");
	}

	public get kothMainTopbarTabsContainer(): Locator {
		return this.kothPageContent.getByTestId(
			"koth-main-topbar-tabs-container",
		);
	}

	public kothMainTopBarTabByName(kothName: string): Locator {
		return this.kothMainTopbarTabsContainer.locator(
			`[data-testid*=koth-main-topbar-${kothName}]`,
		);
	}

	public get kothMainTopBarAllTabs(): Locator {
		return this.kothMainTopbarTabsContainer.locator(
			`data-testid*=-tab]+[data-testid*=koth-main-topbar]`,
		);
	}
}
