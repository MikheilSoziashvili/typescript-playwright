import { APIResponse } from "@playwright/test";
import { BaseApi } from "./base-api";
import * as Configuration from "../configuration";
import { encodeCredentials } from "@core/utils/utils";
import { PayloadType } from "@core/types/types";

export class JiraApi extends BaseApi {
	private jiraConfig: Record<string, string>;

	constructor(jiraConfig: Record<string, string> = Configuration.jira) {
		super(jiraConfig.baseUrl);
		this.jiraConfig = jiraConfig;

		this.setHeaders({
			"Content-Type": "application/json",
			Authorization: `Basic ${encodeCredentials(
				this.jiraConfig.username,
				this.jiraConfig.token,
			)}`,
			Origin: this.jiraConfig.baseUrl,
		});
	}

	public async createExecution(
		data: PayloadType,
		_headers?: Record<string, string>,
	): Promise<APIResponse> {
		const parameters = this.buildParameters(
			"/rest/api/2/issue",
			data,
			_headers,
		);
		return this.post(parameters);
	}
}
