export interface MailpitAddress {
	Address: string;
	Name: string;
}

export interface MailpitMessageSummary {
	ID: string;
	MessageID: string;
	Subject: string;
	From: MailpitAddress;
	To: MailpitAddress[];
	Cc: MailpitAddress[];
	Bcc: MailpitAddress[];
	Created: string;
	Read: boolean;
	Size: number;
	Snippet: string;
	Attachments: number;
	Tags: string[];
}

export interface MailpitSearchResponse {
	messages: MailpitMessageSummary[];
	messages_count: number;
	total: number;
	unread: number;
	start: number;
	tags: string[];
}

export interface MailpitAttachment {
	ContentID: string;
	ContentType: string;
	FileName: string;
	PartID: string;
	Size: number;
}

export interface MailpitMessage {
	ID: string;
	MessageID: string;
	Subject: string;
	From: MailpitAddress;
	To: MailpitAddress[];
	Cc: MailpitAddress[];
	Bcc: MailpitAddress[];
	Date: string;
	HTML: string;
	Text: string;
	Size: number;
	Attachments: MailpitAttachment[];
	Tags: string[];
}
