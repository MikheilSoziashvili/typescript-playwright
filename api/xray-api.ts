import * as Configuration from "../configuration";
import { BaseApi, RequestOptions } from "./base-api";
import { prependXmlHeaderToFile } from "@core/utils/utils";
import { Timeout } from "@enums/timeout";
import { APIResponse } from "@playwright/test";
import { RequestParameters } from "../core/api/interfaces/request-parameters";

export class XrayApi extends BaseApi {
	private APIToken = "";
	private xrayConfig: Record<string, string> = {};

	constructor(xrayConfig: Record<string, string> = Configuration.xray) {
		super(xrayConfig.baseUrl);
		this.xrayConfig = xrayConfig;

		this.setHeaders({
			"Content-Type": "application/json",
		});
	}

	private async authenticate(): Promise<string> {
		const parameters: RequestParameters = this.buildParameters(
			"/api/v2/authenticate",
			{
				client_id: this.xrayConfig.clientId,
				client_secret: this.xrayConfig.clientSecret,
			},
		);
		const response = await this.post(parameters);
		return (await response.json()) as string;
	}

	public async initialize(): Promise<void> {
		this.APIToken = await this.authenticate();
		this.setHeaders({
			Authorization: `Bearer ${this.APIToken}`,
		});
	}

	public async importXmlResult(
		testExecutionKey: string,
		projectKey: string = Configuration.jira.projectKey,
		options?: RequestOptions,
	): Promise<APIResponse> {
		const data = await prependXmlHeaderToFile(Configuration.reportName);

		const parameters = this.buildParameters(
			"/api/v2/import/execution/junit",
			data,
			{
				"Content-Type": "application/xml",
			},
		);

		parameters.params = {
			projectKey: projectKey,
			testExecKey: testExecutionKey,
		};

		try {
			return await this.post(parameters, {
				...options,
				timeout: Timeout.MAX,
			});
		} catch (error: unknown) {
			const msg = "Error importing xml result";
			if (error instanceof Error) {
				throw new Error(`${msg}: ${error.message}`);
			}
			throw new Error(msg);
		}
	}
}
