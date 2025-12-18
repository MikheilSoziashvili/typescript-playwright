import { JiraUser } from "@enums/jira/jira-users";

const domain = "@teamgamdom.com";

export const jiraUserMap: Record<string, string> = {
	[`${JiraUser.IVAYLO_STOYCHEV}${domain}`]:
		"712020:783e62d9-8ec7-4473-9321-af2960a8e672",
	[`${JiraUser.NIKOLAY_GENOV}${domain}`]:
		"712020:f621ffc2-c0d4-49f3-a670-7ffc54f541f4",
	[`${JiraUser.ANGEL_PETROV}${domain}`]:
		"712020:8b4976ce-df56-4c13-a352-f2bdc0c40f38",
	[`${JiraUser.SVETOSLAV_LAZAROV}${domain}`]:
		"712020:654320ee-3225-462d-b066-57da9c3b7fd5",
	[`${JiraUser.RALUCA_ARITON}${domain}`]:
		"712020:3187a40d-331f-47c1-b4bb-bcba6e1c33a7",
	[`${JiraUser.YUKSEL_CHAUSH}${domain}`]:
		"712020:cf93d769-68ed-4c7b-acc5-3dec0eea83f5",
};
