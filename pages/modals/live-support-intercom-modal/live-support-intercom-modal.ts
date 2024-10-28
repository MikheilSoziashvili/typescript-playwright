import { BaseModal } from "@base/base-modal";
import { Page } from "@playwright/test";
import { LiveSupportModalAsserter } from "./live-support-intercom-modal-asserter";
import { LiveSupportModalMap } from "./live-support-intercom-modal-map";

export class LiveSupportModal extends BaseModal<LiveSupportModalMap> {
	constructor(page: Page) {
		super(page, new LiveSupportModalMap(page));
	}
	public assertThat(): LiveSupportModalAsserter {
		return new LiveSupportModalAsserter(this);
	}
}
