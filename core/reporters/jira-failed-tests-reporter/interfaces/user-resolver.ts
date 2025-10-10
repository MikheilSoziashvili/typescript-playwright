export interface IUserResolver {
	resolveAccountId(email: string): string | null;
	getDefaultAccountId(): string;
	getDisplayName(accountId: string): string;
}
