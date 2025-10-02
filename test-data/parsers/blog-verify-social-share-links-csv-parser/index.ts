import { BlogVerifySocialShareLinksCsvRecord } from "@dtos/csv";
import { SocialMedia } from "@enums/social-medias";

export interface BlogVerifySocialShareLinksCsvParsedRecord {
	socialMedia: SocialMedia;
	socialMediaUrlPart: string;
	gamdomUrlPart: string;
}

export const parseBlogVerifySocialShareLinksCsvRow = (
	row: BlogVerifySocialShareLinksCsvRecord,
): BlogVerifySocialShareLinksCsvParsedRecord => ({
	socialMedia: row.socialMedia as SocialMedia,
	socialMediaUrlPart: row.socialMediaUrlPart,
	gamdomUrlPart: row.gamdomUrlPart,
});
