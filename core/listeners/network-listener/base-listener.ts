import { WaitOptions } from "@core/types/types";
import { waitUntil } from "@core/utils/utils";
import { Timeout } from "@enums/timeout";
import { Page, Response as PWResponse } from "@playwright/test";

const DEFAULT_WAIT_OPTIONS: WaitOptions = {
	intervalSeconds: Timeout.EXTRA_SHORT,
	timeoutSeconds: Timeout.LONG,
	errorMessage: "Timed out while waiting for network response",
};

export abstract class BaseNetworkListener {
	protected readonly page: Page;
	protected responses: PWResponse[] = [];

	private responseHandler?: (res: PWResponse) => void;

	constructor(page: Page) {
		this.page = page;
	}

	protected abstract shouldCaptureResponse(url: string): boolean;

	public startListening(): void {
		if (this.responseHandler) {
			return;
		}

		this.responseHandler = (res: PWResponse) => {
			const url = res.url();
			if (this.shouldCaptureResponse(url)) {
				this.responses.push(res);
			}
		};

		this.page.on("response", this.responseHandler);
	}

	public stopListening(): void {
		if (!this.responseHandler) {
			return;
		}

		this.page.off("response", this.responseHandler);
		this.responseHandler = undefined;
	}

	public clearResponses(): void {
		this.responses = [];
	}

	public getResponses(): PWResponse[] {
		return this.responses;
	}

	protected async getLastJson<T>(): Promise<T | undefined> {
		const lastResponse = this.responses.at(-1);
		if (!lastResponse) {
			return undefined;
		}
		return lastResponse.json() as Promise<T>;
	}

	protected async waitForLastJson<T>(
		options: Partial<WaitOptions> = {},
	): Promise<T> {
		const mergedOptions: WaitOptions = {
			intervalSeconds:
				options.intervalSeconds ?? DEFAULT_WAIT_OPTIONS.intervalSeconds,
			timeoutSeconds:
				options.timeoutSeconds ?? DEFAULT_WAIT_OPTIONS.timeoutSeconds,
			errorMessage:
				options.errorMessage ?? DEFAULT_WAIT_OPTIONS.errorMessage,
		};

		let latestPayload: T | undefined;

		await waitUntil(
			async () => {
				const lastResponse = this.responses.at(-1);
				if (!lastResponse) {
					return false;
				}

				latestPayload = (await lastResponse.json()) as T;
				return latestPayload !== undefined;
			},
			{
				errorMessage: mergedOptions.errorMessage,
				intervalSeconds: mergedOptions.intervalSeconds,
				timeoutSeconds: mergedOptions.timeoutSeconds,
			},
		);

		if (!latestPayload) {
			throw new Error(
				"Unexpected: no latestPayload after waitUntil succeeded",
			);
		}

		return latestPayload;
	}
}
