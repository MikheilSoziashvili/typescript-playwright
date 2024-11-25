export const ToastSubTitleDynamic = {
	INVALID_USER_ID: (userId: string): string =>
		`GamdomMessage: User id:${userId} is not found`,
	INVALID_USER_WITH_ID: (userId: string): string =>
		`GamdomMessage: User with id:${userId} is not found`,
};
