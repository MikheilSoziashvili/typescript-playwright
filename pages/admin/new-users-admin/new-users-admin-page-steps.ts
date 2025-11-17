import { BasePageStep } from "@pages/base/base-page-step";
import { NewUsersAdminPage } from "./new-users-admin-page";
import { step } from "decorators/step";

export class NewUsersAdminSteps extends BasePageStep<NewUsersAdminPage> {
	public constructor(page: NewUsersAdminPage) {
		super(page);
	}

	@step("Select 'Between Dates' filter")
	public async selectBetweenDatesFilter(): Promise<void> {
		await this.gamdomPage.clickBetweenDatesFilter();
		await this.gamdomPage.assertThat().betweenDatesFilterSelected();
	}

	@step("Select 'Between User IDs' filter")
	public async selectBetweenUserIDsFilter(): Promise<void> {
		await this.gamdomPage.clickBetweenUserIDsFilter();
		await this.gamdomPage.assertThat().betweenUserIDsFilterSelected();
	}

	@step(
		"Fetch users (all attributes) by 'Between Dates' filter - last N days",
	)
	public async fetchUsersByBetweenDatesFilter(
		beforeDays: number,
	): Promise<void> {
		await this.selectBetweenDatesFilter();
		await this.gamdomPage.pickBetweenDatesStartDate(beforeDays);
		await this.gamdomPage.selectNewUsersAttributes();

		await this.gamdomPage.clickFetchUsersButton();
		await this.gamdomPage.assertThat().toastMessageSuccessfulFetchVisible();
	}

	@step("Fetch users (all attributes) by 'Between User IDs' filter")
	public async fetchUsersByBetweenUserIDsFilter(
		startUserID: number | string,
		endUserID: number | string,
	): Promise<void> {
		await this.selectBetweenUserIDsFilter();
		await this.gamdomPage.fillBetweenUserIDsStartEndRange(
			startUserID,
			endUserID,
		);
		await this.gamdomPage.selectNewUsersAttributes();

		await this.gamdomPage.clickFetchUsersButton();
		await this.gamdomPage.assertThat().toastMessageSuccessfulFetchVisible();
	}
}
