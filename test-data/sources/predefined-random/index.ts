import { generateRandomString } from "@core/utils/utils";

export const predefinedRandom = {
	notifications: {
		longTitle: generateRandomString({ length: 30 }),
	},
	chatMessages: {
		pinnedMessage: generateRandomString({
			prefix: "chat_pin_test_",
		}),
	},
};
