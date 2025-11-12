export type CasinoGameCodeEntry = {
	name: string;
	code: string;
};

export const CasinoGameCode: Record<string, CasinoGameCodeEntry> = {
	MYSTIC_CHIEF: {
		name: "Mystic Chief",
		code: "pp_direct_vswayswest",
	},
	BOOK_OF_ARABIA: {
		name: "Book Of Arabia",
		code: "wicked_bookofarabia",
	},
};
