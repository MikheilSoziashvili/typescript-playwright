export interface MessagePart {
	body: string;
}

export interface Message {
	id: string;
	subject: string;
	parts: MessagePart[];
}

export interface MessagesResponse {
	msgs: Message[];
}

export interface EmailResponse {
	id: string;
	from: string;
	seconds_ago: number;
	headers: Record<string, string>;
}

export interface EmailLinksResponse {
	links: string[];
}
