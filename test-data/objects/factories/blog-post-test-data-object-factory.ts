import { BlogPostTestData } from "@dtos/test-data";
import { BaseTestDataObjectFactory } from "test-data/base/base-test-data-object-factory";
import { testData } from "test-data/test-data-manager";

export class BlogPostTestDataObjectFactory extends BaseTestDataObjectFactory<
	BlogPostTestData,
	BlogPostTestDataObjectFactory,
	{ coverImagePath: string; thumbnailImagePath: string }
> {
	constructor() {
		super();
	}

	public static override random({
		coverImagePath,
		thumbnailImagePath,
	}: {
		coverImagePath: string;
		thumbnailImagePath: string;
	}): BlogPostTestData {
		return new BlogPostTestData({
			paragraph: testData().fromRandom().data.blogPosts.paragraph(),
			title: testData().fromRandom().data.blogPosts.title(),
			subTitle: testData().fromRandom().data.blogPosts.subTitle(),
			author: testData().fromRandom().data.blogPosts.author(),
			slug: testData().fromRandom().data.blogPosts.slug(),
			categories: [testData().fromRandom().data.blogPosts.category()],
			coverImage: coverImagePath,
			thumbnailImage: thumbnailImagePath,
		});
	}
}
