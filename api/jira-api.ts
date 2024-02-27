import { APIResponse } from "@playwright/test";
import { BaseApi } from "./base-api";
import * as Configuration from "../configuration";
import { encodeCredentials } from "../core/utils";

export class JiraApi extends BaseApi {
	private headers: Record<string, string> = {};
	private jiraConfig: Record<string, string> = {};

	constructor(jiraConfig: Record<string, string> = Configuration.jira) {
		super(jiraConfig.baseUrl);
		this.jiraConfig = jiraConfig;

		this.headers = {
			"Content-Type": "application/json",
			Authorization: `Basic ${encodeCredentials(
				this.jiraConfig.username,
				this.jiraConfig.token,
			)}`,
			Origin: this.jiraConfig.baseUrl,
		};
	}

	public async createExecution(
		data: object,
		_headers?: Record<string, string>,
	): Promise<APIResponse> {
		return this.post(
			"/rest/api/2/issue",
			data,
			_headers ? { ...this.headers, ..._headers } : this.headers,
		);
	}
}
