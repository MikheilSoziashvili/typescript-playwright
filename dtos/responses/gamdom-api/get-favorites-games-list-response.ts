export type FavoritesGame = {
	staticData: {
		game_code: string;
		name: string;
		provider_id: string;
	};
};

export type FavoritesGamesListGroup = {
	totalCount: number;
	gamesList: FavoritesGame[];
};

export type FavoritesGamesListResponse = {
	games: FavoritesGamesListGroup[];
};
