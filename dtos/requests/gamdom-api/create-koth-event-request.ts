export type CreateKothEventRequest = {
	start_date: string;
	end_date: string;
	event_name: string;
	event_type: string;
	max_winners: number;
	prize_coins: number;
	game_code: string | null;
};
