export interface Provider {
	id: number;
	provider_name: string;
	blocked_countries: string[];
	priority: number;
	allowed_currencies: string[] | null;
	disabled: boolean;
	imported_from: string;
	provider_id: string;
	producer_id: string;
	provider_url_thumb: string | null;
	modified_date: string;
	beta_users_only: boolean;
}
