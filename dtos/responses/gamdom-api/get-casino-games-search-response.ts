export type CasinoGameStaticData = {
	game_code: string;
	name: string;
};

export type CasinoGamesSearchGame = {
	staticData: CasinoGameStaticData;
};

export type CasinoGamesSearchResponse = {
	games: CasinoGamesSearchGame[];
};
