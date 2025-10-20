import { Page, ConsoleMessage } from "@playwright/test";

export abstract class BaseConsoleListener {
	protected readonly page: Page;
	protected messages: ConsoleMessage[] = [];

	constructor(page: Page) {
		this.page = page;
	}

	protected abstract shouldCaptureMessage(msg: ConsoleMessage): boolean;

	public startListening(): void {
		this.page.on("console", (msg: ConsoleMessage) => {
			if (this.shouldCaptureMessage(msg)) {
				this.messages.push(msg);
			}
		});
	}

	public clearMessages(): void {
		this.messages = [];
	}

	public getMessages(): ConsoleMessage[] {
		return this.messages;
	}
}
