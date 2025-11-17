import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { NewUsersAdminAsserter } from "./new-users-admin-page-asserter";
import { NewUsersAdminMap } from "./new-users-admin-page-map";
import { NewUsersAdminSteps } from "./new-users-admin-page-steps";
import { NEW_USERS_ADMIN_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { step } from "decorators/step";
import { NewUserAttribute } from "@enums/admin/new-user-attributes";
import { Datepicker } from "@pages/components/datepicker/datepicker";
import { Toast } from "@pages/components/toast/toast";

export class NewUsersAdminPage extends BasePage<NewUsersAdminMap> {
	protected datepicker: Datepicker;
	public toast: Toast;

	public constructor(page: Page) {
		super(page, new NewUsersAdminMap(page));
		this.datepicker = new Datepicker(page);
		this.toast = new Toast(page);
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [NEW_USERS_ADMIN_PAGE_ENDPOINT] },
		});
	}

	@step("Click 'Between Dates' filter")
	public async clickBetweenDatesFilter(): Promise<void> {
		await this.map.betweenDatesCheckbox.click();
	}

	@step("Click 'Between User IDs' filter")
	public async clickBetweenUserIDsFilter(): Promise<void> {
		await this.map.betweenUserIDsCheckbox.click();
	}

	@step("Click 'Fetch Users' button")
	public async clickFetchUsersButton(): Promise<void> {
		await this.map.fetchNewUsersSettingsButton.click();
	}

	@step("Select new users attributes to be fetched")
	public async selectNewUsersAttributes(
		...newUserAttributes: NewUserAttribute[]
	): Promise<void> {
		const newUserAttrs =
			newUserAttributes.length === 0
				? Object.values(NewUserAttribute)
				: newUserAttributes;

		await Promise.all(
			newUserAttrs.map(async (attr) => {
				await this.map
					.newUsersAttributeCheckbox(attr)
					// eslint-disable-next-line playwright/no-force-option -- without force: true getting 'div' subtree intercepts pointer events
					.click({ force: true });
			}),
		);
	}

	@step("Pick Between Dates start date: N days relative to today (calendar)")
	public async pickBetweenDatesStartDate(daysOffset: number): Promise<void> {
		await this.datepicker.pickDateRelativeIn(
			this.map.betweenDatesStartDateField,
			daysOffset,
		);
	}

	@step("Fill 'Between User IDs' filter start/end user ID range")
	public async fillBetweenUserIDsStartEndRange(
		startUserID: number | string,
		endUserID: number | string,
	): Promise<void> {
		await this.map.betweenUserIDsStartUserIDField.fill(`${startUserID}`);
		await this.map.betweenUserIDsEndUserIDField.fill(`${endUserID}`);
	}

	public override assertThat(): NewUsersAdminAsserter {
		return new NewUsersAdminAsserter(this);
	}

	public steps(): NewUsersAdminSteps {
		return new NewUsersAdminSteps(this);
	}
}
