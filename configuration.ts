import { tr } from "@faker-js/faker";
import { TestUserConfigurationObject } from "./core/types";
import { getFilePath } from "./core/utils";

export const logLevel = "info";
export const createExecution: boolean = process.env.CI ? true : false;
export const reportName: string = getFilePath("results.xml", "./");
export const keystore: string = getFilePath("keystore.json", "./");

export const jira: Record<string, string> = {
	baseUrl: "https://gamdom.atlassian.net",
	projectKey: "QA",
	username: "svetoslav@teamgamdom.com",
	token: "ATATT3xFfGF0-Irm_9ielcXkBzEExePR8829sVSS8C6J5EcB17dqUhVRZ84od23sse3w_6xeuqSktS1Ubf0vg6lV5TcK0bFMTghPa32IYPugFtt_bca7ttpEzxn9_tC46Z-mlOwUoYe1RkH1nt7xV1cpalTUUpwvT5PXI_djQapB4U3EBLUhw2I=6AA17D65",
};
export const xray: Record<string, string> = {
	baseUrl: "https://xray.cloud.getxray.app",
	clientId: "C75A05CA9D9C4D1696F160C8618AC7EC",
	clientSecret:
		"a4568714fb23a430645da341e2b1475c94b787e18a4777154f933d841d67ff8c",
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
