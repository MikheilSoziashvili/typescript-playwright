import * as Configuration from "../configuration";
import { BaseApi } from "./base-api";
import { prependXmlHeaderToFile } from "@core/utils";
import { Timeout } from "@enums/timeout";
import { APIResponse } from "@playwright/test";
import { RequestParameters } from "../core/api/interfaces/request-parameters";

export class XrayApi extends BaseApi {
	private APIToken = "";
	private headers: Record<string, string> = {};
	private xrayConfig: Record<string, string> = {};

	constructor(xrayConfig: Record<string, string> = Configuration.xray) {
		super(xrayConfig.baseUrl);
		this.xrayConfig = xrayConfig;
	}

	private async authenticate(): Promise<string> {
		const parameters: RequestParameters = {
			endpoint: "/api/v2/authenticate",
			data: {
				client_id: this.xrayConfig.clientId,
				client_secret: this.xrayConfig.clientSecret,
			},
		};
		const response = await this.post(parameters);
		return (await response.json()) as string;
	}

	public async initialize(): Promise<void> {
		this.APIToken = await this.authenticate();
		this.headers["Authorization"] = `Bearer ${this.APIToken}`;
	}

	public async importXmlResult(
		testExecutionKey: string,
		projectKey: string = Configuration.jira.projectKey,
	): Promise<APIResponse> {
		const data = await prependXmlHeaderToFile(Configuration.reportName);

		const parameters: RequestParameters = {
			endpoint: "/api/v2/import/execution/junit",
			headers: {
				"Content-Type": "application/xml",
				Authorization: `Bearer ${this.APIToken}`,
			},
			data: data,
			params: { projectKey: projectKey, testExecKey: testExecutionKey },
			timeout: Timeout.EXTRA_LONG,
		};

		try {
			return await this.post(parameters);
		} catch (error: unknown) {
			const msg = "Error importing xml result";
			if (error instanceof Error) {
				throw new Error(`${msg}: ${error.message}`);
			}
			throw new Error(msg);
		}
	}
}
