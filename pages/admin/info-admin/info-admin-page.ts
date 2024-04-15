import { Page } from "@playwright/test";
import { BasePage } from "../../base/base-page";
import { InfoAdminPageMap } from "./info-admin-page-map";
import { INFO_ADMIN_PAGE_ENDPOINT } from "../../../constants/page-endpoints";
import { InfoAdminPageAsserter } from "./info-admin-page-asserter";
import { InfoAdminPageSteps } from "./info-admin-page-steps";

export class InfoAdminPage extends BasePage<InfoAdminPageMap> {
	public constructor(page: Page) {
		super(page, new InfoAdminPageMap(page));
	}

	public override async navigate(options: { id: string }): Promise<void> {
		await this.page.goto(`${INFO_ADMIN_PAGE_ENDPOINT}/${options.id}`);
	}

	public override assertThat(): InfoAdminPageAsserter {
		return new InfoAdminPageAsserter(this);
	}

	public steps(): InfoAdminPageSteps {
		return new InfoAdminPageSteps(this);
	}
}
