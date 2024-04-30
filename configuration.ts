import { TestUserConfigurationObject } from "./core/types";
import { asString, getFilePath } from "./core/utils";

export const logLevel = "info";
export const createExecution: boolean = process.env.CI ? true : false;
export const reportName: string = getFilePath("results.xml", "./");
export const keystore: string = getFilePath("keystore.json", "./");

export const jira: Record<string, string> = {
	baseUrl: "https://gamdom.atlassian.net",
	projectKey: "ENG",
	username: asString(process.env.JIRA_USERNAME),
	token: asString(process.env.JIRA_TOKEN),
};
export const xray: Record<string, string> = {
	baseUrl: "https://xray.cloud.getxray.app",
	clientId: asString(process.env.XRAY_CLIENT_ID),
	clientSecret: asString(process.env.XRAY_CLIENT_SECRET),
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
