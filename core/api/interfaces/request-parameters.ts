import { PayloadType } from "@core/types";

export interface RequestParameters {
	endpoint: string;
	headers?: Record<string, string>;
	data?: PayloadType;
	params?: Record<string, string>;
	timeout?: number;
}
