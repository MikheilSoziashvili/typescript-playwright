import { SqlValue } from "../types";

export interface QueryRequest {
	text: string;
	values?: SqlValue[];
}
