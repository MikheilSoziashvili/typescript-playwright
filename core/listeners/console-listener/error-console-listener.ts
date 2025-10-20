import { Page, ConsoleMessage } from "@playwright/test";
import { BaseConsoleListener } from "./base-console-listener";

export class ErrorConsoleListener extends BaseConsoleListener {
	constructor(page: Page) {
		super(page);
		this.startListening();
	}

	protected shouldCaptureMessage(msg: ConsoleMessage): boolean {
		return msg.type() === "error";
	}

	public getErrorTexts(): string[] {
		return this.messages.map((m) => m.text());
	}
}
