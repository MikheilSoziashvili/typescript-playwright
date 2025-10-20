import { Page, Response as PWResponse } from "@playwright/test";

export abstract class BaseNetworkListener {
	protected readonly page: Page;
	protected responses: PWResponse[] = [];

	constructor(page: Page) {
		this.page = page;
	}

	protected abstract shouldCaptureResponse(url: string): boolean;

	public startListening(): void {
		this.page.on("response", (res: PWResponse) => {
			const url = res.url();
			if (this.shouldCaptureResponse(url)) {
				this.responses.push(res);
			}
		});
	}

	public clearResponses(): void {
		this.responses = [];
	}

	public getResponses(): PWResponse[] {
		return this.responses;
	}
}
