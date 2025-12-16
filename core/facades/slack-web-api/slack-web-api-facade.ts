import { SlackWebApi } from "@api/slack/slack-web-api";
import { SlackWebApiAsserter } from "@core/api/asserters/slack-web-api-asserter";

export class SlackWebApiFacade {
	private slackWebApi?: SlackWebApi;

	public for(slackWebApi: SlackWebApi): this {
		this.slackWebApi = slackWebApi;
		return this;
	}

	public assertThat(): SlackWebApiAsserter {
		return new SlackWebApiAsserter(this);
	}

	public getClient(): SlackWebApi {
		if (!this.slackWebApi) {
			throw new Error("SlackWebApi instance not provided.");
		}

		return this.slackWebApi;
	}
}
