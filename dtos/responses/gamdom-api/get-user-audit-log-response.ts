export type UserAuditLogEntry = {
	user_id: number;
	created: string;
	coins_delta: number;
	delta_in_unit?: number;
	balance_after?: number | null;
	wallet_unit?: string | null;
	crypto_rate?: number | null;
	log_type: string;
	log_type_detail: string;
	source_table: string | null;
	source_id?: number | null;

	full_row: {
		id: number;
		user_id: number;
		coins_delta: number;
		log_type: string;
		log_type_detail: string;
		source_table: string | null;
		source_id: number | null;
		created: string;
		unique_key: string | null;

		meta: {
			type: string;
			action: string;
			changes: {
				e_sports_player_category: {
					new: string;
					old: string;
				};
				[key: string]:
					| {
							new: string;
							old: string;
					  }
					| undefined;
			};
			admin_id: number;
			affected_user_id: number;
		};
	};
};

export type UserAuditLogResponse = UserAuditLogEntry[];
