import { GamdomApi } from "@api/gamdom-api";
import { UserWithConfig } from "@core/types/types";
import { GamdomDb } from "database/gamdom-db";

export async function createUsers(
	usersWithConfigs: UserWithConfig[],
	gamdomDb: GamdomDb,
): Promise<void> {
	await Promise.all(
		usersWithConfigs.map(({ userData, config }) =>
			gamdomDb.createNewUser({
				username: userData.username,
				password: userData.password,
				email: userData.email,
				...config,
			}),
		),
	);
}

export async function getUserIds(
	usersWithConfigs: UserWithConfig[],
	gamdomApi: GamdomApi,
): Promise<Record<string, number>> {
	const userIds: Record<string, number> = {};

	for (const { role, userData } of usersWithConfigs) {
		const userId = (
			await gamdomApi.getBasicInfo(userData.username, userData.password)
		).user.id;

		userIds[role] = userId;
	}

	return userIds;
}
