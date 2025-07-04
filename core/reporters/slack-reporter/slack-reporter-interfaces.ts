/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface FileUploadResult {
	ok: boolean;
	files: FileWrapper[];
}

export interface FileWrapper {
	ok: boolean;
	files: File[];
	response_metadata: ResponseMetadata;
}

export interface File {
	id: string;
	created: number;
	timestamp: number;
	name: string;
	title: string;
	mimetype: string;
	filetype: string;
	pretty_type: string;
	user: string;
	user_team: string;
	editable: boolean;
	size: number;
	mode: string;
	is_external: boolean;
	external_type: string;
	is_public: boolean;
	public_url_shared: boolean;
	display_as_bot: boolean;
	username: string;
	url_private: string;
	url_private_download: string;
	permalink: string;
	permalink_public: string;
	edit_link: string;
	preview: string;
	preview_highlight: string;
	lines: number;
	lines_more: number;
	preview_is_truncated: boolean;
	comments_count: number;
	is_starred: boolean;
	shares: Shares;
	channels: unknown[];
	groups: unknown[];
	ims: unknown[];
	has_more_shares: boolean;
	has_rich_preview: boolean;
	file_access: string;
}

export interface Shares {}

export interface ResponseMetadata {
	scopes: string[];
	acceptedScopes: string[];
}
