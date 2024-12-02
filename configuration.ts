import { TestUserConfigurationObject } from "@core/types/types";
import { asString, getFilePath } from "@core/utils/utils";
import "dotenv/config";

export const environment_url = process.env.CI
	? asString(process.env.ENVIRONMENT_URL)
	: "https://staging-for-e2e-tests.teamgamdom.com";
export const logLevel = "info";
//revert to false
export const createExecution: boolean = process.env.CI ? true : true;
// Disable here to keep the legacy slack reporter implementation
export const slackReporter: boolean = process.env.CI ? false : false;
export const reportName: string = getFilePath("results.xml", "./");
export const keystore: string = getFilePath("keystore.json", "./");

export const slack: Record<string, string | string[]> = {
	webHookUrl: asString(process.env.SLACK_REPORTER_WEBHOOK_URL),
	oAuthToken: asString(process.env.SLACK_BOT_USER_OAUTH_TOKEN),
	channels: ["playwright-e2e-reporting"],
};
export const jira: Record<string, string> = {
	baseUrl: "https://gamdom.atlassian.net",
	projectKey: "ENG",
	username: asString(process.env.JIRA_USERNAME),
	token: asString(process.env.JIRA_TOKEN),
};
export const mailinator: Record<string, string> = {
	baseUrl: "https://api.mailinator.com/api/v2",
	apiKey: asString(process.env.MAILINATOR_API_KEY),
};
export const xray: Record<string, string> = {
	baseUrl: "https://xray.cloud.getxray.app",
	clientId: asString(process.env.XRAY_CLIENT_ID),
	clientSecret: asString(process.env.XRAY_CLIENT_SECRET),
};

export const steam: Record<string, string> = {
	username: asString(process.env.STEAM_USERNAME),
	password: asString(process.env.STEAM_PASSWORD),
};

export const google: Record<string, string> = {
	email: asString(process.env.GOOGLE_EMAIL),
	password: asString(process.env.GOOGLE_PASSWORD),
	authSecret: asString(process.env.GOOGLE_AUTH_SECRET),
};

export const oxylabs: Record<string, string> = {
	username: asString(process.env.OXYLABS_USER),
	password: asString(process.env.OXYLABS_PASSWORD),
};

export const users: TestUserConfigurationObject[] = [
	{
		username: "superadmin",
		password: "password",
		role: "admin",
		tags: ["SuperAdmin"],
		additional_info: "",
	},
	{
		username: "superadmin1",
		password: "password",
		role: "admin",
		tags: ["SuperAdmin"],
		additional_info: "",
	},
	{
		username: "superadmin2",
		password: "password",
		role: "admin",
		tags: ["SuperAdmin"],
		additional_info: "",
	},
	{
		username: "superadmin3",
		password: "password",
		role: "admin",
		tags: ["SuperAdmin"],
		additional_info: "",
	},
	{
		username: "superadmin4",
		password: "password",
		role: "admin",
		tags: ["SuperAdmin"],
		additional_info: "",
	},
	{
		username: "superadmin5",
		password: "password",
		role: "admin",
		tags: ["SuperAdmin"],
		additional_info: "",
	},
	{
		username: "supportadmin",
		password: "password",
		role: "admin",
		tags: ["SupportStaff"],
		additional_info: "",
	},
	{
		username: "marketingadmin",
		password: "password",
		role: "admin",
		tags: ["MarketingStaff"],
		additional_info: "",
	},
	{
		username: "vipadmin",
		password: "password",
		role: "admin",
		tags: ["VIPStaff"],
		additional_info: "",
	},
	{
		username: "socialadmin",
		password: "password",
		role: "admin",
		tags: ["SocialMediaStaff"],
		additional_info: "",
	},
	{
		username: "moderator1",
		password: "password",
		role: "moderator",
		tags: [],
		additional_info: "",
	},
	{
		username: "moderator2",
		password: "password",
		role: "moderator",
		tags: [],
		additional_info: "not email verified",
	},
	{
		username: "streamer1",
		password: "password",
		role: "user",
		tags: ["streamer", "streamervip"],
		affCode: "streamer1",
		additional_info: "",
	},
	{
		username: "streamer2",
		password: "password",
		role: "user",
		tags: ["streamer", "marketing2"],
		affCode: "streamer2",
		additional_info: "",
	},
	{
		username: "user1",
		password: "password",
		role: "user",
		tags: [],
		affCode: "streamer1",
		additional_info: "",
	},
	{
		username: "user2",
		password: "password",
		role: "user",
		tags: [],
		affCode: "streamer1",
		additional_info: "",
	},
	{
		username: "user3",
		password: "password",
		role: "user",
		tags: [],
		affCode: "streamer2",
		additional_info: "",
	},
	{
		username: "user4",
		password: "password",
		role: "user",
		tags: ["marketing1"],
		additional_info: "",
	},
	{
		username: "user5",
		password: "password",
		role: "user",
		tags: [],
		additional_info: "not email verified",
	},
];
