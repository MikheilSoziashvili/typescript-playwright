import { GamdomApi } from "@api/gamdom-api";
import { formatCurrency, waitForSeconds, waitUntil } from "@core/utils/utils";
import { Timeout } from "@enums/timeout";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { BaseAsserter } from "@pages/base/base-asserter";
import { step } from "decorators/step";
import { expect } from "playwright/test";
import { KothPage } from "./koth-page";

export class KothAsserter extends BaseAsserter<KothPage> {
	public constructor(page: KothPage) {
		super(page);
	}

	@step("Verify koth url is")
	public async verifyKothUrlIs(
		expectedUrl: string,
		gamdomApi: GamdomApi,
		cookie: string,
	): Promise<void> {
		const lastKothEventName = await gamdomApi.getKothEventName({
			Cookie: cookie,
		});
		const formattedExpectedUrl =
			`${expectedUrl}/${lastKothEventName}`.toLowerCase();

		await this.waitForAndVerifyCurrentUrlIs(formattedExpectedUrl);
	}

	@step("Verify koth event page is displayed")
	public async verifyKothEventPageIsDisplayed(
		kothPageEndpoint: string,
	): Promise<void> {
		await this.waitForAndVerifyCurrentUrlIs(kothPageEndpoint);
		await this.checkElementsAreVisible(
			[
				this.gamdomPage.map.kothGameContainer,
				this.gamdomPage.map.kothProfileCardLeftContainer,
				this.gamdomPage.map.kothUsersCardRightContainer,
			],
			Timeout.MAX,
		);
	}

	@step("Verify KoTH points increased by expected amount")
	public async verifyKothPointsIncreasedBy(
		initialPoints: number,
		expectedIncrease: number,
	): Promise<void> {
		const expectedTotal = parseFloat(
			(initialPoints + expectedIncrease).toFixed(2),
		);

		await this.checkElementsHaveText(
			[
				{
					locator:
						this.gamdomPage.map.kothProfileCardPointsAmount,
					expectedText: expectedTotal.toFixed(2),
				},
			],
			Timeout.MAX,
		);
	}

	@step("Verify koth wagger amount profile card")
	public async verifyKothWaggerAmountProfileCard(
		expectedAmount: number,
	): Promise<void> {
		const formattedAmount = formatCurrency(expectedAmount);

		await waitUntil(
			async () => {
				await this.gamdomPage.refresh();
				await waitForSeconds(2);
				await expect(
					this.gamdomPage.map.kothProfileCardWageredAmount,
				).toBeVisible();
				const actualAmount =
					await this.gamdomPage.map.kothProfileCardWageredAmount.textContent();
				return actualAmount === formattedAmount;
			},
			{
				errorMessage: `KOTH wagered amount did not match expected value. Expected: ${formattedAmount}`,
				intervalSeconds: TimeoutSeconds.THREE,
				timeoutSeconds: TimeoutSeconds.ONE_TWENTY,
			},
		);
	}

	@step("Verify user KOTH wager amount in right table")
	public async verifyUserKothWaggerAmountRightTable(
		expectedAmount: number,
		username: string,
	): Promise<void> {
		const formattedAmount = formatCurrency(expectedAmount);

		await waitUntil(
			async () => {
				await this.gamdomPage.refresh();
				await waitForSeconds(2);
				await expect
					.poll(async () => {
						await this.gamdomPage.map.currentUserMarkKothUsersCardRightContainer.scrollIntoViewIfNeeded();
						return this.gamdomPage.map.currentUserMarkKothUsersCardRightContainer.isVisible();
					})
					.toBe(true);

				const userWageredAmountElement =
					this.gamdomPage.map.getUserWageredAmountUsersCardsRightContainerByUsername(
						username,
					);
				await expect(userWageredAmountElement).toBeVisible();
				const actualAmount =
					await userWageredAmountElement.textContent();
				return actualAmount === formattedAmount;
			},
			{
				errorMessage: `KOTH wagered amount for user '${username}' did not match expected value. Expected: ${formattedAmount}`,
				intervalSeconds: TimeoutSeconds.THREE,
				timeoutSeconds: TimeoutSeconds.NINETY,
			},
		);
	}
}
