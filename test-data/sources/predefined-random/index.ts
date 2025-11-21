import { generateRandomString, getRandomEmail } from "@core/utils/utils";

export const predefinedRandom = {
	notifications: {
		longTitle: generateRandomString({ length: 30 }),
	},
	chatMessages: {
		pinnedMessage: generateRandomString({
			prefix: "chat_pin_test_",
		}),
	},
	promoCodes: {
		campaignName: generateRandomString({ prefix: "name_value_" }),
		campaignCode: generateRandomString({
			prefix: "code_value_",
		}),
	},
	emails: {
		forgotPassword: getRandomEmail(),
	},
	casinoGames: {
		playerName: generateRandomString({
			prefix: "Player_",
		}),
	},
};
