import { PayloadType } from "@core/types/types";

export interface RequestParameters {
	endpoint: string;
	headers?: Record<string, string>;
	data?: PayloadType;
	queryParams?: Record<string, string>;
	timeout?: number;
}
