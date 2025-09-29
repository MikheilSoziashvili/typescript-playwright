import { HomePageBannerCarouselSlideTitle } from "@enums/homepage-banner-carousel-slide-title";

export interface HomePageBannerCarouselCsvRecord {
	bannerName: HomePageBannerCarouselSlideTitle;
	srcPartial: string;
	pageEndpoint: string;
}

export type HomePageBannerCarouselCsv = HomePageBannerCarouselCsvRecord[];
