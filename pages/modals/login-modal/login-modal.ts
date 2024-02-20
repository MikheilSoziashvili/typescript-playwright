import { Page } from "@playwright/test";
import { BaseModal } from "../../base/base-modal";
import { LoginModalMap } from "./login-modal-map";
import { LoginModalAsserter } from "./login-modal-asserter";
import { findUser } from "../../../utils";
import { TestUserConfigurationObject } from "../../../types";

export class LoginModal extends BaseModal<LoginModalMap> {
	constructor(page: Page) {
		super(page, new LoginModalMap(page));
	}

	public assertThat(): LoginModalAsserter {
		return new LoginModalAsserter(this);
	}

	// TODO: Add test data in a separate class
	public async fillInCredentials(
		username: string,
		password: string,
	): Promise<void> {
		await this.map.usernameField.fill(username);
		await this.map.usernameField.blur();

		await this.map.passwordField.fill(password);
		await this.map.passwordField.blur();
	}

	public async login(username: string, password: string): Promise<void> {
		await this.map.usernameField.fill(username);
		await this.map.passwordField.fill(password);
		await this.map.loginBtn.click();
	}

	public async loginAsUser(usernm: string): Promise<void> {
		const user: TestUserConfigurationObject | undefined = findUser({
			username: usernm,
		});
		if (user) {
			await this.map.usernameField.fill(user.username);
			await this.map.passwordField.fill(user.password);
			await this.map.loginBtn.click();
		}
	}
}
