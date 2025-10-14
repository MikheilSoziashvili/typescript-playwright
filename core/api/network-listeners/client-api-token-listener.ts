import { buildInitTokenEndpoint } from "@core/helpers/endpoint-builder";
import { GetGameInitResponse } from "@dtos/responses/gamdom-api/get-game-init-response";
import { Currency } from "@enums/currencies";
import type { Page } from "@playwright/test";
import { BaseNetworkListener } from "./base-listener";

export class ClientApiInitListener extends BaseNetworkListener {
	private gameKey!: string;

	constructor(page: Page) {
		super(page);
	}

	public setGame(game: string): void {
		this.gameKey = game.toLowerCase();
	}

	protected shouldCaptureResponse(url: string): boolean {
		return url.includes(buildInitTokenEndpoint(this.gameKey));
	}

	public async getLastDisplayCurrency(): Promise<Currency | undefined> {
		const latestPayloads = await Promise.all(
			this.responses.map((r) => r.json() as Promise<GetGameInitResponse>),
		);
		return latestPayloads.at(-1)?.wallet.info.displayCurrency;
	}
}
