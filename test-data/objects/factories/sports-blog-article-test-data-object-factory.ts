import { SportsBlogArticleTestData } from "@dtos/test-data";
import { BaseTestDataObjectFactory } from "test-data/base/base-test-data-object-factory";

export class SportsBlogArticleTestDataObjectFactory extends BaseTestDataObjectFactory<
	SportsBlogArticleTestData,
	SportsBlogArticleTestDataObjectFactory
> {
	public static override build(data: {
		title: string;
		customUrl: string;
		subtitle: string;
		detailedDescription?: string;
		author: string;
		articleStartDate?: string;
		articleStartTime?: string;
		coverImage?: string;
		thumbnailImage?: string;
	}): SportsBlogArticleTestData {
		return new SportsBlogArticleTestData({
			title: data.title,
			customUrl: data.customUrl,
			subtitle: data.subtitle,
			detailedDescription:
				data.detailedDescription ??
				"Automation test detailed description",
			author: data.author,
			articleStartDate: data.articleStartDate,
			articleStartTime: data.articleStartTime,
			coverImage:
				data.coverImage ??
				"./test-files/ENG-7656-blog-article-cover-image.jpg",
			thumbnailImage:
				data.thumbnailImage ??
				"./test-files/ENG-7656-blog-article-thumbnail-image.jpg",
		});
	}
}
