import { APIResponse } from "@playwright/test";
import { BaseApi } from "./base-api";
import * as Configuration from "../configuration";
import { encodeCredentials } from "@core/utils";
import { RequestParameters } from "./request-parameters";

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
		const parameters: RequestParameters = {
			endpoint: "/rest/api/2/issue",
			headers: _headers ? { ...this.headers, ..._headers } : this.headers,
			data: data as Record<string, string | number | boolean | object>,
		};
		return this.post(parameters);
	}
}
