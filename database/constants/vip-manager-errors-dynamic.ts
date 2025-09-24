export const VipManagerDynamicErrorMessages = {
	FAILED_TO_UPDATE_VIP_STATUS: (userId: string): string =>
		`User #${userId} - Failed to update with new status. Error: "User id:${userId} is not found"`,
	FAILED_TO_REMOVE_VIP_STATUS: (userId: string): string =>
		`User #${userId} - Failed to remove VIP status. Error: "User with id:${userId} is not found"`,
};
