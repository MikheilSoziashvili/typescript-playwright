import { BaseAsserter } from "@pages/base/base-asserter";
import { EventsManagingAdminPage } from "./events-managing-admin-page";

export class EventsManagingAdminAsserter extends BaseAsserter<EventsManagingAdminPage> {
	public constructor(page: EventsManagingAdminPage) {
		super(page);
	}
}
