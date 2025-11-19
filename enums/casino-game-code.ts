export type CasinoGameCodeEntry = {
	name: string;
	code: string;
};

export const CasinoGameCode: Record<string, CasinoGameCodeEntry> = {
	BOOK_OF_PYRAMIDS: {
		name: "Book of Pyramids",
		code: "BookOfPyramids",
	},
	CASH_VAULT_I: {
		name: "Cash Vault I",
		code: "cash_vault_i",
	},
	MYSTIC_CHIEF: {
		name: "Mystic Chief",
		code: "pp_direct_vswayswest",
	},
	BOOK_OF_ARABIA: {
		name: "Book Of Arabia",
		code: "wicked_bookofarabia",
	},
};
