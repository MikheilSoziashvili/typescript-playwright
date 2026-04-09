import { HttpStatus } from "@enums/http-status";
import * as Configuration from "../configuration";
import { BaseApi } from "./base-api";

export class DropboxApi extends BaseApi {
	constructor(dropboxConfig: Record<string, string> = Configuration.dropbox) {
		super(dropboxConfig.baseUrl);
		this.setHeaders({
			"Content-Type": "text/html",
			"User-Agent":
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
		});
	}

	public async checkUrlIsReachable(url: string): Promise<void> {
		await this.get(
			{ endpoint: url },
			{ expectedStatus: HttpStatus.BAD_REQUEST },
		);
	}
}
