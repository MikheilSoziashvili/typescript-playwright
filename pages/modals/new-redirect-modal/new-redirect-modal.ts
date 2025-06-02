import { BasePage } from "@pages/base/base-page";
import { Page } from "@playwright/test";
import { NewRedirectModalMap } from "./new-redirect-modal-map";
import { NewRedirectModalSteps } from "./new-redirect-modal-steps";
import { NewRedirectModalAsserter } from "./new-redirect-modal-asserter";
import { step } from "decorators/step";
import { Toast } from "@pages/components/toast/toast";

export class NewRedirectModal extends BasePage<NewRedirectModalMap> {
	public readonly toast: Toast;

	constructor(page: Page) {
		super(page, new NewRedirectModalMap(page));
		this.toast = new Toast(page);
	}

	public steps(): NewRedirectModalSteps {
		return new NewRedirectModalSteps(this);
	}

	public assertThat(): NewRedirectModalAsserter {
		return new NewRedirectModalAsserter(this);
	}

	@step()
	private async fillRedirectFrom(fromPath: string): Promise<void> {
		await this.map.fromPathInput.fill(fromPath);
	}

	@step()
	private async fillRedirectTo(toPath: string): Promise<void> {
		await this.map.toPathInput.fill(toPath);
	}

	@step()
	public async fillRedirectFields(
		fromPath: string,
		toPath: string,
	): Promise<void> {
		await this.fillRedirectFrom(fromPath);
		await this.fillRedirectTo(toPath);
	}

	@step()
	public async clickCreateRedirectButton(): Promise<void> {
		await this.map.createRedirectButton.click();
	}

	@step()
	public async clickEditRedirectButton(): Promise<void> {
		await this.map.editRedirectButton.click();
	}
}
