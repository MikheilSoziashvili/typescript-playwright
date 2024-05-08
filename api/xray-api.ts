import * as Configuration from "../configuration";
import { BaseApi } from "./base-api";
import { prependXmlHeaderToFile } from "@core/utils";
import { Timeout } from "@enums/timeout";
import { APIResponse } from "@playwright/test";

export class XrayApi extends BaseApi {
	private APIToken = "";
	private headers: Record<string, string> = {};
	private xrayConfig: Record<string, string> = {};

	constructor(xrayConfig: Record<string, string> = Configuration.xray) {
		super(xrayConfig.baseUrl);
		this.xrayConfig = xrayConfig;
	}

	private async authenticate(): Promise<string> {
		const response = await this.post("/api/v2/authenticate", {
			client_id: this.xrayConfig.clientId,
			client_secret: this.xrayConfig.clientSecret,
		});
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

		this.headers["Content-Type"] = "application/xml";

		try {
			return await this.post(
				"/api/v2/import/execution/junit",
				data,
				this.headers,
				{ projectKey: projectKey, testExecKey: testExecutionKey },
				Timeout.EXTRA_LONG,
			);
		} catch (error: unknown) {
			const msg = "Error importing xml result";
			if (error instanceof Error) {
				throw new Error(`${msg}: ${error.message}`);
			}
			throw new Error(msg);
		}
	}
}
