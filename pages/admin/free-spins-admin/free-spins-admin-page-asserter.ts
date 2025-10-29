import { BaseAsserter } from "@base/base-asserter";
import { FreeSpinsAdminPage } from "./free-spins-admin-page";
import { step } from "decorators/step";
import { expect } from "@playwright/test";
import { CasinoGameName } from "@enums/casino-game";
import { Toast } from "@pages/components/toast/toast";

export class FreeSpinsAdminPageAsserter extends BaseAsserter<FreeSpinsAdminPage> {
	private readonly toast: Toast;

	public constructor(page: FreeSpinsAdminPage) {
		super(page);
		this.toast = new Toast(this.gamdomPage.page);
	}

	@step("Free spins are revoked")
	public async freeSpinsAreRevoked(): Promise<void> {
		await expect(this.gamdomPage.map.freeSpinsActionButton).toBeEmpty();
	}

	@step("Top played slots container is not displayed")
	public async topPlayedSlotsContainerIsNotDisplayed(): Promise<void> {
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.topPlayedSlotsContainer,
		]);
	}

	@step("Top played slots container is displayed")
	public async topPlayedSlotsContainerIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.topPlayedSlotsContainer,
		]);
	}

	@step("Assert Top Played Slots table row count")
	public async topPlayedSlotsTableHasRows(
		expectedCount: number,
	): Promise<void> {
		await expect(this.gamdomPage.map.topPlayedSlotsVisibleRows).toHaveCount(
			expectedCount,
		);
	}

	@step("Assert game is visible in Top Played Slots table")
	public async gameIsVisibleInTopPlayedSlots(
		gameName: CasinoGameName,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.getTopPlayedSlotsRowByGameName(gameName),
		).toBeVisible();
	}

	@step(
		"Verify table is displayed, has expected number of rows and game name is displayed",
	)
	public async verifyTopPlayedSlotsTableShowsCorrectGameAndRowCount(
		expectedRowCount: number,
		expectedGame: CasinoGameName,
	): Promise<void> {
		await this.gamdomPage.assertThat().topPlayedSlotsContainerIsDisplayed();
		await this.gamdomPage
			.assertThat()
			.topPlayedSlotsTableHasRows(expectedRowCount);
		await this.gamdomPage
			.assertThat()
			.gameIsVisibleInTopPlayedSlots(expectedGame);
	}
	@step("Assert toast notifications for batch result are displayed")
	public async batchToastsAreDisplayed(
		expectedToasts: { title: string; subTitle: string }[],
	): Promise<void> {
		await this.toast.assertThat().titlesAre(expectedToasts);
	}

	@step("Assert batch result popup is displayed and user counts are correct")
	public async batchResultsPopupIsDisplayed(
		expectedSuccessfulUsers: number,
		expectedFailedUsers: number,
	): Promise<void> {
		const popup = this.gamdomPage.map.batchFreeSpinsPopUpContainer;
		await this.checkElementsAreVisible([popup]);

		const successfulUsers =
			await this.gamdomPage.map.getBatchFreeSpinsPopUpSuccessfulUsersCount();
		const failedUsers =
			await this.gamdomPage.map.getBatchFreeSpinsPopUpFailedUsersCount();
		const totalUsers =
			await this.gamdomPage.map.getBatchFreeSpinsPopUpTotalProcessedUsersCount();

		await this.checkStringElementsAreEqual(
			[
				expectedSuccessfulUsers.toString(),
				expectedFailedUsers.toString(),
				(expectedSuccessfulUsers + expectedFailedUsers).toString(),
			],
			[
				successfulUsers.toString(),
				failedUsers.toString(),
				totalUsers.toString(),
			],
		);
	}
}
